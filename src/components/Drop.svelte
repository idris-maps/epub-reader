<script lang="ts">
  import Drop from '@svelte-parts/drop-file'
  import Loader from './Loader.svelte'
  import parseEpub from '../utils/parseEpub'
  import { goTo } from '../utils/routing'
  import { setCurrentBook } from '../utils/book'
  import { errorCode } from '../utils/errors'

  let loading = false

  const isEpub = (d: File) => d.type === 'application/epub+zip'
  const onDrop = (files: File[]) => {
    loading = true
    const file = files.find(isEpub)
    if (file) {
      parseEpub(file)
        .then(epub => {
          console.log({ epub })
          setCurrentBook(epub)
          loading = false
          
        })
        .catch((err) => {
          console.log({ err })
          loading = false
          goTo({ error: String(errorCode.noParse) })
        })
    } else {
      loading = false
      goTo({ error: String(errorCode.notEpub) })
    }
  }
</script>

{#if loading}
  <Loader />
{:else}
  <Drop onDrop={onDrop} />
{/if}
