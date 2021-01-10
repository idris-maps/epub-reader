import { derived, writable } from 'svelte/store'
import { route, goTo } from './routing'
import getPageByPath from './getPageByPath'
import db from './db'
import type { Readable, Writable } from 'svelte/store'
import type { Route } from './routing'
import type { Epub, TocItem } from './parseEpub'
import type { Page } from './parseEpub/getPages'

export const book = writable<Epub | undefined>(undefined)

export const setCurrentBook = (epub?: Epub) => {
  book.set(epub)
  if (epub) {
    db.getList()
      .then(list => {
        const exists = list.find(d => epub.fileName === d.fileName)
        if (!exists) { db.addBook(epub) }
      })
    goTo({ book: epub.fileName, page: epub.toc[0].id })
  }
}

export const setCurrentBookByFileName = async (fileName: string) => {
  setCurrentBook(await db.getBook(fileName))
} 

export interface PageWithNav extends Page {
  prevId?: string
  nextId?: string
}

const findTocItem = (id: string, toc: TocItem[]): TocItem | undefined => {
  const exactMatch = toc.find(d => d.id === id)
  if (exactMatch) { return exactMatch }
  const [pageNoHash] = id.split('#')
  return toc.find(d => {
    const [idNoHash] = d.id.split('#')
    return pageNoHash === idNoHash
  })
}

const onBookChange = async (name: string) => {
  const b = await db.getBook(name)
  if (b) {
    book.set(b)
  }
}

export const page = derived<[Writable<Epub>, Readable<Route>], PageWithNav | undefined>(
  [book, route],
  ([$book, $route]) => {
    if (Boolean($route.book) && !$book) {
      onBookChange($route.book)
    }
    if (!$book || !$route.page) {
      return undefined
    } else {
      const tocItem = findTocItem($route.page, $book.toc)
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
