import { queryOptions, skipToken } from '@tanstack/react-query'
import ky from 'ky'

export const limit = 6

export type BookSearchItem = Awaited<
  ReturnType<typeof getBooks>
>['docs'][number]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function getBooks({ filter, page }: { filter: string; page: number }) {
  const params = new URLSearchParams({
    q: filter,
    page: String(page),
    limit: String(limit),
    has_fulltext: 'true',
    fields: 'key,title,author_name,author_key,first_publish_year,cover_i',
  })
  const { q, ...response } = await ky
    .get(`https://openlibrary.org/search.json?${params.toString()}`)
    .json<{
      numFound: number
      q: string
      docs: Array<{
        key: string
        title: string
        author_name?: Array<string>
        author_key?: Array<string>
        coverId: string
        first_publish_year: number
        cover_i: number
      }>
    }>()

  await sleep(500)

  return {
    ...response,
    filter: q,
    docs: response.docs.map((doc) => ({
      id: doc.key,
      coverId: doc.cover_i,
      authorName: doc.author_name?.[0],
      authorId: doc.author_key?.[0]
        ? `/authors/${doc.author_key[0]}`
        : undefined,
      title: doc.title,
      publishYear: doc.first_publish_year,
    })),
  }
}

export type BookDetailItem = Awaited<ReturnType<typeof getBook>>

async function getBook(id: string) {
  const response = await ky.get(`https://openlibrary.org${id}.json`).json<{
    title: string
    description?: string | { value: string }
    covers?: Array<number>
    links?: Array<{ title: string; url: string }>
    authors?: Array<{ author: { key: string } }>
  }>()

  await sleep(250)

  const description =
    (typeof response.description === 'string'
      ? response.description
      : response.description?.value) ?? 'No description available'

  return {
    title: response.title,
    ...(description
      ? { description: description.replaceAll(String.raw`\n`, '\n') }
      : undefined),
    covers: response.covers?.filter((cover) => cover > 0) ?? [],
    ...(response.links ? { links: response.links } : undefined),
    authorId: response.authors?.[0]?.author.key,
  }
}

export type Author = Awaited<ReturnType<typeof getAuthor>>

async function getAuthor(id: string) {
  const response = await ky.get(`https://openlibrary.org${id}.json`).json<{
    personal_name: string
    links?: Array<{ url: string }>
  }>()

  await sleep(1000)

  const link = response.links?.map((link) => ({
    url: link.url,
  }))[0]?.url

  return {
    name: response.personal_name,
    ...(link ? { link } : undefined),
  }
}

/**
 * If you use an object as the first key, order does not
 * matter when matching, unlike the standard array pattern e.g.
 * [ 'book', 'list' ]
 *
 * You can do more larger scale fuzzy searching, example:
 * Key 1: [{ entity: 'book', type: 'list' }]
 * Key 2: [{ entity: 'issues', type: 'list' }]
 *
 * These following keys will match those above:
 * - [{ entity: 'book' }] <- match on all book entities
 * - [{ entity: 'issues' }] <- match on all issue entities
 * - [{ type: 'list' }] <- match on all of type list
 */

export const bookQueries = {
  all: () => ['books'] as const,
  author: (authorId: string | undefined) =>
    queryOptions({
      queryKey: [...bookQueries.all(), 'author', authorId],
      queryFn: authorId ? () => getAuthor(authorId) : skipToken,
      staleTime: 1000 * 60 * 20, // set staleTime to 20mins
    }),
  list: (filter: string, page: number) =>
    queryOptions({
      queryKey: [...bookQueries.all(), 'list', { filter, page }],
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
      meta: { persist: true },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...bookQueries.all(), 'detail', { id }],
      queryFn: () => getBook(id),
      staleTime: 1000 * 60 * 2, // set staleTime to 2mins
    }),
}
