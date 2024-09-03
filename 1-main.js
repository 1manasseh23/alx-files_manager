import dbClient from './utils/db';
import redisClient from './utils/redis';

const waitForConnection = async (client, checkFunc, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    let elapsed = 0;
    const interval = 1000;

    const checkConnection = async () => {
      try {
        if (checkFunc()) {
          resolve();
        } else if (elapsed >= timeout) {
          reject(new Error('Connection timeout'));
        } else {
          elapsed += interval;
          setTimeout(checkConnection, interval);
        }
      } catch (error) {
        reject(error);
      }
    };

    checkConnection();
  });
};

(async () => {
  try {
    console.log('Initial DB connection status:', dbClient.isAlive());
    console.log('Initial Redis connection status:', redisClient.isAlive());

    // Wait for connections to be established
    await waitForConnection(dbClient, () => dbClient.isAlive());
    await waitForConnection(redisClient, () => redisClient.isAlive());

    console.log('DB connection status after waiting:', dbClient.isAlive());
    console.log('Redis connection status after waiting:', redisClient.isAlive());
    console.log('Number of users:', await dbClient.nbUsers());
    console.log('Number of files:', await dbClient.nbFiles());
  } catch (error) {
    console.error('Error during connections:', error);
  }
})();
