const redis = require('redis')


const redisClient = redis.createClient({
    url: 'redis://default:bpHNkiZdLrwAXfFOn2Bamy4Du56rMFcW@redis-16007.c98.us-east-1-4.ec2.redns.redis-cloud.com:16007',
    legacyMode: false
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});


(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis', err);
    }
})();

module.exports = redisClient