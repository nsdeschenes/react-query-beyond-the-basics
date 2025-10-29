import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  useIsRestoring,
} from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { del, get, set } from 'idb-keyval'
import { bookQueries } from './api/openlibrary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 1000, // 2 seconds
      gcTime: 1000 * 60 * 60, // 1 hour
    },
  },
})

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { persist?: boolean }
    mutationMeta: { persist?: boolean }
  }
}

queryClient.setQueryDefaults(bookQueries.all(), {
  staleTime: 2 * 60 * 1000, // 2 minutes
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultGcTime: 0,
  defaultPendingMinMs: 0,
  defaultPendingMs: 100,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const persister = createAsyncStoragePersister({
  // storage: localStorage,
  storage: {
    getItem: get,
    setItem: set,
    removeItem: del,
  },
})

function PersistGate({ children }: { children: React.ReactNode }) {
  const isRestoring = useIsRestoring()

  return isRestoring ? null : children
}

// Render the app
const rootElement = document.querySelector('#app')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  await (await import('@/server/handlers')).worker.start()
  root.render(
    <StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              // opting into persisting queries that have the
              // meta field set to true
              return (
                defaultShouldDehydrateQuery(query) &&
                query.meta?.persist === true
              )
            },
          },
        }}
      >
        <PersistGate>
          <RouterProvider router={router} />
        </PersistGate>
      </PersistQueryClientProvider>
    </StrictMode>,
  )
}
