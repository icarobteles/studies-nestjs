<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Descrição

Este exemplo foi desenvolvido utilizando o [Nest](https://github.com/nestjs/nest). Siga as instruções nos tópicos abaixo para rodar ele em sua máquina local.

## Instalação

Navegue até o diretório server (o mesmo diretório desse arquivo README.md) e depois execute o seguindo comando:

```bash
npm install
```

## Execução do App

```bash
# Em modo de desenvolvimento
npm run start

# Em modo de observação (qualquer alteração nas pastas "src" ou "test" farão com que o app seja compilado novamente de forma automatizada)
npm run start:dev

# Em modo de produção
npm run start:prod
```

## Testes do App

```bash
# Testes unitários
npm run test

# Testes de ponta à ponta
npm run test:e2e

# Cobertura de teste
npm run test:cov
```

## Estudo do Exemplo

### Módulos

Neste projeto de exemplo, foram criados dois módulos extras, além do módulo principal criado com a cli do Nest.js. Os dois módulos criados foram:
  - **auth**: contém os controladores e os serviços relacionados à autenticação (login e cadastro) de um usuário. Além disso, há o serviço `jwt-strategy`, responsável por extrair e validar o token do cabeçalho das requisições privadas (que necessitam de um token JWT).
  - **user**: contém a entidade usuário e os repositórios de acesso a um banco de dados, que nesse caso foi simulado um banco de dados em memória.

##

### 📝 [Entendendo o JWT](../docs/JWT.md)

### 🔒 [Exemplo de Estratégia para Gerar um Token JWT com Node.js Puro + Dotenv](./jwt.ts)

### 🔙 [Retornar à Página Principal](../README.md)
