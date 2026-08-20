using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Repositories
{
    public class MatriculaRepository : IMatriculaRepository
    {
        private readonly string _connectionString;

        public MatriculaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);
        
        public IEnumerable<Matricula> GetTodas()
        {
            using (var db = Connection)
            {
                var sql = @"
                    SELECT
                        m.Id, m.AlunoId, m.TurmaId, m.DataMatricula,
                        a.Nome AS NomeAluno,
                        t.Nome AS NomeTurma
                    FROM Matricula m
                    INNER JOIN Aluno a ON m.AlunoId = a.Id,
                    INNER JOIN Turma t ON m.TurmaId = t.Id";
                return db.Query<Matricula>(sql);
            }
        }

        public Matricula GetById(int id)
        {
            using (var db = Connection)
            {
                var sql = @"
                    SELECT
                        m.Id, m.AlunoId, m.TurmaId, m.DataMatricula,
                        a.Nome AS NomeAluno,
                        t.Nome AS NomeTurma
                    FROM Matricula m
                    INNER JOIN Aluno a ON m.AlunoId = a.Id,
                    INNER JOIN Turma t ON m.TurmaId = t.Id
                    WHERE Id = @Id";
                return db.QueryFirstOrDefault<Matricula>(sql, new { Id = id });
            }
        }

       public int Criar(
            Matricula matricula,
            IDbConnection connection = null,
            IDbTransaction transaction = null)
        {
            var db = connection ?? Connection;
            try
            {
                return db.Query<int>(
                    @"INSERT INTO Matricula (AlunoId, TurmaId, DataMatricula)
                      VALUES (@AlunoId, @TurmaId, GETDATE());                    
                      SELECT CAST(SCOPE_IDENTITY() as int);",
                    matricula,
                    transaction
                ).Single();
            }
            finally
            {
                if (connection == null) db.Dispose();
            }
        }

        public bool Deletar(int id)
        {
            using (var db = Connection)
            {
                var sql = "DELETE FROM Matricula WHERE Id = @Id";
                return db.Execute(sql, new { Id = id }) > 0;
            }
        }

        public bool AlunoIsMatriculado(
            int alunoId,
            int turmaId,
            IDbConnection connection = null,
            IDbTransaction transaction = null)
        {
            var db = connection ?? Connection;
            try
            {
                return db.ExecuteScalar<int>(
                    @"SELECT COUNT(1)
                      FROM Matricula
                      WHERE AlunoId = @AlunoId
                        AND TurmaId = @TurmaId",
                    new { AlunoId = alunoId, TurmaId = turmaId },
                    transaction
                ) > 0;
            }
            finally
            {
                if (connection == null) db.Dispose();
            }
        }
     }
}
