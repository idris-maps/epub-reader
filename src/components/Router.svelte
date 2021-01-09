<script>
  import { book, page } from '../utils/book'
  import { route } from '../utils/routing'
  import Drop from './Drop.svelte'
  import Title from './Title.svelte'
  import Page from './Page.svelte'

</script>

{#if $book && $page}
  <Title />
  <Page />
{:else if $book}
  <Title />
{:else if $route.error}
  <p>error: {$route.error}</p>
{:else}
  <Drop />
{/if}
