import { EventEmitter } from "events";

class SingletonEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Allow many SSE connections
  }
}

export const emitter = new SingletonEmitter();

export interface EngineUpdateData {
  type: "research" | "discover" | "content" | "posting" | "full";
  status: "running" | "completed" | "failed";
  message: string;
}

export interface PostPublishedData {
  platform: string;
  promotionName: string;
}

export interface DiscoverNewData {
  count: number;
}

export function emitEngineUpdate(userId: string, data: EngineUpdateData): void {
  emitter.emit(`engine_update_${userId}`, data);
}

export function emitPostPublished(userId: string, data: PostPublishedData): void {
  emitter.emit(`post_published_${userId}`, data);
}

export function emitDiscoverNew(userId: string, data: DiscoverNewData): void {
  emitter.emit(`discover_new_${userId}`, data);
}
