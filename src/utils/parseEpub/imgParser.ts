import type JSZip from 'jszip'

const getExtension = (file: string) => {
  const parts = file.split('.')
  return parts[parts.length - 1]
}

const findFile = (folder: JSZip, file: string) => {
  const f0 = folder.file(file)
  if (f0) { return f0 }
  
  const [first, ...path] = file.split('/')
  const shortPath = path.join('/')
  const found = Object.keys(folder.files).find((d) => d.endsWith(shortPath))
  if (found) {
    return folder.file(found)
  }
  return null
}

export default (folder: JSZip) =>
  async (file: string) => {
    const ext = getExtension(file)

    const f = findFile(folder, file)
    if (!f) { return '' }

    const b64 = await f.async('base64')
    return `data:image/${ext};base64,${b64}`
  }
