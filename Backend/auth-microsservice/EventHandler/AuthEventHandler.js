export async function handleAuthEvent(routingKey, data){
    switch(routingKey){
        case 'user.registered':
            console.log('User registered:', data);
            break;
        case 'user.password_reset':
            console.log('User password reset:', data);
            break;
        case 'user.deleted':
            console.log('User deleted:', data);
            break;
        default:
            console.warn(`Unhandled routing key: ${routingKey}`);
    }
}