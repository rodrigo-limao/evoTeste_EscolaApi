using System;
using System.Web.Script.Serialization;
using StackExchange.Redis;
using EscolaApi.Core.Contracts;

namespace EscolaApi.Core.Services
{
    public class RedisCacheService : ICacheService
    {
        private readonly ConnectionMultiplexer _redis;
        private readonly IDatabase _db;
        private readonly JavaScriptSerializer _serializer = new JavaScriptSerializer();

        public RedisCacheService(string connectionString)
        {
            _redis = ConnectionMultiplexer.Connect(connectionString);
            _db = _redis.GetDatabase();
        }

        public T Get<T>(string key)
        {
            var value = _db.StringGet(key);
            if (value.IsNullOrEmpty)
                return default(T);

            return _serializer.Deserialize<T>(value);
        }

        public void Set(string key, object value, int expirationMinutes)
        {
            if (value == null) return;

            var json = _serializer.Serialize(value);
            _db.StringSet(key, json, TimeSpan.FromMinutes(expirationMinutes));
        }

        public void Remove(string key)
        {
            _db.KeyDelete(key);
        }
    }
}
