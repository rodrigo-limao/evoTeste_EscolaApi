using System.Data;

namespace EscolaApi.Core.Contracts
{
    public interface IDbConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
