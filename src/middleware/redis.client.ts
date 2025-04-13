import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB) || 0,
  retryStrategy(times: number) {
    // exponential backoff: wait time in ms
    return Math.min(times * 50, 2000);
  },
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('[Redis] Redis connection error:', err);
});

export default redisClient;
