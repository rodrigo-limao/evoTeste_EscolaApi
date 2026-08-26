> ⚠️ **Projeto de teste técnico.** ⚠️
> Este repositório foi desenvolvido como parte de um processo seletivo e já foi encerrado.
> Não está em manutenção e não representa um projeto ativo.


# Escola API - Painel Administrativo de Matrículas

Este repositório contém a solução completa para o controle de matrículas escolares, integrando um back-end robusto e transacional com um front-end moderno, reativo e componentizado.

---

## 🛠️ Tecnologias e Stack

### **Back-end**
- **Framework:** .NET Framework 4.8 (ASP.NET Web API 2)
- **Acesso a Dados:** Dapper (Micro-ORM) com consultas SQL puras e otimizadas
- **Banco de Dados:** SQL Server 2022 hospedado em container Docker

### **Front-end**
- **Framework:** React SPA (Vite)
- **Estilização:** Tailwind CSS v4
- **Ícones:** Font Awesome (via CDN)

---

## 📐 Arquitetura do Projeto

A solução foi estruturada seguindo o **Princípio de Responsabilidade Única (SRP)** e a separação clara de conceitos:

### **1. Back-end (Estrutura em Camadas)**
- **`EscolaApi.Core` (Biblioteca de Classes):** Hospeda os Modelos de dados (Aluno, Turma, Matricula), as Interfaces/Contratos e os Serviços com as Regras de Negócio e o controle transacional.
- **`EscolaApi.LegacyWeb` (Apresentação API):** Camada de endpoints RESTful responsável pelo roteamento HTTP, validações de contrato e o correto mapeamento de status de retorno do protocolo (200, 201, 400, 404, 409).

### **2. Front-end (React SPA Modular)**
O front-end foi desacoplado de um monolito reativo para uma estrutura de alta manutenibilidade:
- **`src/services/`:** Camada isolada que abstrai todas as chamadas HTTP (`AlunoService.js`, `TurmaService.js`, `MatriculaService.js`, `RelatorioService.js`) com um ponto de configuração centralizado (`apiConfig.js`).
- **`src/components/`:** Componentes visuais autocontidos e focados em seus domínios de visualização (`AbaAlunos.jsx`, `AbaMatriculas.jsx`, `AbaRelatorios.jsx` e `MenuNavegacao.jsx`).

---

## 🚀 Como Executar e Testar o Projeto

Siga os passos abaixo para rodar e testar todo o fluxo da aplicação de forma integrada pelo terminal:

### **Passo 1: Subir o Banco de Dados (Docker)**
Na raiz da solução do back-end, inicie a instância do SQL Server 2022. O banco `TesteEscola` e as tabelas serão criados e populados automaticamente pelo container de inicialização:
```docker-compose up -d --build```

Para validar se o banco de dados inicializou e o script de carga rodou com sucesso, execute:
```docker logs escola_sqlserver_init```

### **Passo 2: Compilar e Executar a API (.NET 4.8)**
Restaure as dependências do NuGet:
```nuget restore EscolaApi.sln```

Compile a solução usando o MSBuild:
```msbuild EscolaApi.sln /p:Configuration=Debug```

Execute o projeto EscolaApi.LegacyWeb através do seu IIS Express local ou host de preferência apontando para a porta 8080 (endereço base configurado: http://localhost:8080/api).
```& "C:\Program Files\IIS Express\iisexpress.exe" /path:<diretorio_do_projeto>\EscolaApi\EscolaApi.LegacyWeb /port:8080```

### **Passo 3: Executar o Front-end (React)**
Navegue até a pasta do projeto Web (EscolaApi.WebReact):
```npm install```

Inicialize o servidor de desenvolvimento do Vite:
```npm run dev```

Abra a URL informada no terminal (geralmente http://localhost:5173) para testar visualmente todas as funcionalidades.
