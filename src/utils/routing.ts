import { query, router } from 'svelte-micro'
import { derived } from 'svelte/store'

export interface Route {
  book?: string
  page?: string
  error?: string
}

export const parseQuery = (query?: string): Route => {
  if (!query) { return {} }
  const search = new URLSearchParams(query)
  return {
    book: search.get('book'),
    page: search.get('page'),
    error: search.get('error'),
  }
}

export const goTo = (route: Route) => {
  const keys = Object.keys(route)
  if (keys.length === 0) {
    router.push('/')
  } else {
    router.push(`/?${keys.map(key => `${key}=${route[key]}`).join('&')}`)
  }
}

export const route = derived(
  query,
  $query => parseQuery($query),
)

query.subscribe(() => {
  window.scrollTo(0, 0)
  if (window.location.hash) {
    // hack to ensure hash is taken into account
    const location = window.location
    setTimeout(() => {
      window.location = location
    }, 200)
  }
})