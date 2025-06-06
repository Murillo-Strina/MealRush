# **MealRush** 🥣

A MealRush é uma empresa responsável por desenvolver máquinas de venda que preparam refeições saudáveis, nutritivas e de forma rápida, buscando sempre satisfazer o cliente oferecendo um serviço prático e sem a necessidade de longas esperas. E neste projeto, o objetivo é apresentar nossa aplicação, através de um site informativo que contém informações sobre a empresa, sobre as refeições oferecidas e uma simulação de uma máquina de venda, bem como uma seção de envio de feedbacks na qual os clientes poderão enviar suas opiniões e críticas à respeito dos serviços das máquinas. Além disso, nossa aplicação também tera uma versão para utilização exclusiva de nossos administradores. 

# **Folders** 📂

- Backend: Back-end folder | Node.js struct
- Frontend: Front-end folder | React struct

*** Este projeto foi desenvolvido em Javascript

# **Funcionalidades** 🔍

- **Visualizar informações das refeições:** Durante a navegação do site informativo, os usuários podem conhecer um pouco mais sobre os nossos serviços, algumas das principais refeições oferecidas, além de conhecer as parcerias estabelecidas com instituições acadêmicas, aeroportos e prefeituras para utilização dos nossos serviços em parques.

- **Simular uma máquina de venda:** Os usuários poderão acessar uma interface gráfica que representa uma máquina de venda de preparo das refeições, e nela poderão interagir selecionando a refeição de interesse e confirmar, como se estivessem escolhendo na vida real, além de poder visualizar as informações nutricionais de cada refeição, como quantidade de proteínas, carboidratos, calorias, gorduras e peso.

- **Avaliar os serviços das máquinas:** Os clientes poderão enviar feedbacks para a MealRush através de um ChatBot que receberá todas as informações passadas pelo cliente, como a data e em qual instituição ele utilizou a máquina, além da opinião a respeito do serviço. Todas as informações de feedback serão encaminhadas para os administradores posteriormente.

- **Versão de administrador:** Ao acessar o menu principal, haverá uma opção de login de administrador, na qual será responsável por encaminhar a uma seção exclusiva para administradores, na qual serão responsáveis por fazer o gerenciamento, atualização e remoção das máquinas de comida e das instituições em que as máquinas estão instaladas, além de visualizar os feedbacks dos clientes quanto ao uso das máquinas.

# **Microsserviços** 💼

Os microsserviços da nossa aplicação são:
- **food-microsservice:** responsável pela aquisição dos dados das refeições oferecidas para visualização tanto no menu principal como na simulação virtual da máquina
- **machine-microsservice:** responsável pela aquisição dos dados das máquinas disponíveis em cada instituição parceira
- **institution-microsservice:** responsável pela aquisição dos dados das instituições parceiras
- **login-microsservice:** realiza a autenticação do administrador para visualizar suas interfaces exclusivas
- **feedback-microsservice:** chatbot que coleta as críticas e reclamações dos clientes referente à utilização das máquinas e consumo dos alimentos e os envia para o administrador poder visualizar os comentários do feedback e a instituição em que utilizaram os serviços
- **content-microsservice:** responsável pela visualização do conteúdo das máquinas, como refeições contidas na máquina, quantidade no estoque, preço de venda e compra, receita total e lucro obtido, além da possibilidade de inserir alimento novo e atualizar estoque

# **Banco de dados** 📦

O banco de dados escolhido para o projeto foi relacional e hospedado utilizando o Microsoft Azure SQL Database, o que permite proporcionar alta disponibilidade, escalabilidade e segurança. A conexão com o banco foi implementada utilizando o pacote `mysql2`, com suporte a variáveis de ambiente para manter as credenciais seguras. Toda a configuração do banco, como nome de usuário, senha e host é feito através de um arquivo `.env`.

Também foi utilizado SSL na conexão com o banco hospedado na Azure para garantir segurança na transmissão de dados `(rejectUnauthorized: false)`.

# **Como rodar o projeto?** 🚀

## Backend

Abra um terminal na pasta `Backend` e execute os seguintes comandos:

``` bash
npm install -g
npm run dev:all
```
Este comando irá iniciar todos os microsserviços de uma só vez

Caso opte por executar um microsserviço por vez, vá para a pasta de cada microsserviço e faça os seguintes comandos:

```bash
cd <nome-do-microsservico>
npm install
node index.js
```

## Frontend

Abra um terminal na pasta `Frontend` e execute os seguintes comandos:

```bash
npm install
npm run dev
```

# **Barramento de eventos (RabbitMQ)** 🐰

Para desacoplar a comunicação entre os microsserviços e permitir troca de informações em tempo real (por exemplo, quando uma nova instituição ou máquina é criada), utilizamos um **event bus** baseado em RabbitMQ.

## Como funciona o barramento de eventos

Cada microsserviço pode publicar eventos relevantes (como criação, atualização ou remoção de entidades) no barramento, e outros microsserviços podem consumir esses eventos para manter seus dados sincronizados ou executar ações específicas.

- **Exchange:** Utilizamos o padrão `topic` para rotear eventos por chave.
- **Produtores:** Serviços como `food-microsservice`, `machine-microsservice`, `institution-microsservice` publicam eventos como `food.created`, `machine.updated`, `institution.deleted`.
- **Consumidores:** Outros microsserviços escutam eventos relevantes para atualizar seus próprios bancos ou executar lógicas de negócio.

### Exemplo de fluxo de evento

1. O serviço de instituição cria uma nova instituição e publica o evento `institution.created`.
2. O serviço de máquinas consome esse evento para atualizar sua lista de instituições disponíveis.
3. O serviço de feedback pode consumir eventos de instituição ou máquina para garantir integridade dos dados de feedback.

### Exemplo de código de publicação de evento

```js
// Publicando um evento no barramento
publishEvent('machine.created', { id: 1, institutionId: 2, ... });
```

### Exemplo de código de consumo de evento

```js
// Consumindo eventos do barramento
await consumeEvent('machine_events_queue', 'machine.*', handleMachineEvent);
```

### Diagrama simplificado

```
[food-microsservice]      [machine-microsservice]      [institution-microsservice]
         |                          |                           |
         |------(RabbitMQ Exchange - topic)--------------------|
         |                          |                           |
         |<----- eventos ---------->|<------ eventos ---------->|
```

## Como rodar o RabbitMQ

No terminal da máquina que funcionará como broker RabbitMQ, abra o Docker e execute em seu terminal:

```bash
docker run -d --hostname rabbitmq-host --name rabbitmq \
  -e RABBITMQ_DEFAULT_USER=<usuário> \
  -e RABBITMQ_DEFAULT_PASS=<senha> \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```
Acesse o painel de administração em [http://localhost:15672](http://localhost:15672) com o usuário e senha definidos.

> Observação: os campos de DEFAULT_USER e DEFAULT_PASS devem ser preenchidos com os nomes de usuário e senha configurados para criar o login no RabbitMQ.

---
## Criando usuários e definindo permissões (caso seja necessário)

Caso queira criar ou gerenciar usuários manualmente (sem Docker), siga estes passos:

- Abra um terminal (prompt de comando no Windows) como **administrador** e vá até a pasta de sbin do RabbitMQ (ex.: C:\Program Files\RabbitMQ Server\rabbitmq_server-<versão>\sbin)

- Crie um novo usuário

``` bash 
rabbitmqctl add_user <nome_usuario> <senha_usuario>
```

- Crie (ou selecione) um virtual host (se ainda não existir)

``` bash 
rabbitmqctl add_host <nome_vhost>
```

- Defina permissões para o usuário no vhost

``` bash 
rabbitmqctl set_permissions -p / nome_do_usuario ".*" ".*" ".*"
```

- (Opcional) Atribua tags de administrador, se precisar de acesso total à UI:

``` bash 
rabbitmqctl set_user_tags nome_do_usuario administrator
```

- Reinicie o serviço RabbitMQ para aplicar as mudanças

``` bash 
net stop RabbitMQ
net start RabbitMQ
```

- Adicione no seu .env as informações a respeito  do rabbitMQ

``` bash 
RABBITMQ_URL=amqp://<nome_usuario>:<senha_usuario>@localhost:5672/
```

- Abra o navegador e acesse:

``` bash 
http://localhost:15672
```

# **Contribuidores** 👷‍♂️

- [Felipe Kenzo Ohara Sakae](https://github.com/Sakaef03) | RA: 22.00815-2
- [Guilherme Martins Souza Paula](https://github.com/guimartins10sp) | RA: 22.00006-2
- [Igor Improta Martinez da Silva](https://github.com/igor-ims) | RA: 21.00834-5
- [Lucas Gozze Crapino](https://github.com/LucasCrapino) | RA: 22.00667-2
- [Murillo Penha Strina](https://github.com/Murillo-Strina) | RA: 22.00730-0
- [Pedro Campos Dec](https://github.com/pdec5504) | RA: 22.00787-3
- [Vinicius Garcia Imendes Dechechi](https://github.com/vdechechi) | RA: 22.01568-0
