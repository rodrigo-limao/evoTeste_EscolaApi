# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

## [Unreleased]

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
