import NodeCache from "node-cache";
import type { CacheImpl } from "./cache";

export default class NodeCacheService implements CacheImpl {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl: number): void {
    this.cache.set(key, value, ttl);
  }
  delete(key: string): void {
    this.cache.del(key);
  }
  has<T>(key: string): boolean {
    return this.cache.has(key);
  }
}
