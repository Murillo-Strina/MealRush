export async function handleInstitutionEvent(routingKey, data) {
    switch (routingKey) {
        case 'institution.created':
            console.log('Institution created:', data);
            break;
        case 'institution.updated':
            console.log('Institution updated:', data);
            break;
        case 'institution.deleted':
            console.log('Institution deleted:', data);
            break;
        default:
            console.warn(`Unhandled routing key: ${routingKey}`);
    }
}