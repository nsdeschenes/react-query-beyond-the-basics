import { Search, SearchCheck, FileWarning } from 'lucide-react'

const SpotIcon = ({
  icon: Icon,
  label,
}: {
  icon: typeof Search
  label: string
}) => (
  <div className="mt-20 flex flex-col items-center justify-center space-y-4 text-center text-gray-400">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 shadow">
      <Icon className="h-8 w-8 text-indigo-400" />
    </div>
    <p className="text-lg font-medium">{label}</p>
  </div>
)

export function EmptyState() {
  return (
    <SpotIcon
      icon={SearchCheck}
      label="Please type into the search field to make a query."
    />
  )
}

export function NoResultsState() {
  return (
    <SpotIcon
      icon={FileWarning}
      label="No results found for your query. Try another search."
    />
  )
}
