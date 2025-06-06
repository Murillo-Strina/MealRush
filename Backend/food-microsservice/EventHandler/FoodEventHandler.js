export async function handleFoodEvent(routingKey, data){
    switch(routingKey){
        case 'food.created':
            console.log('food created:',data);
            break;
        case 'food.updated':
            console.log('food updated:',data);
            break;
        case 'food.deleted':
            console.log('food deleted:',data);
            break;
            default:
            console.warn(`Unhandled routing key: ${routingKey}`);
    }
}