<script>
  import { route } from '../utils/routing'
  import Drop from './Drop.svelte'
  import Title from './Title.svelte'
  import Page from './Page.svelte'

  $: book = $route.book
  $: page = $route.page
  $: error = $route.error
</script>

{#if book && page}
  <Title />
  <Page />
{:else if book}
  <Title />
{:else if error}
  <p>error: {error}</p>
{:else}
  <Drop />
{/if}
