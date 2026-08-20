using System;

namespace EscolaApi.Core.Models
{
    public class Matricula
    {
        public int Id { get; set; } 
        public int AlunoId { get; set; } 
        public int TurmaId { get; set; } 
        public DateTime DataMatricula { get; set; } 

        // Propriedades auxiliares para JOINS de leitura
        public string NomeAluno { get; set; }
        public string NomeTurma { get; set; }
    }
}
