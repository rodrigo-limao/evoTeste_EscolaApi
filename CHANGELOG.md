# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

## [Unreleased]

## [0.3.0] - 2026-08-19 : 21h52
### Adicionado
- Criação dos modelos de domínio base (`Aluno`, `Turma` e `Matricula`).
- Criação das interfaces de contrato (`IAlunoRepository`, `ITurmaRepository` e `IMatriculaRepository`).
- Implementação inicial dos repositórios utilizando Dapper e SQL puro.

### Corrigido
- **Alinhamento com o script de banco oficial (`script-banco.sql`):** 
  - Removido o campo inexistente `Cpf` e adicionados `DataNascimento`, `Ativo` e `DataCadastro` na tabela/modelo de `Aluno`.
  - Removido o campo `Capacidade` e adicionados `Periodo`, `VagasTotal` e `VagasDisponiveis` na tabela/modelo de `Turma`.
  - Sincronizadas as queries escritas no `AlunoRepository`, `TurmaRepository` e `MatriculaRepository`.
- **Preparação Transacional (ACID):** Ajustadas as assinaturas e comportamentos de `TurmaRepository` e `MatriculaRepository` para aceitar parâmetros opcionais de `IDbConnection` e `IDbTransaction`, preparando a arquitetura para o controle de transação no futuro serviço de matrícula.

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
