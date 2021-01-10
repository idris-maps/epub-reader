import type { Page } from './getPages'

export interface TocItem {
  id: string
  label: string
  path: number[]
  playOrder: number
  prevId?: string
  nextId?: string
}

export type Toc = TocItem[]

const flatten = <T>(d: T[][]): T[] => d.reduce((r, d) => [...r, ...d], [])

interface PageWithPath extends Page {
  path: number[]
}

const flattenHierarchies = (hierarchy: Page[], path: number[]): PageWithPath[] =>
  flatten(
    hierarchy
      .map((d, i) =>
        d.children
          ? [{ ...d, path: [...path, i] }, ...flattenHierarchies(d.children, [...path, i])]
          : [{ ...d, path: [...path, i] }]
      )
  )

const hierarchyToTocItem = (d: PageWithPath): TocItem => ({
  id: d.id,
  label: d.label,
  path: d.path,
  playOrder: d.playOrder,
})

const findNextPageId = (current: TocItem, items: TocItem[], r = false) => {
  const toc = r
    ? items.sort((a, b) => a.playOrder < b.playOrder ? 1 : -1)
    : items.sort((a, b) => a.playOrder > b.playOrder ? 1 : -1)
  const after = toc.reduce(
    ([isAfter, next], d) => {
      if (d.id === current.id) { return [true, null] }
      if (isAfter && !Boolean(next)) {
        const [noHashId] = d.id.split('#')
        const [noHashCurrent] = current.id.split('#')
        if (noHashId !== noHashCurrent) {
          return [true, noHashId]
        }
      }
      return [isAfter, next] 
    },
    [false, null],
  )
  return after[1] ? String(after[1]) : undefined;
}

const addPrevNext = (toc: TocItem[]) =>
  (d: TocItem): TocItem => ({
    ...d,
    nextId: findNextPageId(d, toc),
    prevId: findNextPageId(d, toc, true),
  })

export default (pages: Page[]) => {
  const toc = flattenHierarchies(pages, [])
    .map(hierarchyToTocItem)
    .sort((a, b) => a.playOrder > b.playOrder ? 1 : -1)
  return toc.map(addPrevNext(toc))
}
