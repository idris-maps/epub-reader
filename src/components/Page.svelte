<script lang="ts">
  import { page, book } from '../utils/book'
  import { goTo } from '../utils/routing'
</script>

{#if $page}
  {@html $page.file}
  {#if $page.prevId}
    <button
      on:click={() => goTo({ book: $book.fileName, page: $page.prevId })}
    >Prev</button>
  {/if}
  {#if $page.nextId}
    <button
      on:click={() => goTo({ book: $book.fileName, page: $page.nextId })}
    >Next</button>
  {/if}
{/if}
