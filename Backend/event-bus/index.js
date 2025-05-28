import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EXCHANGE = 'events';
let channel;

export async function connect() {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    console.log('Conectado ao RabbitMQ!');
}

export function publish(routingKey, payload){
    if (!channel) throw new Error('Barramento não inicializado...');
    const msg = Buffer.from(JSON.stringify(payload));
    channel.publish(EXCHANGE, routingKey, msg, { persistent: true });
}