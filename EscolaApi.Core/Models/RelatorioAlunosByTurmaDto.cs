namespace EscolaApi.Core.Models
{
    public class RelatorioAlunosByTurmaDto
    {
        public string NomeTurma { get; set; }
        public int TotalMatriculados { get; set; }
        public int VagasRestantes { get; set; }
    }
}
