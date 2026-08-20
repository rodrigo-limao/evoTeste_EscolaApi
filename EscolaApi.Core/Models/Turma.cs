namespace EscolaApi.Core.Models
{
    public class Turma
    {
        public int Id { get; set; } 
        public string Nome { get; set; } 
        public string Periodo { get; set; } // Manha, Tarde ou Noite
        public int VagasTotal { get; set; } 
        public int VagasDisponiveis { get; set; } 
    }
}
