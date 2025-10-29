import { bookQueries } from '@/api/openlibrary'
import { BookDetailItem } from '@/books/book-detail-item'
import { Header } from '@/books/header'
import { ErrorState, PendingState } from '@/books/search-states'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$id')({
  component: BookDetail,
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(bookQueries.detail(params.id))
  },
})

function BookDetail() {
  const { id } = Route.useParams()
  const { filter, page } = Route.useSearch()
  const queryClient = useQueryClient()

  const bookQuery = useQuery({
    ...bookQueries.detail(id),
    // Initial data isn't the best way to pre-fill the cache with data
    // because it doesn't know if the query client made the fetch or it
    // was put in there, and the stale time won't be set to zero so query
    // won't make a new fetch

    // initialData: () => {
    //   const bookData = queryClient
    //     .getQueryData(bookQueries.list(filter, page).queryKey)
    //     ?.docs?.find((book) => book.id === id)

    //   if (bookData) {
    //     return {
    //       title: bookData.title,
    //       authorId: bookData.authorId,
    //       covers: [bookData.coverId],
    //     }
    //   }
    // },

    // Place holder data is the better option of the two, if you want to
    // just show something while fetching the real data, as it's return
    // value is never actually set into the query cache.
    placeholderData: () => {
      const bookData = queryClient
        .getQueryData(bookQueries.list(filter, page).queryKey)
        ?.docs?.find((book) => book.id === id)

      if (bookData) {
        return {
          title: bookData.title,
          authorId: bookData.authorId,
          covers: [bookData.coverId],
        }
      }
    },
  })

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
      <Header />
      <BookDetailItem {...bookQuery.data} author={authorQuery.data} />
    </div>
  )
}
