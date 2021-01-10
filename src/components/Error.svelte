<script lang="ts">
  import { getErrorMessage } from '../utils/errors'

  export let id: string
</script>

<div class="error-page">
  <h2>Error reading your file</h2>
  <p>{getErrorMessage(id)}</p>
  <a href="/">
    <button>Try with another file</button>
  </a>
</div>