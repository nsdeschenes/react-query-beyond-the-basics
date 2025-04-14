import { useState } from 'react'

type Props = {
  id: string
  coverId: string
  authorName: string
  title: string
  publishYear: number
  onClick: (id: string) => void
}

export function BookSearchItem({
  id,
  coverId,
  authorName,
  title,
  publishYear,
  onClick,
}: Props) {
  const [isLoaded, setLoaded] = useState(false)

  return (
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault()
        onClick(id)
      }}
      className="group block rounded-xl border border-transparent transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-indigo-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
    >
      <div className="flex items-start space-x-4 rounded-xl bg-gray-800 p-4 shadow transition group-hover:shadow-lg">
        {!isLoaded && (
          <div className="h-36 w-24 animate-pulse rounded bg-gray-600" />
        )}
        <img
          src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
          alt={title}
          className={`h-36 w-24 rounded object-cover transition-opacity duration-300 ${isLoaded ? '' : 'hidden'}`}
          onLoad={() => {
            setLoaded(true)
          }}
        />
        <div className="flex flex-col justify-start">
          <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{authorName}</p>
          <p className="mt-2 text-xs text-gray-500">
            Published in {publishYear}
          </p>
        </div>
      </div>
    </a>
  )
}
