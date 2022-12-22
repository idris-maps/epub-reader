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

const normalizedId = (d: TocItem) => d.id.split('#')[0]

const getPrev = (toc: TocItem[], item: TocItem) => {
  const allPrev = toc
    .filter(d => d.playOrder < item.playOrder && normalizedId(d) !== normalizedId(item))
    .sort((a, b) => a.playOrder > b.playOrder ? -1 : 1)

  return allPrev[0] ? allPrev[0].id : undefined
}

const getNext = (toc: TocItem[], item: TocItem) => {
  const allNext = toc
    .filter(d => d.playOrder > item.playOrder && normalizedId(d) !== normalizedId(item))
    .sort((a, b) => a.playOrder > b.playOrder ? 1 : -1)

  return allNext[0] ? allNext[0].id : undefined
}

const addPrevNext = (toc: TocItem[]) =>
  (d: TocItem): TocItem => ({
    ...d,
    nextId: getNext(toc, d),
    prevId: getPrev(toc, d),
  })

export default (pages: Page[]) => {
  const toc = flattenHierarchies(pages, [])
    .map(hierarchyToTocItem)
    .sort((a, b) => a.playOrder > b.playOrder ? 1 : -1)
  return toc.map(addPrevNext(toc))
}
