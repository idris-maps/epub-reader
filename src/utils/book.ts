import { derived, writable } from 'svelte/store'
import { route, goTo } from './routing'
import getPageByPath from './getPageByPath'
import type { Readable, Writable } from 'svelte/store'
import type { Route } from './routing'
import type { Epub } from './parseEpub'
import type { Page } from './parseEpub/getPages'

export const book = writable<Epub | undefined>(undefined)

export interface PageWithNav extends Page {
  prevId?: string
  nextId?: string
}

export const page = derived<[Writable<Epub>, Readable<Route>], PageWithNav | undefined>(
  [book, route],
  ([$book, $route]) => {
    if (!$book || !$route.page) {
      return undefined
    } else {
      const tocItem = $book.toc.find(d => d.id === $route.page)
      if (!tocItem) {
        goTo({ book: $book.fileName })
        return undefined
      }
      return {
        ...getPageByPath(tocItem.path, $book.pages),
        prevId: tocItem.prevId,
        nextId: tocItem.nextId,
      }
    }
  }
)
