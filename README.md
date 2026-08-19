# Escola API - Sistema de Controle de Matrículas

API RESTful desenvolvida em **.NET Framework 4.8 com ASP.NET Web API**, **Dapper** e **SQL Server** para controle de matrículas escolares.

## 🛠️ Tecnogias e Stack
- **Framework:** .NET Framework 4.8 (ASP.NET Web API 2)
- **Acesso a Dados:** Dapper (Micro-ORM)
- **Banco de Dados:** SQL Server
- **Arquitetura:** Camadas (Controller, Service, Repository)

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Docker Desktop (com suporte a Windows Containers habilitado para a API)
- PowerShell Terminal
- Editor de arquivos (Neovim, VSCode, ...)

### Execução via Docker Compose
1. Suba os containers do SQL Server e da API:
   ```powershell
   docker-compose up -d --build
   ```
2. O script do SQL server (script-banco.sql) será executado automaticamente na inicialização do container do SQL Server

## 📌 Endpoints da API
- `GET /api/alunos` - Listagem paginada de alunos
- `GET /api/alunos/{id}` - Consulta aluno por ID
- `POST /api/alunos` - Cadastro de novo aluno
- `PUT /api/alunos/{id}` - Atualização de aluno
- `DELETE /api/alunos/{id}` - Exclusão lógica (Ativo = 0)
- `GET /api/turmas` - Listagem de turmas com vagas restantes
- `POST /api/matriculas` - Matrícula de aluno em turma (Transacional)
- `GET /api/relatorios/alunos-por-turma` - Relatório de matrículas

### 💡 Diferencial Técnico: Arquitetura Dual-Format (.NET Framework 4.8)
Para demonstrar proficiência tanto na stack clássica quanto em workflows modernos de CLI:
1. **`EscolaApi.LegacyWeb`:** Projeto no formato MSBuild tradicional do .NET 4.8 (garante compliance estrito aos requisitos do teste).
2. **`EscolaApi.SdkWeb`:** Projeto no formato SDK-Style direcionado ao `net48` (criado e compilado via terminal `dotnet CLI`).
*Ambos os projetos compartilham as mesmas camadas de negócio (Services) e acesso a dados com Dapper (Repositories)*.
