<script lang="ts">
  export let left = 0
  export let top = 0
  export let offsetX = 10
  export let offsetY = 10
  import { fade } from "svelte/transition"
  import { getEdges } from "../filtering"
  import { getLine } from "../tfl"

  export let node: { id: string; connections: number }[] = []

  $: id = node[0].id

  $: edges = getEdges(id, 5)
</script>

<div
  transition:fade
  class="Tooltip absolute top-full left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white text-slate-900 text-xs shadow border rounded-sm py-2"
  style="top: {top}px; left: {left - offsetX}px;"
>
  <div class="flex flex-col divide-y">
    <div class="px-1">
      <h2 class="font-bold text-sm">{id}</h2>
    </div>
    <div class="px-1">
      {#await getLine(id)}
        <p>Loading...</p>
      {:then [start, stop]}
        <div class="flex flex-col">
          <span>{start} -</span>
          <span>{stop}</span>
        </div>
      {:catch error}
        -
      {/await}
    </div>
    <div class="px-1">
      <h3 class="font-bold">Most shared stops</h3>
      <div class="flex gap-1 flex-wrap">
        {#each edges as edge}
          <span class="text-xs bg-primary px-1 py-1 rounded-sm shadow"
            >{edge}</span
          >
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .Tooltip {
    pointer-events: none;
    width: 100%;
    max-width: 180px;
  }
</style>
