<script lang="ts">
  import PrevIcon from '@svelte-parts/icons/feather/arrow-left'
  import NextIcon from '@svelte-parts/icons/feather/arrow-right'
  import { page, book } from '../utils/book'
</script>

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
