using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Repositories
{
    public class TurmaRepository : ITurmaRepository
    {
        private readonly string _connectionString;

        public TurmaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);
        
        public IEnumerable<Turma> GetTodas()
        {
            using (var db = Connection)
            {
                var sql = @"
                    SELECT Id, Nome, Periodo, VagasTotal, VagasDisponiveis
                    FROM Turma";
                return db.Query<Turma>(sql);
            }
        }

        public Turma GetById(
            int id,
            IDbConnection connection = null,
            IDbTransaction transaction = null)
        {
            var db = connection ?? Connection;
            try
            {
                return db.QueryFirstOrDefault<Turma>(
                    @"SELECT Id, Nome, Periodo, VagasTotal, VagasDiponiveis
                      FROM Turma
                      WHERE Id = @Id",
                    new { Id = id },
                    transaction
                );
            }
            finally
            {
                if (connection == null) db.Dispose();
            }
        }

        public int Criar(Turma turma)
        {
            using (var db = Connection)
            {
                var sql = @"
                    INSERT INTO Turma (Nome, Periodo, VagasTotal, VagasDisponiveis)
                    VALUES (@Nome, @Periodo, @VagasTotal, @VagasDisponiveis);
                    SELECT CAST(SCOPE_IDENTITY() as int);";
                return db.Query<int>(sql, turma).Single();
            }
        }

        public bool Atualizar(Turma turma)
        {
            using (var db = Connection)
            {
                var sql = @"
                    UPDATE Turma
                    SET Nome = @Nome,
                        Periodo = @Periodo,
                        VagasTotal = @VagasTotal,
                        VagasDisponiveis = @VagasDisponiveis
                    WHERE Id = @Id;";
                return db.Execute(sql, turma) > 0;
            }
        }

        public bool Deletar(int id)
        {
            using (var db = Connection)
            {
                var sql = "DELETE FROM Turma WHERE Id = @Id";
                return db.Execute(sql, new { Id = id }) > 0;
            }
        }

        public bool DecrementarVaga(
            int turmaId,
            IDbConnection connection = null,
            IDbTransaction transaction = null)
        {
            // Segurança concorrente: apenas decrementa se houver vaga disponível no momento do UPDATE
            return connection.Execute(
                @"UPDATE Turma
                  SET VagasDisponiveis = VagasDisponiveis - 1
                  WHERE Id = @TurmaId
                    AND VagasDisponiveis > 0",
                new { Id = turmaId},
                transaction
            ) > 0;
        }
    }
}
