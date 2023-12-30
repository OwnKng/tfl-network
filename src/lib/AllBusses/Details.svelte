<script lang="ts">
  import Line from "./Line.svelte"
  import { scaleLinear } from "d3-scale"
  import { max } from "d3-array"
  import { fly } from "svelte/transition"
  import { createEventDispatcher, afterUpdate } from "svelte"
  import { getCentralityScore } from "../filtering"

  export let lineId: string
  export let edges: { source: string; target: string; value: number }[] = []

  $: ordered = edges.slice().sort((a, b) => b.value - a.value)

  let w = 0

  $: xScale = scaleLinear()
    .domain([0, max(ordered, (d) => d.value) ?? 0])
    .range([0, w])

  const dispatch = createEventDispatcher()

  let graphContainer: HTMLDivElement

  afterUpdate(() => {
    graphContainer.scrollTo({ top: 0 })
  })
</script>

<div class="flex flex-col gap-2 h-map">
  <Line {lineId} />
  <div class="flex flex-col gap-2 rounded py-1 row-span-1">
    <h3 class="text-white">Connectivity</h3>
    <p>{getCentralityScore(lineId)}</p>
  </div>
  <div class="flex flex-col gap-2 row-span-4">
    <h4 class="text-sm">Shared stops per route</h4>
    <div class="w-full h-full relative">
      <div
        class="absolute w-full left-0 h-8 bottom-0 w-full bg-gradient-to-t from-midnight-75 z-40"
      />
      <div
        class="w-full h-graph overflow-y-auto"
        bind:clientWidth={w}
        bind:this={graphContainer}
      >
        <div class="w-full flex flex-col gap-[2px] Chart">
          {#each ordered as node, index (Math.random())}
            <button
              on:click={() => dispatch("click", { node: node.target })}
              in:fly={{ duration: 250, y: 20, delay: index * 50 }}
              class="px-1 relative w-full flex items-center justify-between overflow-hidden group"
              style="height: 30px;"
            >
              <div
                class="absolute left-0 top-0 bottom-0 shadow bg-midnight-50 z-10 rounded transition-all group-hover:bg-midnight-25"
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

<style>
  .Chart {
    font-family: Source Code Pro;
  }
</style>
