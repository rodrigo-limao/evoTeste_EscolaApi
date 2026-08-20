using System.Collections.Generic;
using System.Data;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Contracts
{
    public interface ITurmaRepository
    {
        IEnumerable<Turma> GetTodas();
        Turma GetById(
            int id,
            IDbConnection connection = null,
            IDbTransaction transction = null);
        int Criar(Turma aluno);
        bool Atualizar(Turma aluno);
        bool Deletar(int id);
        bool DecrementarVaga (
            int turmaid,
            IDbConnection connection = null,
            IDbTransaction transction = null);
    }
}
