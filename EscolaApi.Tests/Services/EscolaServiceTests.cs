using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Exceptions;
using EscolaApi.Core.Infrastructure;
using EscolaApi.Core.Models;
using EscolaApi.Core.Services;

namespace EscolaApi.Tests.Services
{
    [TestClass]
    public class EscolaServiceTests
    {
        private FakeAlunoRepository _alunoRepo;
        private FakeTurmaRepository _turmaRepo;
        private FakeMatriculaRepository _matriculaRepo;
        private FakeRelatorioRepository _relatorioRepo;
        private EscolaService _service;

        [TestInitialize]
        public void Setup()
        {
            _alunoRepo = new FakeAlunoRepository();
            _turmaRepo = new FakeTurmaRepository();
            _matriculaRepo = new FakeMatriculaRepository();
            _relatorioRepo = new FakeRelatorioRepository();

            // Instancia a fábrica abstrata
            var fakeConnectionFactory = new FakeConnectionFactory();

            // Semente de dados padrão para os testes
            _alunoRepo.Alunos.Add(new Aluno { Id = 1, Nome = "Fulano Silva", Ativo = true });
            _alunoRepo.Alunos.Add(new Aluno { Id = 2, Nome = "Ciclano Souza", Ativo = false });
            
            _turmaRepo.Turmas.Add(new Turma { Id = 10, Nome = "Turma A", VagasDisponiveis = 5, VagasTotal = 15 });
            _turmaRepo.Turmas.Add(new Turma { Id = 20, Nome = "Turma B", VagasDisponiveis = 0, VagasTotal = 5 });

            // Instancia o serviço injetando as dependências falsas (Pure DI)
            _service = new EscolaService(_alunoRepo, _turmaRepo, _matriculaRepo, _relatorioRepo, fakeConnectionFactory);
        }

        [TestMethod]
        [ExpectedException(typeof(NotFoundException))]
        public void RealizarMatricula_DeveLancarNotFoundException_QuandoAlunoNaoExiste()
        {
            // Act
            _service.RealizarMatricula(999, 10); // Aluno 999 não existe
        }

        [TestMethod]
        [ExpectedException(typeof(BusinessRuleException))]
        public void RealizarMatricula_DeveLancarBusinessRuleException_QuandoAlunoInativo()
        {
            // Act
            _service.RealizarMatricula(2, 10); // Aluno 2 inativo
        }

        [TestMethod]
        [ExpectedException(typeof(NotFoundException))]
        public void RealizarMatricula_DeveLancarNotFoundException_QuandoTurmaNaoExiste()
        {
            // Act
            _service.RealizarMatricula(1, 999); // Turma 999 não existe
        }

        [TestMethod]
        [ExpectedException(typeof(BusinessRuleException))]
        public void RealizarMatricula_DeveLancarBusinessRuleException_QuandoTurmaSemVagas()
        {
            // Act
            _service.RealizarMatricula(1, 20); // Turma 20 sem vagas
        }

        [TestMethod]
        [ExpectedException(typeof(BusinessRuleException))]
        public void RealizarMatricula_DeveLancarBusinessRuleException_QuandoAlunoJaMatriculado()
        {
            // Arrange
            _matriculaRepo.Matriculados.Add(Tuple.Create(1, 10)); // Simula matricula existente

            // Act
            _service.RealizarMatricula(1, 10); // Aluno 1 já matriculado na Turma 10
        }

        [TestMethod]
        public void RealizarMatricula_DeveCriarMatriculaEDecremendarVaga_QuandoDadosValidos()
        {
            // Act
            int matriculaId = _service.RealizarMatricula(1, 10);

            // Assert
            Assert.AreEqual(1, matriculaId); // Id retornado pela criação da matrícula
            Assert.IsTrue(_matriculaRepo.MetodoCriarChamado, "O método Criar da Matrícula deveria ter sido executado");
            Assert.IsTrue(_turmaRepo.MetodoDecrementarVagaChamado, "O método DecrementarVaga deveria ter sido executado");
        }
    }

    #region Repositórios Falsos (Fake Test Doubles)

    public class FakeDbConnection : IDbConnection
    {
        public string ConnectionString { get; set; }
        public int ConnectionTimeout => 0;
        public string Database => "FakeDb";
        public ConnectionState State => ConnectionState.Open;

        public IDbTransaction BeginTransaction() => new FakeDbTransaction(this);
        public IDbTransaction BeginTransaction(IsolationLevel il) => new FakeDbTransaction(this);

        public void Close() {}
        public void ChangeDatabase(string databaseName) {}
        public IDbCommand CreateCommand() => null;
        public void Open() {} // Sem chamadas de rede

        public void Dispose() {}
    }

    public class FakeDbTransaction : IDbTransaction
    {
        public IDbConnection Connection { get; }
        public IsolationLevel IsolationLevel => IsolationLevel.ReadCommitted;

        public FakeDbTransaction(IDbConnection conn) => Connection = conn;

        public void Commit() {}
        public void Rollback() {}
        public void Dispose() {}
    }

    public class FakeConnectionFactory : IDbConnectionFactory
    {
        public IDbConnection CreateConnection() => new FakeDbConnection();
    }

    public class FakeAlunoRepository : IAlunoRepository
    {
        public List<Aluno> Alunos { get; } = new List<Aluno>();
        public PagedResult<Aluno> GetPaginado(string nome, int page, int pageSize) => null;
        public Aluno GetById(int id) => Alunos.Find(a => a.Id == id);
        public int Criar(Aluno aluno) => 0;
        public bool Atualizar(Aluno aluno) => false;
        public bool Deletar(int id) => false;
    }

    public class FakeTurmaRepository : ITurmaRepository
    {
        public List<Turma> Turmas { get; } = new List<Turma>();
        public bool MetodoDecrementarVagaChamado { get; private set; }
        public IEnumerable<Turma> GetTodas() => Turmas;
        public Turma GetById(int id, IDbConnection conn = null, IDbTransaction tran = null)
        {
            return Turmas.Find(t => t.Id == id);
        }
        public int Criar(Turma turma) => 0;
        public bool Atualizar(Turma turma) => false;
        public bool Deletar(int id) => false;
        public bool DecrementarVaga(int id, IDbConnection conn, IDbTransaction tran)
        {
            var turma = Turmas.Find(t => t.Id == id);
            if (turma == null || turma.VagasDisponiveis <= 0)
            {
                return false;
            }

            turma.VagasDisponiveis--;
            MetodoDecrementarVagaChamado = true;
            return true;
        }
    }

    public class FakeMatriculaRepository : IMatriculaRepository
    {
        public List<Tuple<int, int>> Matriculados { get; } = new List<Tuple<int, int>>();
        public bool MetodoCriarChamado { get; private set; }
        public IEnumerable<Matricula> GetTodas() => null;
        public Matricula GetById(int id) => null;
        public bool AlunoIsMatriculado(int alunoId, int turmaId, IDbConnection conn, IDbTransaction tran)
        {
            return Matriculados.Exists(m => m.Item1 == alunoId && m.Item2 == turmaId);
        }
        public int Criar(Matricula matricula, IDbConnection conn, IDbTransaction tran)
        {
            MetodoCriarChamado = true;
            return 1;
        }
        public bool Deletar(int id) => false;
    }

    public class FakeRelatorioRepository : IRelatorioRepository
    {
        public IEnumerable<RelatorioAlunosByTurmaDto> GetAlunosByTurma() => null;
    }
    
    #endregion
}
