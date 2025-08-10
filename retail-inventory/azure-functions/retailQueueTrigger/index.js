module.exports = async function (context, myQueueItem) {
    context.log('📦 Queue Trigger fired!');
    context.log('Queue message content:', myQueueItem);

    try {
        const data = typeof myQueueItem === 'string' 
            ? JSON.parse(myQueueItem) 
            : myQueueItem;

        context.log(`Product ID: ${data.productId}`);
        context.log(`Name: ${data.name}`);
        context.log(`Stock: ${data.stock}`);
        context.log(`Correlation ID: ${data.correlationId}`);
    } catch (err) {
        context.log.error('❌ Failed to process queue message:', err);
    }
};

