using Microsoft.AspNet.OData.Query;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PackingList.Core.Queries;
using PackingList.Core.Utils.ArrayExtensions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Security.Claims;
using System.Security.Principal;

namespace PackingList.Core.Utils
{
    public static class ObjectExtensions
    {
        public static void CopyTo<T>(this T source, T target)
        {
            var objectType = source.GetType();
            foreach (var property in objectType.GetProperties())
            {
                if (IsPrimitive(property.PropertyType) || property.PropertyType.Name == "Nullable`1")
                {
                    var getMethod = property.GetGetMethod();
                    var setMethod = property.GetSetMethod(true);
                    var sourceValue = getMethod.Invoke(source, new object[0]);
                    var destValue = getMethod.Invoke(target, new object[0]);
                    if ((sourceValue == null && destValue != null) || (sourceValue != null && destValue == null) || (sourceValue != null && !sourceValue.Equals(destValue)))
                    {
                        setMethod.Invoke(target, new[] { sourceValue });
                    }
                }
                else
                {
                    if (property.PropertyType.Name == "ICollection`1" || property.PropertyType.Name == "IList`1")
                    {
                        var getMethod = property.GetGetMethod();
                        var mergeMethod = typeof(ObjectExtensions).GetMethod("MergeCollections", BindingFlags.NonPublic | BindingFlags.Static).MakeGenericMethod(new Type[] { property.PropertyType.GetGenericArguments()[0] });
                        mergeMethod.Invoke(null, new[] { getMethod.Invoke(source, new object[0]), getMethod.Invoke(target, new object[0]) });
                    }
                }
            }
        }

        private static void MergeCollections<TEntity>(ICollection<TEntity> source, ICollection<TEntity> target)
        {
            if (source == null)
            {
                return;
            }

            // Delete non-existing in target
            foreach (var item in target.ToList().Where(t => source.All(s => s == null || !s.Equals(t))))
            {
                target.Remove(item);
            }

            // Merge existing items or add new ones
            foreach (var s in source)
            {
                var t = target.FirstOrDefault(o => o.Equals(s));
                if (t == null)
                {
                    target.Add(s);
                }
                else
                {
                    var sType = s.GetType();

                    // Recursive update properties
                    CopyTo(s, t);

                }
            }
        }

        private static readonly MethodInfo CloneMethod = typeof(object).GetMethod("MemberwiseClone", BindingFlags.NonPublic | BindingFlags.Instance);

        public static bool IsPrimitive(this Type type)
        {
            if (type == typeof(string))
            {
                return true;
            }

            return (type.IsValueType /*& type.IsPrimitive*/);
        }

        public static object Copy(this object originalObject)
        {
            return InternalCopy(originalObject, new Dictionary<object, object>(new ReferenceEqualityComparer()));
        }
        private static object InternalCopy(object originalObject, IDictionary<object, object> visited)
        {
            if (originalObject == null)
            {
                return null;
            }

            var typeToReflect = originalObject.GetType();
            if (IsPrimitive(typeToReflect))
            {
                return originalObject;
            }

            if (visited.ContainsKey(originalObject))
            {
                return visited[originalObject];
            }

            if (typeof(Delegate).IsAssignableFrom(typeToReflect))
            {
                return null;
            }

            var cloneObject = CloneMethod.Invoke(originalObject, null);
            if (typeToReflect.IsArray)
            {
                var arrayType = typeToReflect.GetElementType();
                if (IsPrimitive(arrayType) == false)
                {
                    Array clonedArray = (Array)cloneObject;
                    clonedArray.ForEach((array, indices) => array.SetValue(InternalCopy(clonedArray.GetValue(indices), visited), indices));
                }
            }
            visited.Add(originalObject, cloneObject);
            CopyFields(originalObject, visited, cloneObject, typeToReflect);
            RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect);
            return cloneObject;
        }

        private static void RecursiveCopyBaseTypePrivateFields(object originalObject, IDictionary<object, object> visited, object cloneObject, Type typeToReflect)
        {
            if (typeToReflect.BaseType != null)
            {
                RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect.BaseType);
                CopyFields(originalObject, visited, cloneObject, typeToReflect.BaseType, BindingFlags.Instance | BindingFlags.NonPublic, info => info.IsPrivate);
            }
        }

        private static void CopyFields(object originalObject, IDictionary<object, object> visited, object cloneObject, Type typeToReflect, BindingFlags bindingFlags = BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.FlattenHierarchy, Func<FieldInfo, bool> filter = null)
        {
            foreach (FieldInfo fieldInfo in typeToReflect.GetFields(bindingFlags))
            {
                if (filter != null && filter(fieldInfo) == false)
                {
                    continue;
                }

                if (IsPrimitive(fieldInfo.FieldType))
                {
                    continue;
                }

                var originalFieldValue = fieldInfo.GetValue(originalObject);
                var clonedFieldValue = InternalCopy(originalFieldValue, visited);
                fieldInfo.SetValue(cloneObject, clonedFieldValue);
            }
        }
        public static T Copy<T>(this T original)
        {
            return (T)Copy((object)original);
        }
    }

    public class ReferenceEqualityComparer : EqualityComparer<object>
    {
        public override bool Equals(object x, object y)
        {
            return ReferenceEquals(x, y);
        }
        public override int GetHashCode(object obj)
        {
            if (obj == null)
            {
                return 0;
            }

            return obj.GetHashCode();
        }
    }

    namespace ArrayExtensions
    {
        public static class ArrayExtensions
        {
            public static void ForEach(this Array array, Action<Array, int[]> action)
            {
                if (array.LongLength == 0)
                {
                    return;
                }

                ArrayTraverse walker = new ArrayTraverse(array);
                do
                {
                    action(array, walker.Position);
                }
                while (walker.Step());
            }
        }

        internal class ArrayTraverse
        {
            public int[] Position;
            private readonly int[] maxLengths;

            public ArrayTraverse(Array array)
            {
                maxLengths = new int[array.Rank];
                for (int i = 0; i < array.Rank; ++i)
                {
                    maxLengths[i] = array.GetLength(i) - 1;
                }
                Position = new int[array.Rank];
            }

            public bool Step()
            {
                for (int i = 0; i < Position.Length; ++i)
                {
                    if (Position[i] < maxLengths[i])
                    {
                        Position[i]++;
                        for (int j = 0; j < i; j++)
                        {
                            Position[j] = 0;
                        }
                        return true;
                    }
                }
                return false;
            }
        }
    }

    public class ExpressionParaneterRenamer : ExpressionVisitor
    {
        private readonly string _sourceName;
        private readonly string _destName;

        public ExpressionParaneterRenamer(string sourceName, string destName)
        {
            _sourceName = sourceName;
            _destName = destName;
        }
        public Expression Rename(Expression expression)
        {
            return Visit(expression);
        }

        protected override Expression VisitParameter(ParameterExpression node)
        {
            if (node.Name == _sourceName)
            {
                return Expression.Parameter(node.Type, _destName);
            }
            else
            {
                return node;
            }
        }
    }

    public static class Extensions
    {
     

        public static MethodInfo FindMethod(this Type type, string name, Type[] args)
        {
            var method = type.FindGenericMethod(name, args);
            if (method != null)
                return method;
            foreach (Type interf in type.GetInterfaces())
            {
                method = interf.FindGenericMethod(name, args);
                if (method != null)
                    return method;
            }
            throw new ArgumentException($"Method '{name}' not found in class {type.Name}");
        }

        public static MethodInfo FindGenericMethod(this Type type, string name, Type[] args)
        {
            const BindingFlags flags = BindingFlags.Public | BindingFlags.FlattenHierarchy | BindingFlags.Instance;
            var method = type.GetMethod(name, flags, null, args, null);
            if (method == null)
                method = type.GetMethods(flags).FirstOrDefault(o => o.Name == name);
            if (method != null && method.IsGenericMethodDefinition)
                method = method.MakeGenericMethod(args);
            return method;
        }

        public static IEnumerable<MethodInfo> FindMethods(this Type type, string name)
        {
            const BindingFlags flags = BindingFlags.Public | BindingFlags.FlattenHierarchy | BindingFlags.Instance;
            var list = new List<MethodInfo>();
            list.AddRange(type.GetMethods(flags).Where(m => m.Name == name));
            return list;
        }

        public static IEnumerable<string> GetAllBaseTypes(this Type type)
        {
            var list = new List<string>();
            var baseType = type.BaseType;
            while (baseType != null)
            {
                list.Add(baseType.Name);
                baseType = baseType.BaseType;
            }
            return list;
        }

        public static object As(this string key, Type keyType)
        {
            if (keyType.Equals(typeof(Guid)))
                return Guid.Parse(key);

            if (keyType.Equals(typeof(int)))
                return int.Parse(key);

            if (keyType.Equals(typeof(long)))
                return long.Parse(key);

            if (keyType.Equals(typeof(DateTimeOffset)))
                return DateTimeOffset.Parse(key);

            if (keyType.Equals(typeof(DateTime)))
                return DateTime.Parse(key);

            if (keyType.Equals(typeof(string)))
                return key;
            try
            {
                return Convert.ChangeType(key, keyType);
            }
            catch
            {
                throw new ArgumentException("As<TKey> doesnt support the type passed");
            }
        }

        public static TKey As<TKey>(this string key)
        {
            return (TKey)As(key, typeof(TKey));
        }
        public static void ApplyTo(this object source, object target, string[] excludedProperties = null, BindingFlags memberAccess = BindingFlags.FlattenHierarchy | BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public)
        {
            //https://weblog.west-wind.com/posts/2009/Aug/04/Simplistic-Object-Copying-in-NET
            var properties = target.GetType().GetProperties(memberAccess);
            foreach (var property in properties)
            {
                string name = property.Name;

                // Skip over any property exceptions
                if (excludedProperties != null &&
                    excludedProperties.Contains(name))
                    continue;

                PropertyInfo SourceField = source.GetType().GetProperty(name, memberAccess);
                if (SourceField == null)
                    continue;

                if (property.CanWrite && SourceField.CanRead)
                {
                    object SourceValue = SourceField.GetValue(source, null);
                    property.SetValue(target, SourceValue, null);
                }
            }
        }

        public static string ToUpperTitleCase(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return value;
            return Char.ToUpper(value[0]) + value.Substring(1);
        }

        public static object TryConvert(this Type type, object value)
        {
            if (value == null)
                return value;
            if (value.GetType() == type)
                return value;
            if (type.Name == "Nullable`1")
                type = type.GenericTypeArguments[0];
            return Convert.ChangeType(value, type);
        }



        public static Expression<Func<TElement, bool>> ToExpression<TElement>(this FilterQueryOption filter)
        {
            if (filter == null)
                return null;

            // Avoid InvalidOperationException
            // see https://github.com/aspnet/EntityFrameworkCore/issues/10721
            var oDataSettings = new ODataQuerySettings();
            oDataSettings.HandleNullPropagation = HandleNullPropagationOption.False;

            var queryable = Enumerable.Empty<TElement>().AsQueryable();
            var where = filter.ApplyTo(queryable, oDataSettings).Expression;
            var whereType = where.GetType();
            var whereArguments = (ReadOnlyCollection<Expression>)whereType.GetProperty("Arguments").GetGetMethod().Invoke(where, new object[0]);
            var unaryExpression = whereArguments[1];
            var result = unaryExpression.GetType().GetProperty("Operand")?.GetGetMethod()?.Invoke(unaryExpression, new object[0]);
            return (Expression<Func<TElement, bool>>)result;
        }

        public static void InvokeConfigureServices<TStartupType>(IConfiguration configuration, IServiceCollection services)
        {
            var startupType = typeof(TStartupType);
            var ctor = startupType.GetConstructors().First();
            var ctorParams = ctor.GetParameters();
            var ctorParamsInstances = new object[ctorParams.Length];
            for (var idx = 0; idx < ctorParams.Length; idx++)
            {
                if (ctorParams[idx].ParameterType == typeof(IConfiguration))
                {
                    ctorParamsInstances[idx] = configuration;
                }
                else
                if (ctorParams[idx].ParameterType == typeof(IServiceCollection))
                {
                    ctorParamsInstances[idx] = services;
                }
                else
                {

                }
            }
            var startup = ctor.Invoke(ctorParamsInstances);
            InvokeConfigureServices(startup, configuration, services);
        }

        public static void InvokeConfigureServices(object startup, IConfiguration configuration, IServiceCollection services)
        {
            var startupType = startup.GetType();
            var method = startupType.GetMethod("ConfigureDependencies") ?? startupType.GetMethod("ConfigureServices");
            var methodParams = method.GetParameters();
            var methodParamsInstances = new object[methodParams.Length];
            for (var idx = 0; idx < methodParams.Length; idx++)
            {
                if (methodParams[idx].ParameterType == typeof(IConfiguration))
                {
                    methodParamsInstances[idx] = configuration;
                }
                else
                if (methodParams[idx].ParameterType == typeof(IServiceCollection))
                {
                    methodParamsInstances[idx] = services;
                }
            }
            method.Invoke(startup, methodParamsInstances);
        }

        public static Query<TEntity, TProjection> AsQuery<TEntity, TProjection>(this ODataQueryOptions<TEntity> options, Func<Query<TEntity, TProjection>,
           Query<TEntity, TProjection>> extendQuery = null,
           Func<string, Expression<Func<TEntity, bool>>> buildSearch = null,
           Action<SortProfile, Query<TEntity, TProjection>> buildSortProfile = null)
           where TEntity : class
        {
            var query = new Query<TEntity, TProjection>();
            if (extendQuery != null)
            {
                query = extendQuery(query);
            }
            if (options != null)
            {
                if (options.Skip != null)
                {
                    query.SetSkip(options.Skip.Value);
                }
                if (options.Top != null)
                {
                    query.SetTake(options.Top.Value);
                }
                if (options.Filter != null)
                {
                    query.AddFilter(options.Filter.ToExpression<TEntity>());
                }
                if (options.Request.Query.ContainsKey("$search"))
                {
                    if (buildSearch == null)
                    {
                        buildSearch = q => model => true;
                    }
                    var searchFilter = buildSearch(options.Request.Query["$search"]);
                    if (searchFilter != null)
                    {
                        query.AddFilter(searchFilter);
                    }
                }
                if (options.Request.Query.ContainsKey("sortProfile"))
                {
                    if (buildSortProfile == null)
                    {
                        buildSortProfile = (sp, qry) => { };
                    }
                    var raw = ((string)options.Request.Query["sortProfile"]).Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    var sortProfile = new SortProfile(raw[0], raw[1]);
                    buildSortProfile(sortProfile, query);
                }
                else
                {
                    if (options.OrderBy != null && options.OrderBy.OrderByClause != null)
                    {
                        var entityProps = typeof(TEntity).GetProperties().ToList();
                        foreach (var node in options.OrderBy.OrderByNodes)
                        {
                            var typedNode = node as OrderByPropertyNode;

                            var prop = entityProps.FirstOrDefault(o => o.Name.ToLowerInvariant() == typedNode.Property.Name.ToLowerInvariant());
                            if (prop == null)
                                throw new ArgumentException($"Property '{typedNode.Property.Name}' not found on entity '{typeof(TEntity).Name}'");

                            var param = Expression.Parameter(typeof(TEntity), "o");
                            var expression = Expression.Property(param, prop.Name);
                            Expression converted = Expression.Convert(expression, typeof(object));
                            dynamic lambda = Expression.Lambda<Func<TEntity, object>>(converted, param);

                            query.AddOrderBy(lambda, typedNode.OrderByClause.Direction == Microsoft.OData.UriParser.OrderByDirection.Ascending ? true : false);
                        }
                    }
                }
            }
            return query;
        }

        public static IQueryable<TModel> ApplyTo<TModel, TProjection>(this Query<TProjection> query, IQueryable<TModel> queryable, bool ignoreSkip = false, bool ignoreTake = false) where TModel : class
        {
            if (query.Includes != null && query.Includes.Any())
            {
                foreach (var include in query.Includes)
                {
                    queryable = queryable.Include(include);
                }
            }
            if (query.Filter != null)
            {
                queryable = queryable.Where((Expression<Func<TModel, bool>>)query.Filter);
            }
            if (query.OrderBy != null && query.OrderBy.Any())
            {
                var orderBy = query.OrderBy.First();
                IOrderedQueryable<TModel> orderedQuery;

                if (orderBy.Ascending)
                {
                    orderedQuery = queryable.OrderBy((Expression<Func<TModel, object>>)orderBy.Field);
                }
                else
                {
                    orderedQuery = queryable.OrderByDescending((Expression<Func<TModel, object>>)orderBy.Field);
                }
                foreach (var thenBy in query.OrderBy.Skip(1))
                {
                    if (thenBy.Ascending)
                    {
                        orderedQuery = orderedQuery.ThenBy((Expression<Func<TModel, object>>)thenBy.Field);
                    }
                    else
                    {
                        orderedQuery = orderedQuery.ThenByDescending((Expression<Func<TModel, object>>)thenBy.Field);
                    }
                }
                queryable = orderedQuery;
            }

            if (!ignoreSkip)
                queryable.Skip(query.Skip);

            if (!ignoreTake)
                queryable.Skip(query.Take);
            return queryable;
        }
    }
}
