import { setItem, getItem, removeItem } from 'localforage'
import type { Epub } from './parseEpub'

const listName = 'bookList'

export interface Book {
  author: string
  fileName: string
  title: string
}

const getList = async () => {
  return (await getItem<Book[]>(listName) || [])
    .sort((a, b) => a.title > b.title ? 1 : -1)
}

const addToList = async (book: Book) => {
  const prev = await getList()
  const prevFiles = prev.map(d => d.fileName)
  if (!prevFiles.includes(book.fileName)) {
    const next = [...prev, book]
    await setItem<Book[]>(listName, next)
    return next
  }
  return prev
}

const addBook = async (epub: Epub) => {
  const { author, title, fileName } = epub
  await Promise.all([
    addToList({ author, title, fileName }),
    setItem(epub.fileName, epub),
  ])
}

const getBook = async (fileName: string): Promise<Epub | undefined> => {
  return await getItem<Epub>(fileName)
}

const deleteBook = async (fileName: string) => {
  const list = await getList()
  const nextList = list.filter(d => d.fileName !== fileName)
  await Promise.all([
    removeItem(fileName),
    setItem(listName, nextList),
  ])
  return nextList
}

export default {
  addBook,
  deleteBook,
  getBook,
  getList,
}
