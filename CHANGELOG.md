# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

## [Unreleased]

## [0.4.0] - 2026-08-19 : 00h29
### Adicionado
- Contrato de regras de negócio `IEscolaService`.
- Implementação de `EscolaService` encapsulando toda a regra de negócio.
- **Exceções de domínio customizadas:**
  - `BusinessRuleException` (para violações de regras)
  - `NotFoundException` (para recursos inexistentes)

### Corrigido
- **Transação ACID:** Implementada a transação lógica com `SqlTransaction`.
- **Segurança Concorrente:** Validação de matrícula e vagas disponíveis dentro da mesma transação.

## [0.3.0] - 2026-08-19 : 23h08
### Adicionado
- Estrutura utilitária `PagedResult<T>`.
- Estrutura para relatório `RelatorioAlunosByTurmaDto`.
- Criação das interfaces (`IAlunoRepository`, `ITurmaRepository` e `IMatriculaRepository`).
- Repositório `RelatorioRepositorio` com agregação via banco.

### Corrigido
- **Alinhamento com o script de banco oficial (`script-banco.sql`):** 
  - Removido o campo inexistente `Cpf` e adicionados `DataNascimento`, `Ativo` e `DataCadastro` na tabela/modelo de `Aluno`.
  - Removido o campo `Capacidade` e adicionados `Periodo`, `VagasTotal` e `VagasDisponiveis` na tabela/modelo de `Turma`.
  - Sincronizadas as queries escritas no `AlunoRepository`, `TurmaRepository` e `MatriculaRepository`.
- Implementação de paginação nativa em banco (`OFFSET` e `FETCH NEXT`) com `QueryMultiple` do Dapper.
- Correção de queries Dapper e inclusão de parâmetros de conexão (`IDbConnection`) e transações (`IDbTransaction`) para controle concorrente ACID nas operações de matrícula

## [0.2.0] - 2026-08-19 : 11h38
### Adicionado
- Estruturação da aplicação em camadas .NET Framework 4.8:
  - `EscolaApi.Core`: Biblioteca de classes (Models, Repositories e Services).
  - `EscolaApi.LegacyWeb`: ASP.NET Web API (Controllers e mapeamento de rotas HTTP).
- Arquivo de Solução (`EscolaApi.sln`) integrando os projetos.
- Dockerfile e docker-compose.yml otimizados para SQL Server e Web API.
- Script de inicialização do banco de dados (`script-banco.sql`).
- Atualização do relatorio_avaliador.md detalhando o suporte de IA (Gemini).

## [0.1.0] - 2026-08-19 : 10h00
### Adicionado
- Inicialização do repositório Git e arquivo de ignore
- Documentação inicial no README.md
- Estruturação do CHANGELOG.md e relatorio_avaliador.md
- Workflow do GitHub Actions para build do .NET Framework 4.8
