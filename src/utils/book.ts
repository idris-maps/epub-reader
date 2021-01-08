import { writable } from 'svelte/store'
import type { Epub } from './parseEpub'

export const book = writable<Epub | undefined>(undefined)
