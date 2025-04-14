import { CoverImage } from '@/ui-components/cover-image'

type Props = {
  title: string
  description: string
  covers?: ReadonlyArray<string>
  links?: ReadonlyArray<{ title: string; url: string }>
}

export function BookDetailItem({ title, description, links, covers }: Props) {
  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-gray-800 p-6 text-gray-100 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>

      {covers && covers.length > 0 && (
        <div className="mb-6 flex space-x-4">
          {covers.slice(0, 5).map((src) => (
            <CoverImage key={src} id={src} title={src} />
          ))}
        </div>
      )}

      <p className="mb-4 whitespace-pre-line text-gray-300">{description}</p>

      {links && links.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold text-white">
            Related Links
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
