import {createClient} from 'redis';

// eslint-disable-next-line import/no-mutable-exports
let redisClient: any; 

export const getRedisClient = async () => {
  if (redisClient) {
    return redisClient;
  }
  redisClient = createClient({
		url: process.env.REDIS_URL,
	});
  await redisClient.connect();
  return redisClient;
}

