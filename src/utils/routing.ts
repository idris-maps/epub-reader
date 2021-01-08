import { router } from 'svelte-micro'

export interface Query {
  book?: string
  page?: string
  error?: string
}

const removeFirst = (d: string) => {
  if (d.startsWith('?')) { return d.substring(1) }
  if (d.startsWith('/?')) { return d.substring(2) }
  return d
}

const split = (q: string) =>
  q.split('&')
    .map(d => d.split('='))

const initGetValue = (parts: string[][]) =>
  (key: string): string | undefined => {
    const found = parts.find(d => d[0] === key)
    return found ? found[1] : undefined
  }

export const parseQuery = (query?: string): Query => {
  if (!query) { return {} }
  const getValue = initGetValue(split(removeFirst(query)))
  return {
    book: getValue('book'),
    page: getValue('page'),
    error: getValue('error'),
  }
}

export const goTo = (query: Query) => {
  const keys = Object.keys(query)
  if (keys.length === 0) {
    router.push('/')
  } else {
    router.push(`/?${keys.map(key => `${key}=${query[key]}`).join('&')}`)
  }
}
