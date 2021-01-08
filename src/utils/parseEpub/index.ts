import JSZip from 'jszip'
import xmlParser from './xmlParser'
import imgParser from './imgParser'
import getMetaDocuments from './getMetaDocuments'
import getPages from './getPages'
import generateToc from './generateToc'
import type { Page as _Page } from './getPages'
import type { TocItem as _TocItem } from './generateToc'


export type Page = _Page
export type TocItem = _TocItem
export interface Epub {
  author: string
  fileName: string
  pages: Page[]
  title: string
  toc: TocItem[]
}

export default async (file: File): Promise<Epub> => {
  const folder = await JSZip.loadAsync(file)
  const getXml = xmlParser(folder)
  const getImg = imgParser(folder)

  const { content, ncx } = await getMetaDocuments(getXml)

  const author = content.doc.getElementsByTagName('dc:creator')[0]?.textContent || 'Unknown author'
  const title = content.doc.getElementsByTagName('dc:title')[0]?.textContent || 'Unknown title'
  const pages = await getPages(getXml, getImg, ncx)
  const toc = await generateToc(pages)

  return {
    author,
    fileName: file.name,
    pages,
    title,
    toc,
  }
}
