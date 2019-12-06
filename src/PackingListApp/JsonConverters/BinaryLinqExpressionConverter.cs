using Serialize.Linq.Serializers;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace PackingList.Core.JsonConverters
{
    public class BinaryLinqExpressionConverter
    {
        public static Expression ReadExpression(byte[] data)
        {
            var expressionSerializer = new ExpressionSerializer(new Serialize.Linq.Serializers.BinarySerializer());
            var expression = expressionSerializer.DeserializeBinary(data);
            return expression;
        }

        public static byte[] WriteExpression(Expression expression)
        {
            var expressionSerializer = new ExpressionSerializer(new Serialize.Linq.Serializers.BinarySerializer());
            return expressionSerializer.SerializeBinary(expression);
        }
    }
}
