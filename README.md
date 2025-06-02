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
- **food-microsservice:** responsável pela aquisição dos dados das refeições oferecidas pela empresa
- **machine-microsservice:** responsável pela aquisição dos dados das máquinas disponíveis em cada instituição parceira
- **institution-microsservice:** responsável pela aquisição dos dados das instituições parceiras
- **login-microsservice:** realiza a autenticação do administrador para visualizar suas interfaces exclusivas
- **feedback-microsservice:** chatbot que coleta as críticas e reclamações dos clientes referente à utilização das máquinas e consumo dos alimentos e os envia para o administrador poder visualizar os comentários do feedback e a instituição em que utilizaram os serviços

# **Barramento de eventos (RabbitMQ)** 🚌
Para desacoplar a comunicação entre os microsserviços e permitir troca de informações em tempo real (por exemplo, quando uma nova instituição ou máquina é criada), utilizamos um **event bus** baseado em RabbitMQ. Abaixo, as etapas básicas para configurar e rodar o RabbitMQ via Docker, além de como integrar em nossos serviços.

No terminal da máquina que funcionará como broker RabbitMQ, execute:

```bash
docker run -d --hostname rabbitmq-host --name rabbitmq \ -e RABBITMQ_DEFAULT_USER=<usuário> \ -eRABBITMQ_DEFAULT_PASS=<senha> \ -p 5672:5672 -p 15672:15672 \ rabbitmq:3-management
  ```
  Observação: os campos de DEFAULT_USER e DEFAULT_PASS devem ser preenchidos com os nomes de usuário e senha configurados para criar o login no RabbitMQ

# **Contribuidores** 👷‍♂️

- [Felipe Kenzo Ohara Sakae](https://github.com/Sakaef03) | RA: 22.00815-2
- [Guilherme Martins Souza Paula](https://github.com/guimartins10sp) | RA: 22.00006-2
- [Igor Improta Martinez da Silva](https://github.com/igor-ims) | RA: 21.00834-5
- [Lucas Gozze Crapino](https://github.com/LucasCrapino) | RA: 22.00667-2
- [Murillo Penha Strina](https://github.com/Murillo-Strina) | RA: 22.00730-0
- [Pedro Campos Dec](https://github.com/pdec5504) | RA: 22.00787-3
- [Vinicius Garcia Imendes Dechechi](https://github.com/vdechechi) | RA: 22.01568-0
