<script lang="ts">
  import Drop from '@svelte-parts/drop-file'
  import parseEpub from '../utils/parseEpub'
  import { goTo } from '../utils/routing'
  import { book } from '../utils/book'

  const isEpub = (d: File) => d.type === 'application/epub+zip'
  const onDrop = (files: File[]) => {
    const file = files.find(isEpub)

    if (file) {
      parseEpub(file)
        .then(epub => {
          console.log({ epub })
          book.set(epub)
          goTo({ book: epub.fileName, page: epub.toc[1].id })
        })
        .catch((err) => {
          console.log({ err })
          // TODO handle error
        })
    }

    // TODO handle no file
  }
</script>

<Drop onDrop={onDrop} />
