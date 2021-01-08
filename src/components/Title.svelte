<script lang="ts">
  import { onMount } from 'svelte'
  import { book } from '../utils/book'
  import { goTo } from '../utils/routing'

  $: title = $book?.title
  $: author = $book?.author

  onMount(() => {
    if (!title) {
      goTo({})
    }
  })
</script>

<h1>{title}</h1>
<h2>{author}</h2>