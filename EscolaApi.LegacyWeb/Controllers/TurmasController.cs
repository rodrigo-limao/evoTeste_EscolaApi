using System;
using System.Web.Http;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Exceptions;

namespace EscolaApi.LegacyWeb.Controllers
{
    [RoutePrefix("api/turmas")]
    public class TurmasController : ApiController
    {
        private readonly IEscolaService _service;

        public TurmasController(IEscolaService service)
        {
            _service = service;
        }

        [HttpGet]
        public IHttpActionResult GetTodas()
        {
            try
            {
                var turmas = _service.GetTurmas();
                return Ok(turmas);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var turma = _service.GetTurmaById(id);
                return Ok(turma);
            }
            catch (NotFoundException)
            {
                return NotFound(); // 404
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
