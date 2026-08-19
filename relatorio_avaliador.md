# Relatório de Acompanhamento para o Avaliador

## Etapa 1: Configuração
- 1.1 Criação do repo evoTeste_EscolaApi
- 1.2 Estruturação do fluxo com Pull Requets (PRs)
- 1.3 Criado README.md e CHANGELOG.md
- 1.4 Criado .gitignore e relatorio_avaliador.md
- 1.5 Configuração do GitHub Actions para CI/CD em .NET Framework 4.8
- 1.6 Criação do GitHub Projects e cadastros das Issues (etapas do desenvolvimento)

## Etapa 2: Setup
- 2.1 Criada branch `feature/etapa-2-setup`
- 2.2 Adicionado Dockerfile e docker-compose.yml
- 2.3 Adicionado script SQL (`script-banco.sql`)
- 2.4 Arquitetura em camadas (.NET 4.8 MSBuild Clássico):
  - `EscolaApi.Core`: Biblioteca de classes (contratos, entidades, serviços e repositórios)
  - `EscolaApi.LegacyWeb`: ASP.NET Web API para exposição dos endpoints RESTful
- 2.5 Decisões e Validações da Infra
  - **Projeto SDK-Style:** Não foi possível criar o projeto via CLI (`dotnet new -f net48`) devido restrições do SDK atualizado do .NET. Com isso foi criado apenas a estrutura clássica do MSBuild.
  - **Instalação do MSBuild:** O MSBuild foi instalado via `winget` (Visual Studio Build Tools 2022) e configurada, manualmente, no `PATH`
  - **Validação Local da Solution:** A solution não compilou de primeira, pois foi preciso criar blocos `<PropertyGroup>` para cada projeto mapeando onde os binários são salvos (`OutputPath`)
  - **Validação local do Docker:** O docker não conseguiu compilar, pois o container com IIS/Framework 4.8 exige um runtime *Windows Containers* no Docker Desktop. Com isso foi retirado do `docker-compose.yml` e a API será executada na instância local do IIS na própria máquina.
- 2.6 Declarado o uso do **Gemini** como assistente de IA para apoio de arquitetura e automação de CLI.
