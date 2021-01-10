<script lang="ts">
  import { slide } from 'svelte/transition'
  import ChaptersIcon from '@svelte-parts/icons/feather/list'
  import CloseChaptersIcon from '@svelte-parts/icons/feather/x'
  import BookIcon from '@svelte-parts/icons/feather/book-open'
  import Toc from './Toc.svelte'
  import { book } from '../utils/book'
  import type { Page } from '../utils/parseEpub/getPages'

  export let page: Page = null

  $: title = $book?.title
  $: author = $book?.author
  $: pages = $book?.pages

  let expanded = false
</script>

<header class="book-header">
  <div class="book-header-icon">
    <button on:click={() => expanded = !expanded}>
      {#if expanded}
        <CloseChaptersIcon />
      {:else}
        <ChaptersIcon />
      {/if}
    </button>
  </div>
  <div class="book-header-title">
    {#if page}
      <p>{title} ({author})</p>
      <h1>{page.label}</h1>
    {:else}
      <p>{author}</p>
      <h1>{title}</h1>
    {/if}
  </div>
</header>
{#if expanded}
  <div class="toc" transition:slide>
    {#each (pages || []) as p}
      <Toc p={p} closeChapters={() => expanded = false}/>
    {/each}
  </div>
  <div class="back">
    <a href="/">
      <span>
        <BookIcon />
      </span>
      Open another book
    </a>
  </div>
{/if}