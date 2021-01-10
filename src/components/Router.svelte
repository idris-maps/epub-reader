<script>
  import { book, page } from '../utils/book'
  import { route } from '../utils/routing'
  import Drop from './Drop.svelte'
  import Book from './Book.svelte'
  import Page from './Page.svelte'
  import Header from './Header.svelte'
  import Error from './Error.svelte'
  import GoToTop from './GoToTop.svelte'
  import BookList from './BookList.svelte'
  import Info from './Info.svelte'
</script>

{#if $route.book && $book && $page}
  <Book page={$page}/>
  <main>
    <Page />
  </main>
{:else if $route.book && $book}
  <Book />
{:else if $route.error}
  <Header />
  <main>
    <Error id={$route.error} />
  </main>
{:else}
  <Header />
  <main>
    <Drop />
    <BookList />
    <Info />
  </main>
{/if}
<GoToTop />