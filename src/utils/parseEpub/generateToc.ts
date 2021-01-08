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

const addPrevNext = (toc: TocItem[]) =>
  (d: TocItem, index: number): TocItem => ({
    ...d,
    prevId: toc[index - 1]?.id,
    nextId: toc[index + 1]?.id,
  })

export default (pages: Page[]) => {
  const toc = flattenHierarchies(pages, [])
    .map(hierarchyToTocItem)
    .sort((a, b) => a.playOrder > b.playOrder ? 1 : -1)
  return toc.map(addPrevNext(toc))
}
