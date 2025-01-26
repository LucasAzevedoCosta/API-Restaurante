# API de Gerenciamento de Restaurante

Bem-vindo à API de Gerenciamento de Restaurante, uma solução completa para o gerenciamento eficiente de pedidos, produtos e operações de um restaurante. Este projeto foi desenvolvido com foco em escalabilidade, segurança e desempenho, utilizando tecnologias modernas para oferecer uma experiência otimizada.

## 🚀 Tecnologias Utilizadas

- **Node.js com TypeScript** – Back-end robusto e tipado
- **Bun** – Gerenciamento eficiente de pacotes e execução
- **Drizzle ORM** – Mapeamento e migração de banco de dados
- **Docker** – Contêineres para facilitar o ambiente de desenvolvimento

## 📂 Estrutura do Projeto

```
API-Restaurante-main/
├── drizzle/               # Migrações e snapshots do banco de dados
├── src/
│   ├── db/                # Configuração e esquemas do banco de dados
│   ├── http/
│   │   ├── routes/        # Definição das rotas da API
│   │   ├── errors/        # Tratamento de erros personalizados
│   ├── lib/               # Utilitários e serviços auxiliares
├── package.json           # Dependências e scripts do projeto
├── docker-compose.yml     # Configuração do ambiente Docker
└── tsconfig.json          # Configuração do TypeScript
```

## ⚙️ Instalação

Antes de começar, certifique-se de ter o [Bun](https://bun.sh/) e o [Docker](https://www.docker.com/) instalados.

```bash
# Clone o repositório
git clone https://github.com/LucasAzevedoCosta/API-Restaurante.git
cd API-Restaurante

# Instale as dependências
bun install

# Configure as variáveis de ambiente
cp .env.example .env
```

## ▶️ Execução

Para rodar a aplicação localmente:

```bash
# Inicie os containers do Docker
docker-compose up -d

# Execute a aplicação em modo de desenvolvimento
bun run dev
```

## 🛠️ Migrações do Banco de Dados

```bash
# Geração dos tipos
bun run drizzle:generate

# Execução das migrações
bun run drizzle:migrate
```

## 📡 Endpoints Principais

A API oferece uma série de endpoints para gerenciar as operações do restaurante:

- `POST /auth` – Autenticação de usuários
- `GET /orders` – Listagem de pedidos
- `POST /orders` – Criação de novos pedidos
- `GET /products` – Consulta de produtos disponíveis
- `POST /restaurants` – Registro de novos restaurantes

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir, siga os seguintes passos:

1. Faça um fork deste repositório
2. Crie uma branch com sua funcionalidade (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'Adicionando nova funcionalidade'`)
4. Envie suas alterações para o repositório remoto (`git push origin minha-feature`)
5. Abra um Pull Request
