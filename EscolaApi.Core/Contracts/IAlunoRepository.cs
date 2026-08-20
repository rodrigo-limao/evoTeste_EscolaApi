using System.Collections.Generic;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Contracts
{
    public interface IAlunoRepository
    {
        PagedResult<Aluno> GetPaginado(string nome, int page, int pageSize);
        Aluno GetById(int id);
        int Criar(Aluno aluno);
        bool Atualizar(Aluno aluno);
        bool Deletar(int id); // Exclusão lógica: define Ativo = 0
    }
}
