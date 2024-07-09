const redis = require('redis')


const redisClient = redis.createClient({
    url: 'redis://default:es6EOuZvnb+8QSQSpuNSjzQx0hSsdxHsYzdNRkLf9qMA0v8F56kQf0kupgQca3AdOUIDvPzBxtDKYAyM@50.7.28.250:6379',
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