<script lang="ts">
  import { slide } from 'svelte/transition'
  import ExpandedIcon from '@svelte-parts/icons/feather/chevron-down'
  import NotExpandedIcon from '@svelte-parts/icons/feather/chevron-right'
  import { book } from '../utils/book'
  import type { Page } from '../utils/parseEpub/getPages'

  export let p: Page
  export let closeChapters: () => void

  let expanded = false

  const linkPage = (page: string) =>
    `/?book=${$book.fileName}&page=${page}`
</script>

<div class="container">
  {#if p.children && p.children.length > 0}
    <div class="title">
      <span
        class="title-expand"
        tabindex={0}
        on:keydown={e => { if (e.key === 'Enter') { expanded = !expanded } }}
        on:click={() => expanded = !expanded}
      >
        {#if expanded}
          <ExpandedIcon />
        {:else}
          <NotExpandedIcon />
        {/if}
      </span>
      <a
        href={linkPage(p.id)}
        on:click={() => closeChapters()}
        class="title-label"
      >
        {p.label}
      </a>
    </div>
    {#if expanded}
      {#each p.children as child}
        <div transition:slide>
          <svelte:self p={child} closeChapters={closeChapters} />
        </div>
      {/each}
    {/if}
  {:else}
    <div class="title">
      <span class="title-expand"></span>
      <a
        href={linkPage(p.id)}
        on:click={() => closeChapters()}
        class="title-label"
      >
        {p.label}
      </a>
    </div>
  {/if}
</div>

<style>
  .container {
    margin-left: 1em;
  }
  .title-expand {
    display: inline-block;
    width: 1em;
  }
</style>