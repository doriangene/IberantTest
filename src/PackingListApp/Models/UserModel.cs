using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace PackingListApp.Models
{
    public enum AdminType {
        [EnumMember(Value = "Normal")]
        Normal,
        [EnumMember(Value = "Vip")]
        Vip,
        [EnumMember(Value = "King")]
        King,
    };
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        [MaxLength(10)]
        public string Description { get; set; }
        public bool IsAdmin { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public AdminType? AdminType{ get; set; }
    }
}
