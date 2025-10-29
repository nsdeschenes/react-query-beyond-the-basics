import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/books/search-form'
import { Header } from '@/books/header'
import { BookSearchItem } from '@/books/book-search-item'
import { BookDetailItem } from '@/books/book-detail-item'
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
})

function App() {
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [id, setId] = useState<string>()

  if (id) {
    return (
      <div>
        <Header />
        <BookDetail id={id} setId={setId} />
      </div>
    )
  }

  return (
    <div>
      <Header>
        <SearchForm
          onSearch={(newFilter) => {
            if (filter !== newFilter) {
              setFilter(newFilter)
              setPage(1)
            }
          }}
          defaultValue={filter}
        />
      </Header>
      {filter ? (
        <BookSearchOverview
          filter={filter}
          setId={setId}
          page={page}
          setPage={setPage}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function BookSearchOverview({
  page,
  setPage,
  setId,
  filter,
}: {
  filter: string
  setId: (id: string) => void
  page: number
  setPage: (page: number) => void
}) {
  const queryClient = useQueryClient()
  const query = useQuery(bookQueries.list(filter, page))

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.docs.map((book) => (
          <BookSearchItem
            key={book.id}
            {...book}
            onClick={setId}
            onMouseEnter={() => {
              queryClient.prefetchQuery(bookQueries.detail(book.id))
            }}
            onFocus={() => {
              queryClient.prefetchQuery(bookQueries.detail(book.id))
            }}
          />
        ))}
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        maxPages={Math.ceil(query.data.numFound / limit)}
      />
    </div>
  )
}

function BookDetail({
  id,
  setId,
}: {
  id: string
  setId: (id: string | undefined) => void
}) {
  const bookQuery = useQuery(bookQueries.detail(id))

  const authorId = bookQuery?.data?.authorId
  const authorQuery = useQuery(bookQueries.author(authorId))

  if (bookQuery.status === 'pending') {
    return <PendingState />
  }

  if (bookQuery.status === 'error') {
    return <ErrorState error={bookQuery.error} />
  }

  return (
    <div>
      <BookDetailItem
        {...bookQuery.data}
        author={authorQuery.data}
        onBack={() => {
          setId(undefined)
        }}
      />
    </div>
  )
}
