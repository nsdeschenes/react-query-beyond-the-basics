import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/books/search-form'
import { Header } from '@/books/header'
import { BookSearchItem } from '@/books/book-search-item'
import { BookDetailItem } from '@/books/book-detail-item'
import { Pagination } from '@/books/pagination'
import { limit } from '@/api/openlibrary'

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
        <SearchForm onSearch={setFilter} defaultValue={filter} />
      </Header>
      <BookSearchOverview
        filter={filter}
        setId={setId}
        page={page}
        setPage={setPage}
      />
    </div>
  )
}

function BookSearchOverview({
  page,
  setPage,
  setId,
}: {
  filter: string
  setId: (id: string) => void
  page: number
  setPage: (page: number) => void
}) {
  const query = {
    data: {
      numFound: 13_629,
      docs: [
        {
          id: '0',
          coverId: 240_727,
          authorName: 'J.K. Rowling',
          authorId: '/authors/OL73937A',
          title: "Harry Potter and the Philosopher's Stone",
          publishYear: 1997,
        },
        {
          id: '1',
          coverId: 8_226_196,
          authorName: 'J.R.R. Tolkien',
          authorId: '/authors/OL26284A',
          title: 'The Hobbit',
          publishYear: 1937,
        },
        {
          id: '2',
          coverId: 10_523_361,
          authorName: 'George Orwell',
          authorId: '/authors/OL26320A',
          title: '1984',
          publishYear: 1949,
        },
        {
          id: '3',
          coverId: 11_169_123,
          authorName: 'F. Scott Fitzgerald',
          authorId: '/authors/OL26283A',
          title: 'The Great Gatsby',
          publishYear: 1925,
        },
        {
          id: '4',
          coverId: 10_958_358,
          authorName: 'Mary Shelley',
          authorId: '/authors/OL26282A',
          title: 'Frankenstein',
          publishYear: 1818,
        },
        {
          id: '5',
          coverId: 10_909_258,
          authorName: 'Charlotte Brontë',
          authorId: '/authors/OL26281A',
          title: 'Jane Eyre',
          publishYear: 1847,
        },
      ],
    },
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

const mockDescription = `***A Game of Thrones*** is the inaugural novel in ***A Song of Ice and Fire***, an epic
      series of fantasy novels crafted by the American author **George R. R. Martin**. Published on August 1, 1996, this
      novel introduces readers to the richly detailed world of Westeros and Essos, where political intrigue, power
      struggles, and magical elements intertwine.`

function BookDetail({
  setId,
}: {
  id: string
  setId: (id: string | undefined) => void
}) {
  return (
    <div>
      <BookDetailItem
        title="A Game of Thrones"
        description={mockDescription}
        covers={[9_269_962, 10_513_947, 9_031_121, 8_773_509, 9_269_938]}
        links={[
          {
            title:
              'Official Book Page - A Game of Thrones (A Song of Ice and Fire, Book One) | George R.R. Martin',
            url: 'https://georgerrmartin.com/grrm_book/a-game-of-thrones-a-song-of-ice-and-fire-book-one/',
          },
          {
            title: 'Wikipedia - A Game of Thrones',
            url: 'https://en.wikipedia.org/wiki/A_Game_of_Thrones',
          },
          {
            title: 'A Wiki of Ice and Fire - A Game of Thrones',
            url: 'https://awoiaf.westeros.org/index.php/A_Game_of_Thrones',
          },
          {
            title: 'TV Tropes - A Game of Thrones (Literature)',
            url: 'https://tvtropes.org/pmwiki/pmwiki.php/Literature/AGameOfThrones',
          },
        ]}
        author={{
          name: 'George R. R. Martin',
          link: undefined,
        }}
        onBack={() => {
          setId(undefined)
        }}
      />
    </div>
  )
}
