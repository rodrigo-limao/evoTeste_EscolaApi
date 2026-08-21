using System;
using System.Web.Http;
using EscolaApi.Core.Contracts;

namespace EscolaApi.LegacyWeb.Controllers
{
    [RoutePrefix("api/relatorios")]
    public class RelatoriosController : ApiController
    {
        private readonly IEscolaService _service;

        public RelatoriosController(IEscolaService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("alunos-por-turma")]
        public IHttpActionResult GetAlunosByTurma()
        {
            try
            {
                var relatorio = _service.GetRelatorioAlunosByTurma();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
