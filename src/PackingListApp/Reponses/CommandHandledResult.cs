using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
public class CommandHandledResult
{
    public bool IsSuccess { get; private set; }
    public string Identifier { get; private set; }
    public string AggregateId { get; private set; }
    public string CorrelationId { get; private set; }
    public IReadOnlyList<string> Messages { get; private set; }

    public CommandHandledResult(bool isSuccess, string identifier, string aggregateId = null, string correlationId = null, IEnumerable<string> messages = null)
    {
        Identifier = identifier;
        CorrelationId = correlationId;
        IsSuccess = isSuccess;
        AggregateId = aggregateId;
        Messages = messages == null ? new List<string>() : messages.ToList();
    }
}