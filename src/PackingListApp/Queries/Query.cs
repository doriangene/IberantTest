using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using PackingList.Core.JsonConverters;
using PackingList.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.Serialization;
using System.Text;

namespace PackingList.Core.Queries
{
    [DataContract]
    [Serializable]
    public class Query<TProjection>
    {
        [DataMember(Name = "Includes")]
        [JsonProperty(PropertyName = "Includes")]
        protected List<string> _includes;

        [DataMember(Name = "EntityType")]
        [JsonProperty(PropertyName = "EntityType")]
        protected string _entityType;

        [DataMember(Name = "Parameters")]
        [JsonProperty(PropertyName = "Parameters")]
        protected Dictionary<string, object> _parameters;

        [DataMember]
        public int Skip { get; protected set; }

        [DataMember]
        public int Take { get; protected set; }

        [DataMember(Name = "OrderBy")]
        [JsonProperty(PropertyName = "OrderBy")]
        protected List<OrderBy> _orderBy;

        [DataMember(Name = "Filter")]
        [JsonProperty(PropertyName = "Filter")]
        protected byte[] _filter;

        [DataMember(Name = "Projection")]
        [JsonProperty(PropertyName = "Projection")]
        protected byte[] _projection;

        [IgnoreDataMember]
        [JsonIgnore]
        public Type EntityType
        {
            get
            {
                if (_entityType == null)
                    return null;
                return Type.GetType(_entityType);
            }
            protected set
            {
                _entityType = value.AssemblyQualifiedName;
            }
        }

        [IgnoreDataMember]
        [JsonIgnore]
        public Expression Filter
        {
            get
            {
                if (_filter == null)
                    return null;
                return BinaryLinqExpressionConverter.ReadExpression(_filter);
            }
            protected set
            {
                _filter = BinaryLinqExpressionConverter.WriteExpression(value);
            }
        }

        [IgnoreDataMember]
        [JsonIgnore]
        public Expression Projection
        {
            get
            {
                if (_projection == null)
                    return null;
                return BinaryLinqExpressionConverter.ReadExpression(_projection);
            }
            protected set
            {
                _projection = BinaryLinqExpressionConverter.WriteExpression(value);
            }
        }

        [IgnoreDataMember]
        [JsonIgnore]
        public IReadOnlyList<string> Includes => _includes;

        [IgnoreDataMember]
        [JsonIgnore]
        public IReadOnlyList<OrderBy> OrderBy => _orderBy;

        [IgnoreDataMember]
        [JsonIgnore]
        public IReadOnlyDictionary<string, object> Parameters => _parameters;

        public Query()
        {
            Take = 5000;
        }

        public Query<TProjection> SetSkip(int value)
        {
            Skip = value;
            return this;
        }

        public Query<TProjection> SetTake(int value)
        {
            Take = value;
            return this;
        }

        public Query<TProjection> AddParameter(string name, object value)
        {
            if (_parameters == null)
                _parameters = new Dictionary<string, object>();
            _parameters.Add(name, value);
            return this;
        }

        public Query<TProjection> AddInclude(string include)
        {
            if (_includes == null)
                _includes = new List<string>();
            _includes.Add(include);
            return this;
        }

        public Query<TProjection> AddIncludes(params string[] includes)
        {
            foreach (var include in includes)
            {
                AddInclude(include);
            }
            return this;
        }
    }

    [DataContract]
    [Serializable]
    public class Query<TEntity, TProjection> : Query<TProjection>
        where TEntity : class
    {
        private static JsonLinqExpressionConverter _linqConverter = new JsonLinqExpressionConverter();

        public Query() : base()
        {
            EntityType = typeof(TEntity);
        }

        public new Query<TEntity, TProjection> AddParameter(string name, object value)
        {
            return (Query<TEntity, TProjection>)base.AddParameter(name, value);
        }

        public new Query<TEntity, TProjection> AddInclude(string include)
        {
            return (Query<TEntity, TProjection>)base.AddInclude(include);
        }

        public new Query<TEntity, TProjection> AddIncludes(params string[] includes)
        {
            return (Query<TEntity, TProjection>)base.AddIncludes(includes);
        }

        public Query<TEntity, TProjection> AddFilter(Expression<Func<TEntity, bool>> filter)
        {
            if (Filter == null)
            {
                Filter = filter;
                return this;
            }
            var filterExpression = (Expression<Func<TEntity, bool>>)Filter;
            var parameter = Expression.Parameter(typeof(TEntity), filterExpression.Parameters[0].Name);

            var newFilterExpression = new ExpressionParaneterRenamer(filter.Parameters[0].Name, filterExpression.Parameters[0].Name).Rename(filter.Body);
            var body = Expression.And(filterExpression.Body, newFilterExpression);
            LambdaExpression lambda = Expression.Lambda(body, parameter);
            Filter = (Expression<Func<TEntity, bool>>)lambda;
            return this;
        }

        public new Query<TEntity, TProjection> SetSkip(int value)
        {
            return (Query<TEntity, TProjection>)base.SetSkip(value);
        }

        public new Query<TEntity, TProjection> SetTake(int value)
        {
            return (Query<TEntity, TProjection>)base.SetTake(value);
        }

        public Query<TEntity, TProjection> SetProjection(Expression<Func<TEntity, TProjection>> projection)
        {
            Projection = projection;
            return this;
        }

        public Query<TEntity, TProjection> AddOrderBy(Expression<Func<TEntity, object>> orderBy, bool ascending = true)
        {
            if (_orderBy == null)
                _orderBy = new List<OrderBy>();
            _orderBy.Add(new OrderBy(orderBy, ascending));
            return this;
        }

        public Query<TEntity, TProjection> AddOptions(ODataQueryOptions<TEntity> options)
        {
            if (options != null && options.Filter != null)
                AddFilter(options.Filter.ToExpression<TEntity>());
            if (options != null && options.Skip != null)
                SetSkip(options.Skip.Value);
            if (options != null && options.Top != null)
                SetTake(options.Top.Value);

            if (options != null && options.OrderBy != null && options.OrderBy.OrderByClause != null)
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

                    AddOrderBy(lambda, typedNode.OrderByClause.Direction == Microsoft.OData.UriParser.OrderByDirection.Ascending ? true : false);
                }
            }
            return this;
        }

        public Query<TEntity, TProjection> AddSearch(IQueryCollection query, Func<string, Expression<Func<TEntity, bool>>> searchQuery)
        {
            if (query.ContainsKey("$search"))
            {
                var q = query["$search"];
                AddFilter(searchQuery(q));
            }
            return this;
        }

        public Query<TEntity, TProjection> AddSortProfile(IQueryCollection query, Action<SortProfile, Query<TEntity, TProjection>> sortProfileBuilder)
        {
            if (query.ContainsKey("sortProfile"))
            {
                var sortProfileStr = (string)query["sortProfile"];
                if (!string.IsNullOrWhiteSpace(sortProfileStr))
                {
                    var raw = ((string)query["sortProfile"]).Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    var sortProfile = new SortProfile(raw[0], raw[1]);
                    sortProfileBuilder(sortProfile, this);
                }
            }
            return this;
        }
    }

    [DataContract]
    [Serializable]
    public class OrderBy
    {
        [DataMember(Name = "OrderByField")]
        [JsonProperty(PropertyName = "OrderByField")]
        private byte[] _field;

        [IgnoreDataMember]
        [JsonIgnore]
        public Expression Field
        {
            get
            {
                if (_field == null)
                    return null;
                return BinaryLinqExpressionConverter.ReadExpression(_field);
            }
            private set
            {
                _field = BinaryLinqExpressionConverter.WriteExpression(value);
            }
        }

        [DataMember]
        public bool Ascending { get; private set; }

        public OrderBy(Expression field, bool ascending = true)
        {
            Field = field;
            Ascending = ascending;
        }
    }
}
