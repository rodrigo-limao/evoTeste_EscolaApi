using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Repositories
{
    public class RelatorioRepository : IRelatorioRepository
    {
        private readonly string _connectionString;

        public RelatorioRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public IEnumerable<RelatorioAlunosByTurmaDto> GetAlunosByTurma()
        {
            using (var db = Connection)
            {
                // Query otimizada com agregação nativa via banco
                var sql = @"
                    SELECT
                        t.Nome AS NomeTurma,
                        COUNT(m.Id) AS TotalMatriculados,
                        t.VagasDisponiveis AS VagasRestantes
                    FROM Turma t
                    LEFT JOIN Matricula m ON t.Id = m.TurmaId
                    GROUP BY t.Id, t.Nome, t.VagasDisponiveis";
                return db.Query<RelatorioAlunosByTurmaDto>(sql);
            }
        }
    }
}
