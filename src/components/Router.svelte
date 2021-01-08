<script lang="ts">
  import { query } from 'svelte-micro'
  import { parseQuery } from '../utils/routing'
  import Drop from './Drop.svelte'

  $: q = parseQuery($query)
</script>

{#if Boolean(q.book) && Boolean(q.page)}
  <p>TODO - book: {q.book} - page: {q.page}</p>
{:else if Boolean(q.book)}
  <p>TODO - book: {q.book}</p>
{:else if Boolean(q.error)}
  <p>TODO - error: {q.error}</p>
{:else}
  <Drop />
{/if}
