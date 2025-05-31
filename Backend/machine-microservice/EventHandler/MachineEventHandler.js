export async function handleMachineEvent(routingKey, data) {
    switch (routingKey) {
        case 'machine.created':
            console.log('Machine created:', data);
            break;
        case 'machine.updated':
            console.log('Machine updated:', data);
            break;
        case 'machine.deleted':
            console.log('Machine deleted:', data);
            break;
        default:
            console.warn(`Unhandled routing key: ${routingKey}`);
    }
}