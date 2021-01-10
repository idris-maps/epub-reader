import { getPathToFile } from './getMetaDocuments'
import type { MetaDocument } from './getMetaDocuments'

export interface Page {
  file: string
  id: string
  playOrder: number
  label: string
  children?: Page[]
}

const fixImages = (doc: Document, getImg: (d: string) => Promise<string>) =>
  Promise.all(
    Array.from(doc.getElementsByTagName('img'))
      .map(async img => {
        const imgFile = await getImg(img.getAttribute('src') || '')
        img.setAttribute('src', imgFile)
      })
  )

interface PathInfo {
  hash: string
  fileName: string
  extension: string
  fileId: string
  path: string
}

const getPath = (link: string): PathInfo => {
  const [pathWithHash, maybeHash] = link.split('#')
  const [fileName, ...reversedPath] = pathWithHash.split('/').reverse()
  const [fileId, extension] = fileName.split('.')
  const path = reversedPath.reverse().join('/')
  return {
    hash: maybeHash ? `#${maybeHash}` : '',
    fileName,
    extension,
    fileId,
    path,
  }
}

const isInternalLink = (href: string) =>
  href.startsWith(window.location.origin)

const fixLinks = (doc: Document, bookId: string, currentFile: string) =>
  Array.from(doc.getElementsByTagName('a'))
    .map(a => {
      if (isInternalLink(a.href)) {
        const { fileId, hash } = getPath(a.href)
        const { path } = getPath(currentFile)
        const pageId = path === '' ? fileId : `${path}/${fileId}`
        a.href = `/?book=${bookId}&page=${pageId}${hash}`
      }
    })

const getPage = async (
  path: string[],
  getXml: (d: string) => Promise<Document>,
  getImg: (d: string) => Promise<string>,
  bookId: string,
  el: Element,
): Promise<Page> => {
  const navLabel = el.getElementsByTagName('navLabel')[0]
  const label = navLabel
    ? navLabel.getElementsByTagName('text')[0]?.textContent
    : undefined
  const navPoints = Array.from(el.children).filter(d => d.tagName === 'navPoint')
  const playOrder = Number(el.getAttribute('playOrder'))
  const fileName = el.getElementsByTagName('content')[0]?.getAttribute('src')
  const { hash } = getPath(fileName)
  const [pathToFile] = fileName.split('.xhtml')
  const id = `${pathToFile}${hash}`

  if (!label || !fileName || !fileName.includes('.xhtml') || !playOrder) {
    throw new Error(`Invalid TOC ${JSON.stringify({ label, fileName, playOrder })}`)
  }

  const filePath = [...path, `${fileName.split('.xhtml')[0]}.xhtml`].join('/')
  const fileContent = await getXml(filePath)
  await fixImages(fileContent, getImg)
  fixLinks(fileContent, bookId, fileName)

  const file = fileContent.getElementsByTagName('body')[0]?.innerHTML
  const data = { label, file, id, playOrder }
  if (navPoints.length === 0) { return data }

  return {
    ...data,
    children: await Promise.all(
      navPoints.map(d =>
        getPage(path, getXml, getImg, bookId, d)
      )
    ),
  }
}

export default async (
  getXml: (d: string) => Promise<Document>,
  getImg: (file: string) => Promise<string>,
  ncx: MetaDocument,
  bookId: string,
): Promise<Page[]> => {
  const navMap = ncx.doc.getElementsByTagName('navMap')[0]
  if (!navMap) {
    throw new Error(`Could not find navMap in ${ncx.fileName}`)
  }

  const pathToNcx = getPathToFile(ncx.fileName)
  return await Promise.all(
    Array.from(navMap.children).map(d =>
      getPage(pathToNcx, getXml, getImg, bookId, d)
    )
  )
}
