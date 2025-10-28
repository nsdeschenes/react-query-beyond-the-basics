import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/books/search-form'
import { Header } from '@/books/header'
import { BookSearchItem } from '@/books/book-search-item'
import { BookDetailItem } from '@/books/book-detail-item'
import { Pagination } from '@/books/pagination'
import { getAuthor, getBook, getBooks, limit } from '@/api/openlibrary'
import { skipToken, useQuery } from '@tanstack/react-query'
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
  const query = useQuery({
    queryKey: ['books', 'list', { filter, page }],
    /**
     * Different ways of disabling queries:
     * 1st way: old way of disabling query - not type safe :c
     * enabled: !!filter,
     *
     * 2nd way: using skipToken also disables the query - but it is type safe c:
     * queryFn: filter ? () => getBooks({ filter, page }) : skipToken,
     *
     * 3rd way: conditionally rendering this component, see above L48-L57
     */
    queryFn: () => getBooks({ filter, page }),
    staleTime: 1000 * 60 * 2, // set staleTime to 2mins
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.docs.map((book) => (
          <BookSearchItem key={book.id} {...book} onClick={setId} />
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
  const bookQuery = useQuery({
    queryKey: ['books', 'detail', { id }],
    queryFn: () => getBook(id),
    staleTime: 1000 * 60 * 2, // set staleTime to 2mins
  })

  const authorId = bookQuery?.data?.authorId

  const authorQuery = useQuery({
    queryKey: ['books', 'author', authorId],
    queryFn: authorId ? () => getAuthor(authorId) : skipToken,
    staleTime: 1000 * 60 * 20, // set staleTime to 20mins
  })

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
