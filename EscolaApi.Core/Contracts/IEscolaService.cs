using System.Collections.Generic;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Contracts
{
    public interface IEscolaService 
    {
        // Alunos
        PagedResult<Aluno> GetAlunosPaginados(string nome, int page, int pageSize);
        Aluno GetAlunoById(int id);
        int CriarAluno(Aluno aluno);
        bool AtualizarAluno(Aluno aluno);
        bool DeletarAluno(int id); // Exclusão lógica (Ativo = 0)

        // Turmas
        IEnumerable<Turma> GetTurmas();
        Turma GetTurmaById(int id);

        // Matrículas
        int RealizarMatricula(int alunoId, int turmaId);

        // Relatórios
        IEnumerable<RelatorioAlunosByTurmaDto> GetRelatorioAlunosByTurma();
    }
}
