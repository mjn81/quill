import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from './redis';

let rateLimiter: RateLimiterRedis;
export const getRateLimiter = async () => {
	if (rateLimiter) {
		return rateLimiter;
  }
  
  const redisClient = await getRedisClient();
	rateLimiter = new RateLimiterRedis({
		storeClient: redisClient,
		points: 100, // 10 points
		duration: 1, // Per second
	});

  	return rateLimiter;
};
