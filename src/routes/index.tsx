import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/ui-components/search-form'
import { Header } from '@/ui-components/header'
import { BookSearchItem } from '@/ui-components/book-search-item'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <BookSearchOverview />
}

function BookSearchOverview() {
  const [searchQuery, setSearchQuery] = useState('')

  const query = {
    data: {
      numFound: 13_629,
      docs: [
        {
          coverId: '240727',
          authorName: 'J.K. Rowling',
          title: "Harry Potter and the Philosopher's Stone",
          publishYear: 1997,
        },
        {
          coverId: '8226196',
          authorName: 'J.R.R. Tolkien',
          title: 'The Hobbit',
          publishYear: 1937,
        },
        {
          coverId: '10523361',
          authorName: 'George Orwell',
          title: '1984',
          publishYear: 1949,
        },
        {
          coverId: '11169123',
          authorName: 'F. Scott Fitzgerald',
          title: 'The Great Gatsby',
          publishYear: 1925,
        },
        {
          coverId: '10958358',
          authorName: 'Mary Shelley',
          title: 'Frankenstein',
          publishYear: 1818,
        },
        {
          coverId: '10909258',
          authorName: 'Charlotte Brontë',
          title: 'Jane Eyre',
          publishYear: 1847,
        },
      ],
    },
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <Header>
        <SearchForm onSearch={handleSearch} defaultValue={searchQuery} />
      </Header>

      {/* Results Count */}
      <div className="mb-4 flex justify-end text-sm text-gray-400">
        {query.data.numFound.toString()} records found
      </div>

      {/* Grid of book records (placeholder cards) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.docs.map((book) => (
          <BookSearchItem key={book.title} {...book} />
        ))}
      </div>
    </div>
  )
}
