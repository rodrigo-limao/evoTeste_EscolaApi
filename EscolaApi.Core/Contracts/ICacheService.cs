using System;

namespace EscolaApi.Core.Contracts
{
    public interface ICacheService
    {
        T Get<T>(string key);
        void Set(string key, object value, int expirationMinutes);
        void Remove(string key);
    }
}
