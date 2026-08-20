using System.Collections.Generic;
using System.Data;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Contracts
{
    public interface IMatriculaRepository
    {
        IEnumerable<Matricula> GetTodas();
        Matricula GetById(int id);
        int Criar(
            Matricula matricula,
            IDbConnection connection = null,
            IDbTransaction transaction = null);
        bool Deletar(int id);
        bool AlunoIsMatriculado(
            int alunoId,
            int turmaId,
            IDbConnection connection = null,
            IDbTransaction transaction = null);
    }
}
