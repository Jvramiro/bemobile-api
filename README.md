# BeMobile API - Gerenciador de Pagamentos

Projeto de avaliação técnica desenvolvido pela BeTalent. Trata-se de uma API RESTful para um sistema gerenciador de pagamentos multi-gateway, conectada a um banco de dados relacional e a duas APIs de pagamentos simuladas.

O sistema processa compras tentando realizar a cobrança junto aos gateways na ordem de prioridade definida. Se o primeiro falhar, a tentativa é feita no segundo. Ao obter sucesso, o fluxo de pagamento é encerrado sem erros para o cliente.

## Nível de Implementação: Nível 2

Este projeto foi construído atendendo aos requisitos estipulados no **Nível 2** do desafio:
- O valor da compra é calculado de forma dinâmica no back-end, tendo como base o produto informado e a respectiva quantidade adquirida.
- A comunicação com os gateways de pagamento exige autenticação, conforme as regras definidas para cada mock de gateway.

Adicionalmente, as rotas foram protegidas por autenticação e níveis de acesso (roles), garantindo que operações sensíveis como criação de produtos e alteração do status de gateways sejam restritas a administradores.

## Tecnologias Utilizadas

- Node.js v24
- AdonisJS v6
- MySQL 8
- Docker e Docker Compose
- VineJS (validação de dados)
- Japa (testes automatizados)

## Pré-requisitos

Para executar e testar o projeto localmente, é necessário possuir as seguintes ferramentas instaladas:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instalação e Execução

Siga os passos abaixo para preparar o ambiente e iniciar a aplicação. Todo o fluxo de dependência (banco de dados, aplicação e mock dos gateways) já está isolado via Docker.

**1. Clonar o repositório**
```bash
git clone https://github.com/Jvramiro/BeMobile-API
cd BeMobile-API
```

**2. Configurar as variáveis de ambiente**

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```
O `docker-compose.yml` já preenche automaticamente as configurações de banco de dados para o ambiente Docker. Nenhuma alteração é necessária para rodar via Docker.

**3. Subir os containers**

O Docker irá iniciar três containers:
- `app` — servidor AdonisJS (porta 3333)
- `db` — MySQL (porta 3306)
- `gateways` — mock dos dois gateways de pagamento (portas 3001 e 3002)

```bash
docker compose up -d --build
```

Aguarde alguns instantes para garantir que o banco de dados inicializou completamente antes do próximo passo.

**4. Executar as Migrations e Seeders**

```bash
docker compose exec app node ace migration:run
docker compose exec app node ace db:seed
```

O projeto estará rodando em `http://localhost:3333`.

## Usuário Admin Padrão

O seeder cria automaticamente um usuário administrador para acesso inicial:

| Campo | Valor |
|-------|-------|
| Email | admin@bemobile.com |
| Senha | admin123 |

## Testes Automatizados

A aplicação possui testes funcionais construídos com o framework Japa. Para executar a suíte de testes:

```bash
docker compose exec app node ace test
```

## Estrutura de Rotas

### Rotas Públicas

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| POST | `/login` | `{"email": "...", "password": "..."}` | Realiza login e retorna um Bearer token |
| POST | `/register` | `{"fullName": "...", "email": "...", "password": "...", "passwordConfirmation": "..."}` | Cadastra um novo usuário |
| POST | `/purchase` | `{"productId": 1, "quantity": 2, "name": "...", "email": "...", "cardNumber": "...", "cvv": "..."}` | Realiza uma compra informando produto e dados do cartão |

### Rotas Privadas

Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`.

**Usuários**

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| GET | `/users` || Lista todos os usuários |
| POST | `/users` | `{"fullName": "...", "email": "...", "password": "...", "role": "..."}` | Cria um novo usuário |
| GET | `/users/:id` || Detalha um usuário |
| PUT | `/users/:id` | `{"fullName": "...", "email": "...", "role": "..."}` | Atualiza um usuário |
| DELETE | `/users/:id` || Remove um usuário |

**Produtos**

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| GET | `/products` || Lista todos os produtos |
| POST | `/products` | `{"name": "...", "amount": 100}` | Cria um produto |
| GET | `/products/:id` || Detalha um produto |
| PUT | `/products/:id` | `{"name": "...", "amount": 100}` | Atualiza um produto |
| DELETE | `/products/:id` || Remove um produto |

**Clientes**

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| GET | `/clients` || Lista todos os clientes |
| GET | `/clients/:id` || Detalha um cliente e todas as suas compras |

**Transações**

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| GET | `/transactions` || Lista todas as transações |
| GET | `/transactions/:id` || Detalha uma transação com produtos |
| POST | `/transactions/:id/refund` || Solicita reembolso junto ao gateway |

**Gateways**

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| PATCH | `/gateways/:id/active` | `{ "is_active": true }` | Ativa ou desativa um gateway |
| PATCH | `/gateways/:id/priority` | `{ "priority": 1 }` | Altera a prioridade do gateway |

## Considerações e Observações

- **`status` na tabela de transações** — campo adicionado para registrar o estado atual de cada transação (`approved` ou `refunded`), permitindo consultas sem necessidade de chamar o gateway externo.

- **`amount` representa preço, não estoque** — o campo `amount` nos produtos representa o valor unitário em centavos. O total da compra é calculado dinamicamente multiplicando o preço pela quantidade informada.

- **Criação automática do cliente na compra** — a rota `/purchase` é pública e não exige cadastro prévio. Caso o e-mail informado não exista na base, o cliente é registrado automaticamente na primeira compra.

- **Apenas os 4 últimos dígitos do cartão são armazenados** — decisão de segurança para nunca persistir o número completo do cartão no banco de dados.

- **Controle de acesso por roles** — mesmo não sendo exigido explicitamente no nível 2, operações sensíveis como gerenciamento de gateways e produtos foram restritas ao perfil `admin`, tornando a API mais segura e próxima do que seria esperado em ambiente de produção.

- **Rota `/register`** — mantida do template do AdonisJS como rota auxiliar para facilitar a criação de usuários durante os testes.

## Dificuldades

- Uma das dificuldades que encontrei no projeto foi ter tido pouco contato prévio com a linguagem e as Frameworks. Mesmo com experiência em criação de APIs em outras linguagens, muitos conceitos ou estruturas foram diferentes.

  Devido ao prazo, apliquei conceitos a medida que ia aprendendo. Porém pretendo ir polindo este aprendizado para ter mais controle sobre o projeto e maior aplicação de código limpo e escalável.