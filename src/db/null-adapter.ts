import type { IDataAdapter } from "@promakeai/orm";

/**
 * An IDataAdapter that holds no data. Used only during build-time prerender
 * (SSR), where no real data source exists. Every read returns empty and every
 * write is a no-op resolving to a neutral value, so data-driven components
 * render their empty state instead of throwing. The real adapter replaces it
 * on the client after mount, so SSR output equals the client's first render.
 */
export class NullAdapter implements IDataAdapter {
  schema?: IDataAdapter["schema"];
  defaultLang?: string;

  constructor(config?: { schema?: IDataAdapter["schema"]; defaultLang?: string }) {
    this.schema = config?.schema;
    this.defaultLang = config?.defaultLang;
  }

  setSchema(schema: NonNullable<IDataAdapter["schema"]>): void {
    this.schema = schema;
  }

  connect(): void {}
  close(): void {}

  async list<T = unknown>(): Promise<T[]> {
    return [];
  }
  async get<T = unknown>(): Promise<T | null> {
    return null;
  }
  async findOne<T = unknown>(): Promise<T | null> {
    return null;
  }
  async count(): Promise<number> {
    return 0;
  }
  async paginate<T = unknown>(): Promise<{
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }> {
    return { data: [], page: 1, limit: 0, total: 0, totalPages: 0, hasMore: false };
  }
  async create<T = unknown>(): Promise<T> {
    return {} as T;
  }
  async update<T = unknown>(): Promise<T> {
    return {} as T;
  }
  async delete(): Promise<boolean> {
    return false;
  }
  async createMany(): Promise<{ created: number; ids: (number | bigint)[] }> {
    return { created: 0, ids: [] };
  }
  async updateMany(): Promise<{ updated: number }> {
    return { updated: 0 };
  }
  async deleteMany(): Promise<{ deleted: number }> {
    return { deleted: 0 };
  }
  async createWithTranslations<T = unknown>(): Promise<T> {
    return {} as T;
  }
  async upsertTranslation(): Promise<void> {}
  async getTranslations<T = unknown>(): Promise<T[]> {
    return [];
  }
  async raw<T = unknown>(): Promise<T[]> {
    return [];
  }
  async execute(): Promise<{ changes: number; lastInsertRowid: number | bigint }> {
    return { changes: 0, lastInsertRowid: 0 };
  }
  async beginTransaction(): Promise<void> {}
  async commit(): Promise<void> {}
  async rollback(): Promise<void> {}
}
