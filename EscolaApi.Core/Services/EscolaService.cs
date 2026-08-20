using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using EscolaApi.Core.Contracts;
using EscolaApi.Core.Exceptions;
using EscolaApi.Core.Models;

namespace EscolaApi.Core.Services
{
    public class EscolaService : IEscolaService
    {
        private readonly IAlunoRepository _alunoRepository;
        private readonly ITurmaRepository _turmaRepository;
        private readonly IMatriculaRepository _matriculaRepository;
        private readonly IRelatorioRepository _relatorioRepository;
        private readonly string _connectionString;

        public EscolaService (
            IAlunoRepository alunoRepository,
            ITurmaRepository turmaRepository,
            IMatriculaRepository matriculaRepository,
            IRelatorioRepository relatorioRepository,
            string connectionString)
        {
            _alunoRepository = alunoRepository;
            _turmaRepository = turmaRepository;
            _matriculaRepository = matriculaRepository;
            _relatorioRepository = relatorioRepository;
            _connectionString = connectionString;
        }

        #region Alunos
        public PagedResult<Aluno> GetAlunosPaginados(string nome, int page, int pageSize)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;
            return _alunoRepository.GetPaginado(nome, page, pageSize);
        }

        public Aluno GetAlunoById(int id)
        {
            var aluno = _alunoRepository.GetById(id);
            if (aluno == null)
                throw new NotFoundException("Aluno não encontrado.");
            return aluno;
        }

        public int CriarAluno(Aluno aluno)
        {
            if (string.IsNullOrWhiteSpace(aluno.Nome))
                throw new BusinessRuleException("O nome do aluno é obrigatório.");
            if (string.IsNullOrWhiteSpace(aluno.Email))
                throw new BusinessRuleException("O e-mail do aluno é obrigatório.");
            if (aluno.DataNascimento == default)
                throw new BusinessRuleException("A data de nascimento do aluno é obrigatória.");

            return _alunoRepository.Criar(aluno);
        }

        public bool AtualizarAluno(Aluno aluno)
        {
            var existente = _alunoRepository.GetById(aluno.Id);
            if (existente == null)
                throw new NotFoundException("Aluno não encontrado para atualização.");

            if (string.IsNullOrWhiteSpace(aluno.Nome))
                throw new BusinessRuleException("O nome do aluno é obrigatório.");
            if (string.IsNullOrWhiteSpace(aluno.Email))
                throw new BusinessRuleException("O e-mail do aluno é obrigatório.");
 
            return _alunoRepository.Atualizar(aluno);
        }

        public bool DeletarAluno(int id)
        {
            var existente = _alunoRepository.GetById(id);
            if (existente == null)
                throw new NotFoundException("Aluno não encontrado para exclusão.");

            return _alunoRepository.Deletar(id);
         }
        #endregion

        #region Turmas
        public IEnumerable<Turma> GetTurmas() => _turmaRepository.GetTodas();

        public Turma GetTurmaById(int id)
        {
            var turma = _turmaRepository.GetById(id);
            if (turma == null)
                throw new NotFoundException("Turma não encontrada");
            return turma;
        }
        #endregion

        #region Matrículas (Controle de Transação ACID)
        public int RealizarMatricula(int alunoId, int turmaId)
        {
            // Validação 1: O aluno existe? (Rápida e isolada fora da transação)
            var aluno = _alunoRepository.GetById(alunoId);
            if (aluno == null)
                throw new NotFoundException("Aluno não encontrado.");

            // Validação 2: O aluno está ativo? (Requisito obrigatório de negócio)
            if (aluno.Ativo == false)
                throw new BusinessRuleException("Aluno inativo. Não pode realizar a matrícula.");

                // Transação ACID
                using (var conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (var tran = conn.BeginTransaction(IsolationLevel.ReadCommitted))
                    {
                        try
                        {
                            // Validação 3: A turma existe?
                            var turma = _turmaRepository.GetById(turmaId, conn, tran);
                            if (turma == null)
                                throw new NotFoundException("Turma não encontrada.");

                            // Validação 4: Existem vagas disponíveis?
                            if (turma.VagasDisponiveis <= 0)
                                throw new BusinessRuleException("Turma sem vagas disponíveis.");

                            // Validação 5: O aluno já está nessa turma?
                            var isMatriculado = _matriculaRepository.AlunoIsMatriculado(alunoId, turmaId, conn, tran);
                            if (isMatriculado)
                                throw new BusinessRuleException("Aluno já matriculado nesta turma.");

                            // Criar e gravar a matrícula
                            var matricula = new Matricula
                            {
                                AlunoId = alunoId,
                                TurmaId = turmaId,
                                DataMatricula = DateTime.Now
                            };
                            int matriculaId = _matriculaRepository.Criar(matricula, conn, tran);

                            // Decrementar a vaga da turma
                            bool isDecrementado = _turmaRepository.DecrementarVaga(turmaId, conn, tran);
                            if (isDecrementado == false)
                                throw new BusinessRuleException("Não foi possível reservar a vaga.");

                            // Se chegou aqui, grava
                            tran.Commit();
                            return matriculaId;
                         }
                        catch
                        {
                            // Qualquer falha reverte tudo
                            tran.Rollback();
                            throw;
                        }
                   }
                }
        }
        #endregion

        #region Relatórios
        public IEnumerable<RelatorioAlunosByTurmaDto> GetRelatorioAlunosByTurma()
        {
            return _relatorioRepository.GetAlunosByTurma();
        }
        #endregion
    }
}
