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

## Etapa 3: Programação
- 3.1 Instalado o gerenciador de pacotes `nuget`
  - Foi precriso restaurar as fontes dos pacotes `nuget` para conseguir instalar as versões `5.2.9`
- 3.2 Instalado o Dapper via NuGet
- 3.3 Criação dos Models, Interfaces e Repositories
- 3.4 Ajuste de ERRO da estrutura e queries Dapper
  - No início do desenvolvimento dos `Sevices` eu percebi que não criei os arquivos conforme a estrurura das tabelas do `script-banco.sql`, segui a sugestão da IA que estava parecida. Mas percebi e arrumei antes de continuar o desenvolvimento.
- 3.5 **Arquitetura de Isolamento Transacional:**
  - O contrato `IAlunoRepository` ficou isolado dos outros contratos
  - Os contratos (`ITurmaRepository` e `IMatriculaRepository`) e os repositórios (`TurmaRepository` e `MatriculaRepository`) foram alterados para aceitar conexão e transação ativas compartilhadas.
- 3.6 **Isolamento de Regras de Negócio (Services):** Toda a lógica operacional foi movida para o `EscolaService.cs`.
- 3.7 Foram criadas exceções especializadas (`BussinesRuleException` e `NotFoundException`)
- 3.8 **Transação ACID e Prevenção de Concorrência:** 
  - O método `RealizarMatricula` gerencia a abertura e fechamento de conexões
  - A verificação de vaga e o decremento ocorrem na mesma transação
- 3.9 Apareceram vários erros na compilação que foram tratados sem ajuda da IA
- 3.10 Implementados de os quatro controladores requeridos.
- 3.11 Habilitação do `Attribute Routing` no `WebApiConfig.cs` para fornecer URLs RESTful explícitas.
- 3.12 Criação do `CustomDependencyResolver` interceptando o pipeline de ativação do ASP.NET.
- 3.13 Cumprimento exato do requisito técnico de mapeamento de status HTTP.

## Etapa 4: Bônus
- 4.1 Criada branch `feature/etapa-3-issue-10-tests` para o desenvolvimento dos testes.
- 4.2 Introdução do Design Pattern **Factory (`IDbConnectionFactory`)**.
- 4.3 Desenvolvimento `FakeDbConnection` e `FakeDbTransaction` eliminando qualquer dependência de rede ou SQL Server físico para a suíte de testes.
- 4.4 Implementação de **6 cenários de teste** cobrindo todas as validações de regras de negócio de matrícula.
- 4.5 Suíte validada e executada localmente via `vstest.console.exe` com 100% de sucesso (6 testes aprovados).

