import NodeCacheService from "./nodeCache";

export interface CacheImpl {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttl: number): void;
  has<T>(key: string): boolean;
  delete(key: string): void;
}

class Cache implements CacheImpl {
  private imp: CacheImpl;
  constructor(impl: CacheImpl) {
    this.imp = impl;
  }
  public get<T>(key: string): T | undefined {
    return this.imp.get<T>(key);
  }
  public has<T>(key: string): boolean {
    return this.imp.has<T>(key);
  }
  /**
   * Set a value in the cache.
   * @param {string} key The key to store the value under.
   * @param {T} value The value to store.
   * @param {number} ttl The time to live in seconds.
   */
  public set<T>(key: string, value: T, ttl: number): void {
    this.imp.set<T>(key, value, ttl);
  }
  public delete(key: string): void {
    this.imp.delete(key);
  }
}

const cache = new Cache(new NodeCacheService());
export default cache;
