export async function handleFoodEvent(routingKey, data){
    switch(routingKey){
        case 'food.created':
            console.log('food created:',data);
        case 'food.updated':
            console.log('food updated:',data);
        case 'food.deleted':
            console.log('food deleted:',data);
            break;
            default:
            console.warn(`Unhandled routing key: ${routingKey}`);
    }
}