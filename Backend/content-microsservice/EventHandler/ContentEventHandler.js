export async function handleContentEvent(routingKey, data) {
    switch (routingKey) {
        case 'content.created':
            console.log('Content created:', data);
            break;
        case 'content.updated':
            console.log('Content updated:', data);
            break;
        case 'content.deleted':
            console.log('Content deleted:', data);
            break;
        default:
            console.warn(`Unhandled routing key: ${routingKey}`);
    }
}