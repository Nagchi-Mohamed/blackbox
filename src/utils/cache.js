const cache = new Map();

export const getCachedData = async (key, fetchFn, ttl = 300000) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }
  
  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const clearCache = (key) => {
  cache.delete(key);
};