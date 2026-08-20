using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Repositories
{
    public class AlunoRepository : IAlunoRepository
    {
        private readonly string _connectionString;

        public AlunoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);
        
        public PagedResult<Aluno> GetPaginado(string nome, int page, int pageSize)
        {
            using (var db = Connection)
            {
                var offset = (page -1) * pageSize;
                var sql = @"
                    SELECT COUNT(1)
                    FROM Aluno
                    WHERE (@Nome IS NULL OR Nome LIKE '%' + @Nome + '%');

                    SELECT Id, Nome, Email, DataNascimento, Ativo, DataCadastro
                    FROM Aluno 
                    WHERE (@Nome IS NULL OR Nome LIKE '%' + @Nome + '%')
                    ORDER BY Id
                    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

                using (var multi = db.QueryMultiple(sql, new
                    {
                        Nome = nome,
                        Offset = offset,
                        PageSize = pageSize
                    }))
                {
                    var total = multi.Read<int>().Single();
                    var items = multi.Read<Aluno>();
                    return new PagedResult<Aluno>
                    {
                        TotalItems = total,
                        Page = page,
                        PageSize = pageSize,
                        Items = items
                    };
                }
            }
        }

        public Aluno GetById(int id)
        {
            using (var db = Connection)
            {
                var sql = @"
                    SELECT Id, Nome, Email, DataNascimento, Ativo, DataCadastro
                    FROM Aluno
                    WHERE Id = @Id";
                return db.QueryFirstOrDefault<Aluno>(sql, new { Id = id });
            }
        }

        public int Criar(Aluno aluno)
        {
            using (var db = Connection)
            {
                var sql = @"
                    INSERT INTO Aluno (Nome, Email, DataNascimento, Ativo, DataCadastro)
                    VALUES (@Nome, @Email, @DataNascimento, 1, GETDATE());
                    SELECT CAST(SCOPE_IDENTITY() as int);";
                return db.Query<int>(sql, aluno).Single();
            }
        }

        public bool Atualizar(Aluno aluno)
        {
            using (var db = Connection)
            {
                var sql = @"
                    UPDATE Aluno
                    SET Nome = @Nome,
                        Email = @Email,
                        DataNascimento = @DataNascimento
                    WHERE Id = @Id;";
                return db.Execute(sql, aluno) > 0;
            }
        }

        // Exclusão lógica: define Ativo = 0
        public bool Deletar(int id)
        {
            using (var db = Connection)
            {
                var sql = @"
                    UPDATE Aluno
                    SET Ativo = 0
                    WHERE Id = @Id";
                return db.Execute(sql, new { Id = id }) > 0;
            }
        }
    }
}
