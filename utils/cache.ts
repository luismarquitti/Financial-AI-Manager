// A simple in-memory cache.
// In a real app, this might be backed by localStorage or sessionStorage,
// but for this demo, an in-memory map that resets on refresh is sufficient,
// aligning with the project's current state.

const cache = new Map<string, any>();

export const get = <T>(key: string): T | undefined => {
  return cache.get(key) as T | undefined;
};

export const set = <T>(key: string, value: T): void => {
  cache.set(key, value);
};

export const clear = (key: string): void => {
    cache.delete(key);
}

/**
 * Clears the entire in-memory cache.
 * This is used by the main App component to reset the application state.
 */
export const clearAllCache = (): void => {
  console.log("Clearing all application cache.");
  cache.clear();
};
