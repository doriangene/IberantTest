using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace PackingList.Core.Queries
{
    [Serializable]
    [DataContract]
    public class QueryResult<T>
    {
        [DataMember]
        [JsonProperty]
        public long Count { get; protected set; }

        [JsonProperty]
        [DataMember]
        public IEnumerable<T> Items { get; protected set; }

        [JsonProperty]
        [DataMember]
        public string ContinuationToken { get; protected set; }

        [JsonConstructor]
        protected QueryResult()
        {

        }

        public QueryResult(IEnumerable<T> items, string continuationToken = null)
        {
            Items = items;
            Count = Items.Count();
            ContinuationToken = continuationToken;
        }

        public QueryResult(IEnumerable<T> items, long count, string continuationToken = null)
        {
            Items = items;
            Count = count;
            ContinuationToken = continuationToken;
        }
    }
}
