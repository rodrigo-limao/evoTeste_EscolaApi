using System;
using System.Web.Http;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Exceptions;
using EscolaApi.Core.Models;

namespace EscolaApi.LegacyWeb.Controllers
{
    [RoutePrefix("api/alunos")]
    public class AlunosController : ApiController
    {
        private readonly IEscolaService _service;

        public AlunosController(IEscolaService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetPaginados(string nome = null, int page = 1, int pageSize = 10)
        {
            try
            {
                var result = _service.GetAlunosPaginados(nome, page, pageSize);
                return Ok(result);
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
                var aluno = _service.GetAlunoById(id);
                return Ok(aluno);
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

        [HttpPost]
        public IHttpActionResult Criar([FromBody] Aluno aluno)
        {
            if (aluno == null)
                return BadRequest("Dados de cadastro do aluno inválidos.");

            try
            {
                var id = _service.CriarAluno(aluno);
                aluno.Id = id;
                return Created(new Uri(Request.RequestUri + "/" + id), aluno); // 201
            }
            catch (BusinessRuleException ex)
           {
                return BadRequest(ex.Message); // 400 Payloads mal formados
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult Atualizar(int id, [FromBody] Aluno aluno)
        {
            if (aluno == null)
                return BadRequest("Dados para atualização do aluno inválidos.");

            aluno.Id = id;

            try
            {
                _service.AtualizarAluno(aluno);
                return StatusCode(System.Net.HttpStatusCode.NoContent); // 204
            }
            catch (NotFoundException)
            {
                return NotFound(); // 404
            }
            catch (BusinessRuleException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult Deletar(int id)
        {
            try
            {
                _service.DeletarAluno(id);
                return StatusCode(System.Net.HttpStatusCode.NoContent); // 204
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
