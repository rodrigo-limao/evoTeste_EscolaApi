using System.Collection.Generic;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Contracts
{
    public interface IEscolaService 
    {
        // Alunos
        IEnumerable<Aluno> GetAlunos();
        Aluno GetAlunoById(int id);
        int CriarAluno(Aluno aluno);
        bool AtualizarAluno(Aluno aluno);
        bool DeletarAluno(int id);

        // Turmas
        IEnumerable<Turma> GetTurmas();
        Turma GetTurmaById(int id);
        int CriarTurma(Turma turma);
        bool AtualizarTurma(Turma Turma);
        bool DeletarTurma(int id);

        // Matriculas
        IEnumerable<Matricula> GetMatriculas();
        Matricula GetMatriculaById(int id);
        int MatriculaAnulo(int alunoId, int turmaId);
        bool CancelarMatricula(int id);
    }
}
