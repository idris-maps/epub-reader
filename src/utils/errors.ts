export interface ErrorMsg {
  code: number
  label: string
}

export const errorCode = {
  notEpub: 1,
  noParse: 2,
}

const errorMsgs: ErrorMsg[] = [
  { code: errorCode.notEpub, label: 'The file is not an epub book' },
  { code: errorCode.noParse, label: 'Could not read the book' }
]

export const getErrorMessage = (code: string) => {
  const msg = errorMsgs.find(d => d.code === Number(code))
  return msg ? msg.label : 'Unknown error'
}
