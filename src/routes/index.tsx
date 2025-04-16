import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/ui-components/search-form'
import { Header } from '@/ui-components/header'
import { BookSearchItem } from '@/ui-components/book-search-item'
import { BookDetailItem } from '@/ui-components/book-detail-item'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [search, setSearch] = useState('')
  const [id, setId] = useState<string>()

  if (id) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
        <Header />
        <BookDetail id={id} setId={setId} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <Header>
        <SearchForm onSearch={setSearch} defaultValue={search} />
      </Header>
      <BookSearchOverview search={search} setId={setId} />
    </div>
  )
}

function BookSearchOverview({
  setId,
}: {
  search: string
  setId: (id: string) => void
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
        {query.data.numFound.toString()} records found
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.docs.map((book) => (
          <BookSearchItem key={book.title} {...book} onClick={setId} />
        ))}
      </div>
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
        onBack={() => {
          setId(undefined)
        }}
        author={{
          name: 'George R. R. Martin',
          link: undefined,
        }}
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
      />
    </div>
  )
}
