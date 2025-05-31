export async function handleFeedbackEvent(routingKey, data) {
    switch (routingKey) {
        case 'feedback.created':
            console.log('Feedback created:', data);
            break;
        case 'feedback.updated':
            console.log('Feedback updated:', data);
            break;
        case 'feedback.deleted':
            console.log('Feedback deleted:', data);
            break;
        default:
            console.warn(`Unhandled routing key: ${routingKey}`);
    }
}