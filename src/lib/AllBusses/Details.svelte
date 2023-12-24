<script lang="ts">
  import Line from "./Line.svelte"
  import { scaleLinear } from "d3-scale"
  import { max } from "d3-array"
  import { slide, fly } from "svelte/transition"
  import { createEventDispatcher } from "svelte"

  export let lineId: string
  export let edges: { source: string; target: string; value: number }[] = []

  $: ordered = edges.slice().sort((a, b) => b.value - a.value)

  let w = 0

  $: xScale = scaleLinear()
    .domain([0, max(ordered, (d) => d.value) ?? 0])
    .range([0, w])

  const dispatch = createEventDispatcher()
</script>

<div class="flex flex-col h-full gap-4">
  <Line {lineId} />
  <div
    class="flex flex-col gap-2 border border-zinc-700 rounded py-1 divide-y divide-zinc-700"
  >
    <div class="px-2">
      <h3 class="text-white">Connectivity</h3>
    </div>
    <div class="flex flex-col gap-2">
      <div class="px-2">
        <p class="text-xs">
          <span class="text-white text-lg">
            {edges.length}
          </span>
          connected routes
        </p>
      </div>
      <div>
        <h4 class="text-sm px-2">Shared stops per route</h4>
        <div class="w-full h-[400px] overflow-y-auto" bind:clientWidth={w}>
          <div class="w-full flex flex-col gap-[2px] px-2">
            {#each ordered as node, index (Math.random())}
              <button
                on:click={() => dispatch("click", { node: node.target })}
                in:fly={{ duration: 250, y: 20, delay: index * 50 }}
                class="px-1 relative w-full flex items-center justify-between hover:bg-zinc-800 hover:bg-opacity-20 overflow-hidden"
                style="height: 20px;"
              >
                <div
                  class="absolute left-0 top-0 bottom-0 shadow bg-lightBlack z-10 rounded-sm"
                  style="width: {xScale(node.value)}px;"
                />
                <p class="z-20">
                  {node.target}
                </p>
                <p class="z-20">
                  {node.value}
                </p>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
