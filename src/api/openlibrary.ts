import ky from 'ky'

const limit = '6'

export type BookSearchItem = Awaited<ReturnType<typeof getBooks>>[number]

async function getBooks({ search }: { search: string }) {
  const params = new URLSearchParams({
    q: search,
    limit,
    has_fulltext: 'true',
    fields: 'key,title,author_name,first_publish_year,cover_i',
  })
  const response = await ky
    .get(`https://openlibrary.org/search.json?${params.toString()}`)
    .json<
      ReadonlyArray<{
        key: string
        title: string
        author_name: readonly [string, ...ReadonlyArray<string>]
        coverId: string
        first_publish_year: number
        cover_i: number
      }>
    >()

  return response.map((book) => ({
    id: book.key,
    coverId: book.cover_i,
    authorName: book.author_name[0],
    title: book.title,
    publishYear: book.first_publish_year,
  }))
}
