using System.Collections.Generic;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Contracts
{
    public interface IRelatorioRepository
    {
        IEnumerable<RelatorioAlunosByTurmaDto> GetAlunosByTurma();
    }
}
