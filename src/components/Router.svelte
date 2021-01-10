<script>
  import { book, page } from '../utils/book'
  import { route } from '../utils/routing'
  import Drop from './Drop.svelte'
  import Book from './Book.svelte'
  import Page from './Page.svelte'

</script>

{#if $book && $page}
  <Book page={$page}/>
  <main>
    <Page />
  </main>
{:else if $book}
  <Book />
{:else if $route.error}
  <p>error: {$route.error}</p>
{:else}
  <main>
    <Drop />
  </main>
{/if}
