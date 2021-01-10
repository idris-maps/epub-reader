<script lang="ts">
  import ArrowIcon from '@svelte-parts/icons/feather/arrow-up'

  let scrollY = 0
  let innerHeight = 0
  $: show = scrollY > innerHeight
</script>

<svelte:window
  bind:scrollY={scrollY}
  bind:innerHeight={innerHeight}
></svelte:window>

{#if show}
<div class="go-to-top">
  <button on:click={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
    <ArrowIcon />
  </button>
</div>
{/if}
