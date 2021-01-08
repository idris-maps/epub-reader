<script lang="ts">
  import { onMount } from 'svelte'
  import { book } from '../utils/book'
  import { goTo } from '../utils/routing'
  import getPageByPath from '../utils/getPageByPath'

  export let id: string

  $: fileName = $book.fileName
  $: toc = $book?.toc
  $: pages = $book?.pages
  $: pageMeta = toc.find((d) => d.id === id)
  $: page = getPageByPath(
    pageMeta?.path || [],
    pages || []
  )

  onMount(() => {
    if (!fileName) { return goTo({}) }
  })
</script>

{@html page?.file}
{#if pageMeta?.prevId}
  <button on:click={() => goTo({ book: fileName, page: pageMeta?.prevId })}>Prev</button>
{/if}
{#if pageMeta?.nextId}
  <button on:click={() => goTo({ book: fileName, page: pageMeta?.nextId })}>Next</button>
{/if}
