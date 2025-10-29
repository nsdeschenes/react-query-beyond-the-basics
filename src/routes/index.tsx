import { createFileRoute } from '@tanstack/react-router'
import { SearchForm } from '@/books/search-form'
import { Header } from '@/books/header'
import { BookSearchItem } from '@/books/book-search-item'
import { Pagination } from '@/books/pagination'
import { bookQueries, limit } from '@/api/openlibrary'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EmptyState,
  ErrorState,
  NoResultsState,
  PendingState,
} from '@/books/search-states'

export const Route = createFileRoute('/')({
  component: App,
  loaderDeps: ({ search }) => ({ filter: search.filter, page: search.page }),
  context: ({ deps }) => ({
    bookListQuery: bookQueries.list(deps.filter, deps.page),
  }),
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(context.bookListQuery)
  },
})

function App() {
  const { filter } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <div>
      <Header>
        <SearchForm
          onSearch={(newFilter) => {
            if (filter !== newFilter) {
              navigate({ search: { filter: newFilter, page: 1 } })
            }
          }}
          defaultValue={filter}
        />
      </Header>
      {filter ? <BookSearchOverview filter={filter} /> : <EmptyState />}
    </div>
  )
}

function BookSearchOverview({ filter }: { filter: string }) {
  const routeContext = Route.useRouteContext()
  const query = useQuery({
    ...routeContext.bookListQuery,
    // Can also use this util from Query
    // placeholderData: keepPreviousData,
    placeholderData: (previousData) => {
      return previousData?.filter === filter ? previousData : undefined
    },
  })

  if (query.status === 'pending') {
    if (query.fetchStatus === 'fetching') {
      return <PendingState />
    }
    return <EmptyState />
  }

  if (query.status === 'error') {
    return <ErrorState error={query.error} />
  }

  if (query.data.numFound === 0) {
    return <NoResultsState />
  }

  return (
    <div>
      <div className="mb-4 flex justify-end text-sm text-gray-400">
        {query.data.numFound} records found
      </div>

      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ opacity: query.isPlaceholderData ? 0.5 : 1 }}
      >
        {query.data.docs.map((book) => (
          <BookSearchItem key={book.id} {...book} />
        ))}
      </div>

      <Pagination maxPages={Math.ceil(query.data.numFound / limit)} />
    </div>
  )
}
