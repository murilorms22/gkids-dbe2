# GerenciaKids API (NestJS + Prisma + MySQL)

API RESTful para gestão escolar infantil (**GerenciaKids**), desenvolvida com **NestJS 12**, **Prisma ORM 6**, **MySQL 8** e **Docker**. O projeto implementa autenticação JWT com revogação de tokens em banco, controle de acesso baseado em papéis e políticas (RBAC / Ability), mapeamento de relacionamentos com **Eager Loading** e **Lazy Loading via Fluent API** (sem problema de queries N+1), **Factories com `@faker-js/faker`** e **filtros parametrizados diretamente no MySQL**.

---

## Stack Tecnológica

- **Node.js** + **TypeScript**
- **NestJS 12** (`@nestjs/common`, `@nestjs/core`, `@nestjs/jwt`)
- **Prisma ORM 6** (`@prisma/client`, `prisma`)
- **MySQL 8.0** + **phpMyAdmin** (via Docker Compose)
- **Validação e Transformação:** `class-validator` e `class-transformer` (`ValidationPipe` global com `transform: true` e `whitelist: true`)
- **Geração de Dados (Seed & Factories):** `@faker-js/faker` (`fakerPT_BR`)

---

## Pré-requisitos

- **Node.js** (v20 ou superior recomendado) e **npm**
- **Docker** e **Docker Compose** ativos na máquina

---

## Passo a Passo de Instalação e Execução

1. **Acesse a pasta do projeto e instale as dependências:**
   ```bash
   cd gerenciakids-lite
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   *(No Windows PowerShell: `Copy-Item .env.example .env`)*

3. **Suba o banco de dados MySQL e o phpMyAdmin com Docker:**
   ```bash
   docker compose up -d
   ```
   - MySQL: `localhost:3306` (banco `gerenciakids_lite`, usuário `root`, senha `root`)
   - phpMyAdmin: `http://localhost:8080`

4. **Execute as migrations do Prisma:**
   ```bash
   npx prisma migrate deploy
   # ou em desenvolvimento:
   npx prisma migrate dev
   ```

5. **Popule o banco de dados com o Seed e as Factories (`@faker-js/faker`):**
   ```bash
   npx prisma db seed
   # ou:
   npm run db:seed
   ```

6. **Inicie o servidor NestJS:**
   ```bash
   npm run start:dev
   ```
   A API estará disponível em `http://localhost:3000`. O script já garante a inicialização dos containers Docker em segundo plano antes de subir o servidor NestJS. Todas as respostas são envelopadas pelo `TransformInterceptor` no formato `{ "data": ... }`.

7. **Interface Web para Visualização (Live Server):**
   O projeto inclui uma interface web interativa em `public/index.html` para consultar, navegar e visualizar os registros de **Alunos**, **Turmas** e **Responsáveis** diretamente no navegador:
   - No **VS Code**, recomenda-se utilizar a extensão **Live Server** (*Ritwick Dey*).
   - Clique com o botão direito no arquivo `public/index.html` e selecione **"Open with Live Server"** (ou clique no botão **"Go Live"** na barra inferior do VS Code).
   - A página abrirá no navegador (tipicamente em `http://127.0.0.1:5500/public/index.html`), conectada e consumindo a API em tempo real na porta `3000`.

---

## Seed e Factories (`@faker-js/faker`)

O arquivo `prisma/seed.ts` é **idempotente** e utiliza as factories localizadas em `prisma/factories/` com localização brasileira (`fakerPT_BR`):

- **`prisma/factories/turma.factory.ts` (`criarDadosTurma`):** gera turmas de educação infantil (`Berçário I/II`, `Maternal I/II`, `Pré I/II` combinados com `A`, `B`, `Estrelinhas`, `Girassol`, `Arco-Íris`), turnos (`Manhã`, `Tarde`, `Integral`) e `ano_letivo: '2026'`.
- **`prisma/factories/responsavel.factory.ts` (`criarDadosResponsavel`):** gera responsáveis com nome completo, telefone celular e CPF único de 11 dígitos sem colisão.
- **`prisma/factories/aluno.factory.ts` (`criarDadosAluno`):** gera alunos com nome completo e data de nascimento realista entre 1 e 5 anos de idade, vinculados às turmas e responsáveis existentes.

Além dos registros gerados via Faker (**+4 turmas**, **+10 responsáveis** e **+20 alunos**), o seed garante via `upsert` os registros fixos de `id: 1` (`Turma` "Maternal 1", `Responsavel` "Carlos da Silva" e `Aluno` "Pedrinho da Silva") e os **5 usuários padrão** abaixo:

| Nome | E-mail | Senha | Papel (`Role`) | Permissões Principais |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@ifsul.edu.br` | `123456` | `ADMIN` | Acesso total a todos os recursos (`manage: all`) e listagem de usuários |
| **Direção Escolar** | `direcao@ifsul.edu.br` | `123456` | `DIRECAO` | Acesso irrestrito ao CRUD de `Turma` (`manage: Turma`) e leitura geral |
| **Gerente (Direção)** | `gerente@ifsul.edu.br` | `123456` | `GERENTE` | Equivalente à Direção (`manage: Turma`) |
| **Responsável** | `responsavel@ifsul.edu.br` | `123456` | `RESPONSAVEL` | Leitura pública de turmas e operação autenticada em alunos/responsáveis |
| **Comum** | `user@ifsul.edu.br` | `123456` | `RESPONSAVEL` | Conta adicional de usuário comum/responsável |

---

## Resumo das Rotas da API

### 1. Autenticação (`/auth`) e Usuários (`/users`)
| Método | Rota | Autenticação / Papel | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Pública | Autentica por `email` e `senha` (`LoginDto`) e retorna `access_token` |
| `POST` | `/auth/logout` | `AuthGuard` | Revoga o token atual (ou todos os tokens do usuário com `?all=true`) |
| `POST` | `/auth/logout-all` | `AuthGuard` | Revoga todos os tokens ativos do usuário autenticado |
| `GET` | `/users` | `AuthGuard` (`ADMIN`) | Lista todos os usuários cadastrados |
| `GET` | `/users/:id` | `AuthGuard` (Próprio ou `ADMIN`) | Exibe os dados do perfil do usuário |
| `POST` | `/users` | `AuthGuard` | Cria um novo usuário (`CreateUserDto`) |
| `PUT` / `PATCH` | `/users/:id` | `AuthGuard` (Próprio ou `ADMIN`) | Atualiza dados do próprio usuário (ou qualquer usuário se `ADMIN`) |
| `DELETE` | `/users/:id` | `AuthGuard` (Próprio ou `ADMIN`) | Remove o usuário |

### 2. Turmas (`/turmas`)
| Método | Rota | Estratégia Prisma / Recurso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/turmas` | **Contagem (`_count`) + Filtros MySQL** | Lista turmas com `_count.alunos`. Aceita filtros `?nome=&turno=&ano_letivo=` |
| `GET` | `/turmas/:id` | **Eager Loading Condicional** | Retorna a turma. Com `?incluirAlunos=true`, inclui `alunos: true` via `include` |
| `GET` | `/turmas/:id/alunos` | **Lazy Loading (Fluent API)** | Busca apenas os alunos da turma via `findUnique({ where: { id } }).alunos()` |
| `POST` | `/turmas` | `AuthGuard` + `DIRECAO`/`GERENTE`/`ADMIN` | Cria uma nova turma (`CreateTurmaDto`) |
| `PUT` / `PATCH` | `/turmas/:id` | `AuthGuard` + `DIRECAO`/`GERENTE`/`ADMIN` | Atualiza uma turma existente (`UpdateTurmaDto`) |
| `DELETE` | `/turmas/:id` | **Tratamento `P2003` (`409 Conflict`)** | Remove a turma (retorna `409 Conflict` se houver alunos vinculados) |

### 3. Responsáveis (`/responsaveis`)
| Método | Rota | Estratégia Prisma / Recurso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/responsaveis` | Listagem simples | Lista todos os responsáveis cadastrados |
| `GET` | `/responsaveis/:id` | **Eager Loading Condicional** | Retorna o responsável. Com `?incluirAlunos=true`, carrega `include: { alunos: true }` |
| `GET` | `/responsaveis/:id/alunos` | **Lazy Loading (Fluent API)** | Carrega os alunos sob demanda via `findUnique({ where: { id } }).alunos()` |
| `POST` | `/responsaveis` | `AuthGuard` + **Tratamento `P2002` (`409`)** | Cria responsável validando CPF único |
| `PUT` / `PATCH` | `/responsaveis/:id` | `AuthGuard` + **Tratamento `P2002` (`409`)** | Atualiza responsável |
| `DELETE` | `/responsaveis/:id` | `AuthGuard` + **Tratamento `P2003` (`409`)** | Remove responsável (retorna `409 Conflict` se possuir alunos vinculados) |

### 4. Alunos (`/alunos`)
| Método | Rota | Estratégia Prisma / Recurso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/alunos` | **Eager Loading + Filtros MySQL** | Lista alunos com `include: { turma: true, responsavel: true }`. Aceita `?nome=&turmaId=&responsavelId=` |
| `GET` | `/alunos/:id` | **Eager Loading (`include`)** | Retorna o aluno com os objetos `turma` e `responsavel` aninhados |
| `GET` | `/alunos/:id/turma` | **Lazy Loading (Fluent API)** | Retorna apenas a turma do aluno via `findUnique({ where: { id } }).turma()` |
| `GET` | `/alunos/:id/responsavel` | **Lazy Loading (Fluent API)** | Retorna apenas o responsável via `findUnique({ where: { id } }).responsavel()` |
| `POST` | `/alunos` | `AuthGuard` + **Tratamento `P2003` (`400`)** | Cria aluno validando existência de `turmaId` e `responsavelId` |
| `PUT` / `PATCH` | `/alunos/:id` | `AuthGuard` + **Tratamento `P2003` (`400`)** | Atualiza aluno |
| `DELETE` | `/alunos/:id` | `AuthGuard` | Remove o aluno |

---

## Testando com o Postman (Atividade 6)

A coleção oficial completa de testes está localizada em:
```text
tests/Postman/GerenciaKids.postman_collection.json
```

### Como importar no Postman:
1. Abra o **Postman** e clique em **Import** (ou pressione `Ctrl + O`).
2. Selecione ou arraste o arquivo `tests/Postman/GerenciaKids.postman_collection.json`.
3. A coleção **GerenciaKids API** será adicionada com as variáveis já embutidas (`{{baseUrl}}` apontando para `http://localhost:3000`, `{{token}}` dinâmico e variáveis auxiliares de IDs).

### Formas de Execução:

#### Opção A — Execução Automatizada em 1 Clique (Collection Runner - Recomendado):
1. No menu lateral do Postman, clique com o botão direito na coleção **GerenciaKids API** e escolha **"Run collection"**.
2. Clique no botão azul **"Run GerenciaKids API"**.
3. **O que acontece automaticamente:**
   - A coleção executa todas as requisições em ordem lógica.
   - O login captura o token JWT e popula a variável `{{token}}` dinamicamente.
   - As criações capturam os IDs gerados (`{{createdTurmaId}}`, `{{createdAlunoId}}`, etc.) e os utilizam nas requisições subsequentes de atualização e exclusão.
   - São executados testes automatizados de **Eager Loading**, **Lazy Loading (Fluent API)**, **Filtros MySQL**, **Erros de Integridade Relacional (`409 Conflict` e `400 Bad Request`)**, **Controle de Acesso RBAC/Ability (`403 Forbidden`)** e **Revogação de Tokens**.
   - Todos os testes passarão com status verde (**PASS**).

#### Opção B — Testes Manuais de Rotas Individuais:
1. Caso queira testar requisições específicas avulsas, basta executar primeiro o `Send` na rota **`1. Auth (Login Admin) -> Login - Admin`**.
2. O script de teste armazenará o token na variável `{{token}}`.
3. A partir desse momento, qualquer requisição protegida que você abrir e enviar (`Send`) já estará automaticamente autenticada via `Bearer {{token}}`, sem necessidade de copiar ou colar tokens manualmente.
