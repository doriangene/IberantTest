using System;

namespace PackingList.Core.Queries
{
    public enum SortDirection
    {
        Ascending,
        Descending
    }
    public class SortProfile
    {
        public string Profile { get; private set; }
        public SortDirection Direction { get; private set; }

        public SortProfile(string sortProfile, string sortDirection)
        {
            Profile = sortProfile;
            Direction = (SortDirection)Enum.Parse(typeof(SortDirection), sortDirection);
        }
    }
}
