using Newtonsoft.Json;
using Serialize.Linq.Serializers;
using System;
using System.Linq.Expressions;

namespace PackingList.Core.JsonConverters
{
    public class JsonLinqExpressionConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType.Name.StartsWith("Expression1`");
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            var str = serializer.Deserialize<string>(reader);
            var expressionSerializer = new ExpressionSerializer(new Serialize.Linq.Serializers.JsonSerializer());
            var expression = expressionSerializer.DeserializeText(str);
            return expression;
        }

        public override void WriteJson(JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            var expressionSerializer = new ExpressionSerializer(new Serialize.Linq.Serializers.JsonSerializer());
            var result = expressionSerializer.SerializeText((Expression)value);
            writer.WriteValue(result);
        }
    }
}
