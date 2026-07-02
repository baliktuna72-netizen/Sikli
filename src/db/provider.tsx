import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryClient } from '@tanstack/react-query';
import { DbProvider, SqliteAdapter } from '@promakeai/dbreact';
import { RestAdapter, parseJSONSchema } from '@promakeai/orm';
import type { IDataAdapter } from '@promakeai/orm';
import constants from '@/constants/constants.json';
import schemaJson from './schema.json';
import { NullAdapter } from './null-adapter';

const schema = parseJSONSchema(schemaJson as any);

interface AppDbProviderProps {
  children: ReactNode;
}

const DEFAULT_LANG = constants?.site?.defaultLanguage || 'en';
const DB_CONFIG = (constants as any)?.database;

// Reused across renders so the adapter prop identity stays stable during the
// prerender pass. Only ever used when VITE_PRERENDER is defined (build-time SSR).
const NULL_ADAPTER = new NullAdapter({ schema, defaultLang: DEFAULT_LANG });

/**
 * Read auth token from localStorage (where auth-core's Zustand store persists).
 * Returns null when auth-core is not installed or user is not logged in.
 */
function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.tokens?.accessToken ?? null;
  } catch {
    return null;
  }
}

let cachedDbHeaders: Record<string, string> = {};
let refreshInterval: ReturnType<typeof setInterval> | null = null;

async function refreshDbHeaders(): Promise<void> {
  try {
    const [modeRes, versionRes] = await Promise.all([
      fetch('/cus-be-db-mode.txt'),
      fetch('/cus-be-db.txt'),
    ]);
    const headers: Record<string, string> = {};
    if (modeRes.ok) {
      const mode = (await modeRes.text()).trim();
      if (mode) headers['DB-MODE'] = mode;
    }
    // In Promake preview mode, never pin the backend to a specific schema
    // version — preview must always reflect the latest/draft DB. Detect
    // preview via either the Vite dev flag (local/dev-served previews) or
    // the `*.preview.promake.ai` hostname (production-served previews).
    // Published builds keep sending DB-VERSION to pin the snapshot.
    const isPreview =
      import.meta.env.DEV ||
      (typeof window !== 'undefined' &&
        window.location.hostname.includes('preview.promake.ai'));
    if (versionRes.ok && !isPreview) {
      const version = (await versionRes.text()).trim();
      if (version) headers['DB-VERSION'] = version;
    }
    cachedDbHeaders = headers;
  } catch {
    // Keep existing cache on failure
  }
}

function startHeaderRefresh(intervalMs = 30_000): void {
  if (refreshInterval) return;
  refreshInterval = setInterval(refreshDbHeaders, intervalMs);
}

function stopHeaderRefresh(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

function getDynamicDbHeaders(): Record<string, string> {
  return cachedDbHeaders;
}

export function AppDbProvider({ children }: AppDbProviderProps) {
  const { i18n } = useTranslation();
  const [adapter, setAdapter] = useState<IDataAdapter | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Own the QueryClient so we can invalidate it when the real adapter replaces
  // the prerender NullAdapter. Without this, the prerender pass (and the client's
  // matching first render) caches empty results from NullAdapter under each
  // query key; dbreact only invalidates on language change, so swapping in the
  // real adapter would never refetch and every data-driven page would stay empty.
  const [queryClient] = useState(() => new QueryClient());
  const renderedWithNullAdapter = useRef(false);

  useEffect(() => {
    // When the real adapter arrives after a NullAdapter render, drop the empty
    // cached results so every query refetches against real data.
    if (adapter && renderedWithNullAdapter.current) {
      renderedWithNullAdapter.current = false;
      queryClient.invalidateQueries();
    }
  }, [adapter, queryClient]);

  useEffect(() => {
    let cancelled = false;

    async function loadDb() {
      try {
        if (DB_CONFIG?.adapter === 'rest') {
          // Fetch dynamic headers before creating adapter
          await refreshDbHeaders();
          startHeaderRefresh();

          // REST API mode
          const restAdapter = new RestAdapter({
            baseUrl: 'https://' + import.meta.env.VITE_TENANT_UUID + '.backend.promake.ai',
            databasePrefix: '/database',
            schema,
            defaultLang: DEFAULT_LANG,
            getToken: getAuthToken,
            getHeaders: getDynamicDbHeaders,
          });

          if (!cancelled) {
            setAdapter(restAdapter);
          }
        } else {
          // SQLite mode (default)
          const response = await fetch('/data/database.db');
          if (!response.ok) {
            throw new Error(`Failed to load database: ${response.status} ${response.statusText}`);
          }

          const buffer = await response.arrayBuffer();
          if (cancelled) return;

          const dbAdapter = new SqliteAdapter({
            schema,
            defaultLang: DEFAULT_LANG,
            wasmPath: '/sql-wasm.wasm',
          });

          await dbAdapter.connect();
          await dbAdapter.import(new Uint8Array(buffer));

          if (!cancelled) {
            setAdapter(dbAdapter);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }

    loadDb();

    return () => {
      cancelled = true;
      stopHeaderRefresh();
    };
  }, []);

  if (error) {
    console.error(error);
  }

  // Backward compatible: with prerender OFF, keep the original behavior of
  // rendering nothing until the real adapter has loaded. With prerender ON,
  // render children immediately against an empty NullAdapter so SSR produces
  // markup and the client's first render matches it (clean hydration); the
  // real adapter then replaces NULL_ADAPTER on mount.
  const adapterToUse = adapter ?? (import.meta.env.VITE_PRERENDER ? NULL_ADAPTER : null);

  if (!adapterToUse) {
    return null;
  }

  // Remember that this render used the empty NullAdapter, so the effect above can
  // invalidate the now-stale empty cache once the real adapter loads.
  if (adapterToUse === NULL_ADAPTER) {
    renderedWithNullAdapter.current = true;
  }

  // Point dbreact's realtime listener at the tenant backend SSE endpoint when the
  // REST adapter is active. dbreact opens a single stream and refetches a table on
  // change; the prop is opt-in and degrades to no-op against a backend without it.
  // Per-tenant backend host: `https://<tenant-uuid>.backend.promake.ai`. This
  // literal is DUPLICATED (this is shipped template code, so it cannot share an
  // import with the CLI): the CLI builds the same host in
  // src/utils/backend-client.ts (resolveCreds). Keep the two in sync; the
  // `.backend.promake.ai` suffix is the load-bearing part.
  // Guard on the REAL adapter: never attach realtime against the NullAdapter
  // (it has no backend).
  const realtime =
    adapter && DB_CONFIG?.adapter === 'rest'
      ? {
          url: 'https://' + import.meta.env.VITE_TENANT_UUID + '.backend.promake.ai' + '/realtime',
          getToken: getAuthToken,
        }
      : undefined;

  return (
    <DbProvider
      adapter={adapterToUse}
      queryClient={queryClient}
      lang={i18n?.language || DEFAULT_LANG}
      fallbackLang={DEFAULT_LANG}
      autoConnect={false}
      realtime={realtime}
    >
      {children}
    </DbProvider>
  );
}
