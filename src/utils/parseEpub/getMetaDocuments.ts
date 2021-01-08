const getContentFileFromMeta = (meta: Document) => {
  const rootfile = meta.getElementsByTagName('rootfile')[0]
  if (!rootfile) {
    throw new Error('Could not find rootfile in "META-INF/container.xml"')
  }

  const path = rootfile.getAttribute('full-path')
  if (!path) {
    throw new Error('Could not find "full-path" in "META-INF/container.xml"')
  }

  return path
}

export const getPathToFile = (fileName: string) =>
  fileName
    .split('/')
    .filter((_, i, arr) => i !== arr.length - 1)

const getNcxFileFromContent = (contentFileName: string, xml: Document) => {
  const manifest = xml.getElementsByTagName('manifest')[0]
  if (!manifest) {
    throw new Error(`Could not find manifest in ${contentFileName}`)
  }

  const items = Array.from(manifest.getElementsByTagName('item'))
  const hrefs = items.map(item => item.getAttribute('href'))
  const ncxFile = hrefs.find(d => d?.endsWith('.ncx'))
  if (!ncxFile) {
    throw new Error(`Could not find .ncx file in ${contentFileName} manifest`)
  }

  const pathToContent = getPathToFile(contentFileName)
  return [...pathToContent, ncxFile].join('/')
}

export interface MetaDocument {
  fileName: string
  doc: Document
}

interface MetaDocuments {
  content: MetaDocument
  ncx: MetaDocument
}

export default async (
  getXml: (file: string) => Promise<Document>,
): Promise<MetaDocuments> => {
  const meta = await getXml('META-INF/container.xml')
  const contentFileName = getContentFileFromMeta(meta)
  const contentDoc = await getXml(contentFileName)
  const ncxFileName = getNcxFileFromContent(contentFileName, contentDoc)
  const ncxDoc = await getXml(ncxFileName)

  return {
    content: { fileName: contentFileName, doc: contentDoc },
    ncx: { fileName: ncxFileName, doc: ncxDoc }
  }
}
