<script lang="ts">
  import PrevIcon from '@svelte-parts/icons/feather/arrow-left'
  import NextIcon from '@svelte-parts/icons/feather/arrow-right'
  import { page, book } from '../utils/book'
  import { goTo } from '../utils/routing'

  let ctrlIsDown = false;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Control') { ctrlIsDown = true }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Control') { ctrlIsDown = false }
    if (ctrlIsDown) {
      if (e.key === 'ArrowLeft' && $page.prevId) {
        goTo({ page: $page.prevId, book: $book.fileName })
      }
      if (e.key === 'ArrowRight' && $page.nextId) {
        goTo({ page: $page.nextId, book: $book.fileName })
      }
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

{#if $page}
  <div class="page">
    {@html $page.file}
  </div>
  <div class="navigation">
    {#if $page.prevId}
      <a
        href={`/?book=${$book.fileName}&page=${$page.prevId}`}
        title="Previous page"
        class="navigation-prev"
      >
        <PrevIcon />
      </a>
    {:else}
      <div/>
    {/if}
    {#if $page.nextId}
      <a
        href={`/?book=${$book.fileName}&page=${$page.nextId}`}
        title="Next page"
        class="navigation-next"
      >
        <NextIcon />
      </a>
    {/if}
  </div>
{/if}
