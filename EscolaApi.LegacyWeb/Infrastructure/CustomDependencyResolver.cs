using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http.Dependencies;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Repositories;
using EscolaApi.Core.Services;

namespace EscolaApi.LegacyWeb.Infrastructure
{
    public class CustomDependencyResolver : IDependencyResolver
    {
        private readonly string _connectionString;

        public CustomDependencyResolver()
        {
            // Busca a connection centralizada do Web.Config ou fallback padrão
            _connectionString = ConfigurationManager.ConnectionStrings["EscolaDB"]?.ConnectionString ??
                "Server=localhost,1433;Database=TesteEscola;User Id=sa;Password=YourStr0ngP@ssword123;TrustServerCertificate=True;";
        }

        public object GetService(Type serviceType)
        {
            // Dependency Injection
            var alunoRepository = new AlunoRepository(_connectionString);
            var turmaRepository = new TurmaRepository(_connectionString);
            var matriculaRepository = new MatriculaRepository(_connectionString);
            var relatorioRepository = new RelatorioRepository(_connectionString);

            var service = new EscolaService(alunoRepository, turmaRepository, matriculaRepository, relatorioRepository, _connectionString);

            // Tabela de resolução: mais eficiente que Ifs e Switch
            var factories = new Dictionary<Type, Func<object>>
            {
                { typeof(Controllers.AlunosController),      () => new Controllers.AlunosController(service) },
                { typeof(Controllers.TurmasController),      () => new Controllers.TurmasController(service) },
                { typeof(Controllers.MatriculasController),      () => new Controllers.MatriculasController(service) },
                { typeof(Controllers.RelatoriosController),      () => new Controllers.RelatoriosController(service) },
            };

            // Se o dic tiver uma factory para o Type pedido, executa e cria o Controller
            // Senão, retorna null
            return factories.TryGetValue(serviceType, out var factory) ? factory() : null;
       }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return new List<object>();
        }

        public IDependencyScope BeginScope()
        {
            return this;
        }

        public void Dispose() {}
    }
}
