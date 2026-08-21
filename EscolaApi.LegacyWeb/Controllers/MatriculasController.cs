using System;
using System.Web.Http;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Exceptions;

namespace EscolaApi.LegacyWeb.Controllers
{
    public class MatriculaRequest
    {
        public int AlunoId { get; set; }
        public int TurmaId { get; set; }
    }

    [RoutePrefix("api/matriculas")]
    public class MatriculasController : ApiController
    {
        private readonly IEscolaService _service;

        public MatriculasController(IEscolaService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult RealizarMatricula([FromBody] MatriculaRequest request)
        {
            if (request == null || request.AlunoId <= 0 || request.TurmaId <= 0)
                return BadRequest("Id do aluno e da turma são obrigatórios e devem ser válidos.");

            try
            {
                var matriculaId = _service.RealizarMatricula(request.AlunoId, request.TurmaId);
                return Created(new Uri(Request.RequestUri + "/" + matriculaId), new { Id = matriculaId }); // 201
            }
            catch (NotFoundException)
            {
                return NotFound(); // 404
            }
            catch (BusinessRuleException ex)
            {
                // 409 Conflict (turma sem vaga, aluno inativo ou duplicado, ...)
                return Content(System.Net.HttpStatusCode.Conflict, new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
