# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

## [Unreleased]

## [1.0.0] - 2026-08-25
### Adicionado
- **Módulo Front-end SPA (Vite + React + Tailwind CSS v4):**
  - Implementação de arquitetura modular dividida em componentes de domínio (`AbaAlunos`, `AbaMatriculas`, `AbaRelatorios`).
  - Criação de uma camada de serviços dedicada para abstrair as requisições HTTP (`AlunoService`, `TurmaService`, `MatriculaService`, `RelatorioService`).
  - Centralização da configuração de comunicação da API em um único ponto (`apiConfig.js`).
  - Estilização visual moderna e responsiva integrada ao **Font Awesome** via CDN.
- Tela de relatórios de ocupação exibindo dados agregados diretamente das queries em Dapper com barra de progresso em CSS dinâmico.
- Formatação de datas de nascimento de `YYYY-MM-DD` para `DD/MM/YYYY`.
- Captura e tratamento amigável de respostas HTTP `409 Conflict`.

## [0.7.0] - 2026-08-23
### Adicionado
- Implementação do padrão RFC 7807 (Problem Details) no `MatriculasController` para tratamento amigável de exceções de regra de negócio (`BusinessRuleException`).
- Configuração global de indentação e nomenclatura camelCase para respostas JSON usando o Newtonsoft.Json.

### Corrigido
- Reversão completa do `System.Text.Json` para o `Newtonsoft.Json` nativo do Web API 2.
- Correção de erro de digitação de coluna SQL (`VagasDiponiveis` para `VagasDisponiveis`) no `TurmaRepository`.
- Ajuste de discrepância de nomenclatura no parâmetro dinâmico do Dapper (`@TurmaId`) no método `DecrementarVaga`.

## [0.6.0] - 2026-08-21 : 19h06
### Adicionado
- Projeto de testes unitários `EscolaApi.Tests`.
- Interface de abstração `IDbConnectionFactory` para desacoplamento de banco.
- Dublês de teste (*Fakes*) de conexões, transações do ADO.NET e repositórios em memória.
- 6 cenários de testes unitários de regras de negócio.


## [0.5.0] - 2026-08-21 : 14h15
### Adicionado
- Implementação de `AlunosController`, `TurmasController`, `MatriculasController` e `RelatoriosController`.
- Configuração do pipeline do ASP.NET Web API 2 e ativação do Roteamento por Atributos (`Attribute Routing`).
- Criação do `CustomDependencyResolver` para gerenciar as dependências de Controllers via Pure DI no ciclo de vida web.
- Criação do arquivo de inicialização `Global.asax` e mapeamento de rotas padrão em `WebApiConfig.cs`.

### Corrigido
- **Mapeamento Semântico de Respostas HTTP:** Interceptação elegante de exceções customizadas para retornar os status HTTP
  - `200 OK` / `201 Created` para sucesso
  - `400 BadRequest` para erros de entrada
  - `404 NotFound` para recursos inexistentes
  - `409 Conflict` para quebras de regras de negócio

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
