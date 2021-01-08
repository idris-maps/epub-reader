import { getPathToFile } from './getMetaDocuments'
import type { MetaDocument } from './getMetaDocuments'

export interface Page {
  file: string
  id: string
  playOrder: number
  label: string
  children?: Page[]
}

const getPage = async (
  path: string[],
  getXml: (d: string) => Promise<Document>,
  getImg: (d: string) => Promise<string>,
  el: Element,
): Promise<Page> => {
  const navLabel = el.getElementsByTagName('navLabel')[0]
  const label = navLabel
    ? navLabel.getElementsByTagName('text')[0]?.textContent
    : undefined
  const navPoints = Array.from(el.children).filter(d => d.tagName === 'navPoint')
  const playOrder = Number(el.getAttribute('playOrder'))
  const id = el.getAttribute('id')
  const fileName = el.getElementsByTagName('content')[0]?.getAttribute('src')

  if (!label || !fileName || !fileName.includes('.xhtml') || !id || !playOrder) {
    throw new Error(`Invalid TOC ${JSON.stringify({ label, fileName, id, playOrder })}`)
  }

  const filePath = [...path, `${fileName.split('.xhtml')[0]}.xhtml`].join('/')
  const fileContent = await getXml(filePath)
  const images = Array.from(fileContent.getElementsByTagName('img'))

  await Promise.all(images.map(async img => {
    const imgFile = await getImg(img.getAttribute('src') || '')
    img.setAttribute('src', imgFile)
  }))

  const file = fileContent.getElementsByTagName('body')[0]?.innerHTML
  const data = { label, file, id, playOrder }
  if (navPoints.length === 0) { return data }

  return {
    ...data,
    children: await Promise.all(
      navPoints.map(d =>
        getPage(path, getXml, getImg, d)
      )
    ),
  }
}

export default async (
  getXml: (d: string) => Promise<Document>,
  getImg: (file: string) => Promise<string>,
  ncx: MetaDocument
): Promise<Page[]> => {
  const navMap = ncx.doc.getElementsByTagName('navMap')[0]
  if (!navMap) {
    throw new Error(`Could not find navMap in ${ncx.fileName}`)
  }

  const pathToNcx = getPathToFile(ncx.fileName)
  return await Promise.all(
    Array.from(navMap.children).map(d =>
      getPage(pathToNcx, getXml, getImg, d)
    )
  )
}
