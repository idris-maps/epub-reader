import type JSZip from 'jszip'

const parseXml = (xml: string) => {
  if (!window || !window.DOMParser) {
    throw new Error('No window.DOMParser')
  }
  const parser = new window.DOMParser()
  return parser.parseFromString(xml, 'text/xml')
}

export default (folder: JSZip) =>
  async (file: string) => {
    const f = folder.file(file)
    if (!f) {
      throw new Error(`Could not open file ${file}`)
    }
    return parseXml(await f.async('text'))
  }
