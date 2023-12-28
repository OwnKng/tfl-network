<script lang="ts">
  import { onMount } from "svelte"
  import { getLine } from "../tfl"

  export let lineId: string

  let origin: string
  let destination: string
  let loading = false
  let err = false

  async function getStartEnd(id: string) {
    loading = true
    try {
      const route = await getLine(id)
      origin = route[0]
      destination = route[1]
    } catch (e) {
      err = true
    } finally {
      loading = false
    }
  }

  $: {
    getStartEnd(lineId)
  }
</script>

<table class="w-full text-sm">
  <tbody>
    <tr>
      <th>Origin</th>
      <td>
        {#if loading}
          <span class="pulse">loading...</span>
        {:else if origin}
          {origin}
        {:else if err}
          -
        {/if}
      </td>
    </tr>
    <tr>
      <th>Destination</th>
      <td>
        {#if loading}
          <span class="pulse">loading...</span>
        {:else if destination}
          {destination}
        {:else if err}
          -
        {/if}
      </td>
    </tr>
    <tr>
      <th># stops</th>
      <td>-</td>
    </tr>
  </tbody>
</table>

<style lang="postcss">
  table {
    overflow: hidden;
  }

  th {
    text-align: left;
    font-weight: 400;
    padding-right: 1rem;
  }

  td {
    text-align: right;
    white-space: nowrap;
  }

  tr {
    border-bottom: 1px solid var(--colors-midnight-25);
  }
</style>
