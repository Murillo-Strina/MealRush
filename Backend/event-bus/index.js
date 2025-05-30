import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EXCHANGE = 'events';
let channel;

export async function initRabbitMQ() {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    console.log('Conectado ao RabbitMQ!');
}

export function publishEvent(routingKey, payload){
    if (!channel) throw new Error('Barramento não inicializado...');
    const msg = Buffer.from(JSON.stringify(payload));
    channel.publish(EXCHANGE, routingKey, msg, { persistent: true });
}

export async function consumeEvent(queueName, bindingKey, onMessage ){
    if(!channel) throw new Error('Barramento não inicializado...');
    
    await channel.assertQueue(queueName, {durable: true});
    await channel.bindQueue(queueName, EXCHANGE, bindingKey);
    
    await channel.consume(queueName, (msg) => {
        if (!msg) return;
        const rk = msg.fields.routingKey;
        let payload;

        try {
            payload =  JSON.parse(msg.content.toString());
            onMessage(rk, payload);
            channel.ack(msg);
        } catch (err) {
            console.error(`[${queueName}] Erro ao processar mensagem: ${err.message}`);
        }
    }, {noAck: false});
}