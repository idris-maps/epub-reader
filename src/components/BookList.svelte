<script lang="ts">
  import XIcon from '@svelte-parts/icons/feather/x'
  import db from '../utils/db'
  import { setCurrentBookByFileName } from '../utils/book'

  const onClick = (fileName: string) =>
    () => setCurrentBookByFileName(fileName)

  const onKeyDown = (fileName: string) =>
    e => {
      if (e.key === 'Enter') { onClick(fileName)() }
    }
  
  const deleteBook = (fileName: string) =>
    () => {
      db.deleteBook(fileName)
        .then(() => window.location.reload(false))
    }
</script>

{#await db.getList()}
  <span />
{:then books}
  {#if books.length > 0}
    <div class="book-list">
      <h2>Previously read</h2>
      {#each books as book}
        <div class="book-list-item">
          <div
            tabIndex={0}
            class="book-label"
            on:click={onClick(book.fileName)}
            on:keydown={onKeyDown(book.fileName)}
          >
            {book.title}
            <span class="book-author"> - {book.author}</span>
          </div>
          <button on:click={deleteBook(book.fileName)}>
            <XIcon /> 
          </button>
        </div>
      {/each}
    </div>
  {/if}
{/await}