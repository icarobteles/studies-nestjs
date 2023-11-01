# Autenticação via JWT: Entendendo o JWT

## Definição

JWT é a sigla para JSON Web Token e trata-se de um formato compacto e autossuficiente para representar informações entre duas partes de maneira segura como um objeto JSON.

Ele é frequentemente usado para autenticação e troca de informações entre um servidor e um cliente, como uma alternativa às sessões tradicionais.

## Por que usá-lo?

- **Stateless**: Ao contrário das sessões, que geralmente são armazenadas no servidor, os JWTs são autossuficientes e podem ser validados sem consultar o servidor. Isso torna as aplicações mais escaláveis.
- **Segurança**: Podem ser assinados digitalmente, garantindo que o conteúdo não foi adulterado. Isso torna a troca de informações mais segura.
- **Transferência de Dados**: Útil para transmitir informações, como detalhes do usuário ou autorizações, entre diferentes partes de uma aplicação.

## Entendendo melhor o Stateless

Uma das principais razões para o uso de JWT em autenticação e autorização é a característica "stateless". O termo "stateless" significa que a autenticação com JWT não depende de um estado de sessão mantido no servidor. Isso tem várias implicações e vantagens:

- **Escalabilidade**: Como não há necessidade de manter o estado da sessão no servidor, as aplicações que utilizam JWT podem ser altamente escaláveis. Cada solicitação do cliente contém todas as informações necessárias para a autenticação, tornando os servidores mais eficientes, pois não precisam armazenar informações de sessão.

- **Simplicidade**: A autenticação com JWT é simplificada, uma vez que os servidores não precisam rastrear sessões, lidar com cookies ou manter informações de login. Isso simplifica o desenvolvimento e manutenção de aplicações.

- **Independência de Servidor**: Como os JWTs são autocontidos, eles podem ser verificados independentemente de qual servidor os emitiu. Isso é particularmente útil em arquiteturas distribuídas ou microsserviços, onde diferentes partes do sistema podem ser responsáveis por autenticar os usuários.

- **Redução de Requisições ao Servidor**: Como o token contém informações de autenticação, o cliente pode apresentá-lo em todas as solicitações subsequentes, evitando a necessidade de autenticação repetida. Isso reduz a carga no servidor.

## Estrutura

Um JWT consiste em três partes separadas por pontos:

1. **Header**: É o cabeçalho do JWT, que contém metadados sobre o tipo do token e o algoritmo de assinatura utilizado. Exemplo:

```ts
    {
        "alg": "HS256",
        "typ": "JWT"
    }
```

2. **Payload**: É o corpo do JWT, que contém as reivindicações, que são informações sobre uma entidade (geralmente o usuário) e metadados adicionais. Exemplo:

```ts
    {
        "sub": "1234567890",
        "name": "John Doe",
        "admin": true
    }
```

3. **Signature**: É a assinatura do JWT, que adiciona segurança a esse sistema de autenticação. A assinatura garante a possibilidade de verificar se o token foi adulterado durante a transmissão. Ela é criada a partir do **header** e do **payload** usando uma **chave secreta**.

## Processo de Autenticação

1. **Login**: Quando um usuário faz o login em uma aplicação, um JWT pode ser gerado no servidor após a autenticação bem-sucedida.
2. **Emissão do Token**: O servidor cria um JWT com as informações relevantes, como o ID do usuário e as permissões. O token é então assinado com uma chave secreta para garantir sua integridade. É como um carimbo!
3. **Entrega ao Cliente**: O JWT é enviado ao cliente (geralmente um cookie ou no corpo da resposta da requisição) para que ele possa ser usado nas solicitações subsequentes.
4. **Uso do Token**: O cliente inclui o JWT nas solicitações ao servidor, geralmente no cabeçalho "Authorization" usando o prefixo "Bearer". Exemplo:

```ts
    {
        "Authorization": "Bearer <seu-token-jwt>"
    }
```

5. **Validação do Token**: O servidor valida o JWT descriptografando a assinatura com a chave secreta. Se a assinatura for válida e o token não tiver expirado, o servidor considera o usuário autenticado e autoriza a solicitação.

## Reivindicações Comuns

- **Issuer (iss)**: Identifica o emissor do token
- **Subject (sub)**: Identifica o assunto do token (geralmente o id do usuário)
- **Audience (aud)**: Define a audiência para a qual o token é destinado
- **Expiration Time (exp)**: Define o tempo de expiração do token.
- **Not Before (nbf)**: Especifica a data a partir da qual o token é válido.
- **Issued At (iat)**: Indica o momento em que o token foi emitido.
- **JWT ID (jti)**: Fornece um identificador exclusivo para o token.

## Entendendo melhor a Reivindicação Audience (aud)

A reivindicação "aud" (audience) no JSON Web Token (JWT) especifica o público-alvo para o qual o token é destinado. O valor dessa reivindicação é uma string que representa a entidade ou serviço que deve aceitar e processar o token. O "público-alvo" pode ser uma aplicação específica, um grupo de aplicações, ou até mesmo categorias mais amplas, como "front-end" ou "mobile".

Vamos considerar um exemplo para entender o conceito do público-alvo:

Exemplo de Reivindicação "aud" em um JWT:

Suponha que você tenha uma aplicação de comércio eletrônico com várias partes distintas:

- Um front-end web acessado por navegadores.
- Um aplicativo móvel para dispositivos iOS.
- Um aplicativo móvel para dispositivos Android.
- Uma API de serviços web que fornece dados e funcionalidades para o front-end e os aplicativos móveis.

Agora, vamos emitir um token JWT para autenticar um usuário na aplicação de comércio eletrônico. Nesse caso:

- Para o front-end web, a reivindicação "aud" poderia ser definida como "ecommerce-frontend". Isso significa que o token é destinado exclusivamente para uso pelo front-end da aplicação.

- Para o aplicativo móvel iOS, a reivindicação "aud" poderia ser definida como "ios-app". Isso garante que o token seja aceito apenas pelo aplicativo iOS.

- Para o aplicativo móvel Android, a reivindicação "aud" poderia ser definida como "android-app". Isso limita o uso do token ao aplicativo Android.

- Para a API de serviços web, a reivindicação "aud" pode ser definida como "web-api". Isso indica que a API é o público-alvo desse token.

Dessa forma, cada parte da aplicação tem seu próprio público-alvo especificado na reivindicação "aud". Isso ajuda a garantir que o token seja usado apenas pela entidade para a qual foi destinado. Se um token com a reivindicação "aud" específica for apresentado a uma parte não autorizada, ela pode recusar o token e negar o acesso.

Em resumo, a reivindicação "aud" é flexível e pode representar uma variedade de públicos-alvo, desde aplicações específicas até grupos de serviços, dependendo das necessidades da aplicação. Ela desempenha um papel fundamental na segurança e no controle de acesso ao sistema.

## Segurança e Melhores Práticas

- **Não armazene informações sensíveis no JWT**: Os token JWT são legíveis por qualquer pessoa, pois são apenas codificados em Base64. Evite armazenar informações sensíveis neles.
- **Use HTTPS**: Para proteger a transmissão de tokens, é importante usar HTTPS em suas aplicações.
- **Renovação de Tokens**: Você pode implementar um mecanismo de renovação de tokens (refresh tokens) para evitar que os tokens expirem durante a sessão do usuário.
- **Mantenha as chaves secretas em segurança**: As chaves secretas usadas para assinar tokens devem ser mantidas em sigilo absoluto.

## Outras Estratégias de Autenticação

Além do JSON Web Token (JWT), existem várias outras estratégias de autenticação que são usadas em diferentes contextos e cenários. Cada estratégia tem suas próprias vantagens e é adequada para situações específicas, conheça algumas delas:

### Autenticação Baseada em Sessão

- **Uso**: Tradicionalmente, muitos sites ainda utilizam sessões para autenticar usuários. O servidor cria uma sessão após o login bem-sucedido e gera um identificador de sessão (geralmente armazenado em um cookie no lado do cliente).
- **Funcionamento**: O servidor mantém o estado da sessão do usuário e verifica a identificação da sessão em cada solicitação subsequente para determinar a autenticação.
- **Vantagens**: Simplicidade, gerenciamento centralizado de sessões.
- **Desvantagens**: Requer armazenamento de sessões no servidor, escalabilidade limitada e pode ser menos adequado para arquiteturas distribuídas.

### HTTP Basic Authentication

- **Uso**: É um método simples onde as credenciais do usuário são codificadas em base64 e incluídas no cabeçalho HTTP da solicitação.
- **Funcionamento**: O servidor verifica as credenciais e concede acesso se forem válidas.
- **Vantagens**: Simplicidade, alta compatibilidade.
- **Desvantagens**: Inseguro sem HTTPS, não é adequado para senhas longas ou complexas.

### OAuth 2.0 e OpenID Connect

- **Uso**: São protocolos de autorização e autenticação amplamente utilizados em aplicativos web e móveis.
- **Funcionamento**: O OAuth 2.0 permite que os apps solicitem acesso a recursos em nome de um usuário, enquanto que o OpenID Connect fornece autenticação, permitindo que os apps obtenham informações de identidade do usuário.
- **Vantagens**: Autorização flexível, autenticação segura, suporte para fluxos de autorização e identificação de usuário.
- **Desvantagens**: Complexidade em comparação com métodos mais simples de autenticação.

### Autenticação por Biometria

- **Uso**: Usado em dispositivos módeis e alguns sistemas de segurança de alto. Ela usa características físicas exclusivas do usuário, como impressão digital, reconhecimento facial ou íris.
- **Funcionamento**: O sistema captura e compara as características biométricas com os dados registrados para autenticar o usuário.
- **Vantagens**: Alta segurança, conveniência para o usuário.
- **Desvantagens**: Pode ser caro de implementar, requisitos de hardware e preocupações de privacidade.

Em síntese, cada estratégia de autenticação tem suas próprias aplicações e considerações de segurança. A escolha da estratégia depende dos requisitos do seu sistema, da experiência do usuário e da segurança necessária. É importante avaliar a estratégia mais adequada com base no contexto específico do seu projeto.