import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/ui-components/search-form'
import { Header } from '@/ui-components/header'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <BookSearchOverview />
}

function BookSearchOverview() {
  const [searchQuery, setSearchQuery] = useState('')
  const [resultsCount, setResultsCount] = useState(0)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Simulate a search result count (for now)
    setResultsCount(42)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <Header>
        <SearchForm onSearch={handleSearch} defaultValue={searchQuery} />
      </Header>

      {/* Results Count */}
      <div className="mb-4 flex justify-end text-sm text-gray-400">
        {resultsCount > 0
          ? `${String(resultsCount)} records found`
          : 'No records yet'}
      </div>

      {/* Grid of book records (placeholder cards) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl bg-gray-800 p-4 shadow transition hover:shadow-lg"
          >
            <div className="mb-4 h-40 w-full rounded bg-gray-700"></div>
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-600"></div>
            <div className="h-4 w-1/2 rounded bg-gray-600"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
