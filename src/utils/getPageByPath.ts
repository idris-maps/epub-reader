import type { Page } from './parseEpub/getPages'

const getPageByPath = (path: number[], pages: Page[]): Page | undefined => {
  const [index, ...rest] = path
  const page = pages[index]
  if (!page) { return undefined }
  if (rest.length === 0) { return page }
  if (!page.children) { return undefined }
  return getPageByPath(rest, page.children)
} 

export default getPageByPath
