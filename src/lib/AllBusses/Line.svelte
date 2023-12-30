<script lang="ts">
  import { getLine } from "../tfl"

  export let lineId: string

  let origin: string
  let destination: string
</script>

<table class="w-full text-sm">
  <tbody>
    {#await getLine(lineId)}
      <tr>
        <th>From</th>
        <td>Loading</td>
      </tr>
      <tr>
        <th>To</th>
        <td>Loading</td>
      </tr>
    {:then [origin, destination]}
      <tr>
        <th>From</th>
        <td>{origin}</td>
      </tr>
      <tr>
        <th>To</th>
        <td>{destination}</td>
      </tr>
    {:catch err}
      <tr>
        <th>From</th>
        <td>-</td>
      </tr>
      <tr>
        <th>To</th>
        <td>-</td>
      </tr>
    {/await}
  </tbody>
</table>

<style lang="postcss">
  table {
    overflow: hidden;
    table-layout: fixed;
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
