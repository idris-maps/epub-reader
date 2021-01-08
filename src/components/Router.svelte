<script lang="ts">
  import { query } from 'svelte-micro'
  import { parseQuery } from '../utils/routing'
  import Drop from './Drop.svelte'
  import Title from './Title.svelte'
  import Page from './Page.svelte'

  $: q = parseQuery($query)
</script>

<p>{JSON.stringify(q)}</p>

{#if Boolean(q.book) && Boolean(q.page)}
  <Title />
  <Page id={q.page} />
  <p>TODO - book: {q.book} - page: {q.page}</p>
{:else if Boolean(q.book)}
  <Title />
  <p>TODO - book: {q.book}</p>
{:else if Boolean(q.error)}
  <p>TODO - error: {q.error}</p>
{:else}
  <Drop />
{/if}
