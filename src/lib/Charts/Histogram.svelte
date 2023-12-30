<script lang="ts">
  import Chart from "../primatives/Chart.svelte"
  import { scaleLinear } from "d3-scale"
  import { max, bin, sum } from "d3-array"
  import AxisBottom from "../primatives/AxisBottom.svelte"
  import Gradient from "../primatives/Gradient.svelte"
  import { slide } from "svelte/transition"

  export let data: any[] = []
  export let x: string
  export let percent: boolean = true
  export let xFormat = (d: any) => d
  export let yFormat = (d: any) => d
  export let selected: string | null = null
  export let label = "id"
  export let title = ""

  export let gradientColors = [
    "var(--colors-midnight-25)",
    "var(--colors-midnight-50)",
  ]
  const gradientId = crypto.randomUUID()

  let w = 0
  let h = 0

  const margins = {
    top: 5,
    right: 10,
    bottom: 30,
    left: 10,
  }

  $: dimensions = {
    width: w,
    height: h,
    margins: margins,
    innerHeight: h - margins.top - margins.bottom,
    innerWidth: w - margins.left - margins.right,
  }

  $: getX = (d: any) => d[x]
  $: getLabel = (d: any) => d[label]

  $: xScale = scaleLinear([0, max(data, getX)], [0, dimensions.innerWidth])
    .nice()
    .clamp(true)

  $: bins = bin().value(getX).thresholds(20)(data)

  $: yMax = percent ? sum(bins.map((bin) => bin.length)) : 1

  $: yScale = scaleLinear(
    [
      0,
      percent
        ? max(bins.map((bin) => bin.length)) /
          sum(bins.map((bin) => bin.length))
        : yMax,
    ],
    [dimensions.innerHeight, 0]
  ).nice()

  // Interaction
  $: selectedX = selected ? getX(data.find((d) => getLabel(d) === selected)) : 0
</script>

<div class="w-full h-full flex flex-col gap-1">
  <div class="flex justify-between items-center w-full text-sm font-bold">
    <h4 style="margin-left: {dimensions.margins.left}px;">
      {title}
    </h4>
    <span
      class="bg-midnight-50 text-primary rounded px-2 text-xs py-1 shadow-sm border border-midnight-25"
    >
      {xFormat(selectedX)}</span
    >
  </div>
  <div
    class="w-full h-full grow relative"
    bind:clientHeight={h}
    bind:clientWidth={w}
  >
    {#if w > 100}
      <Chart {dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} y2="100%" x2="0" />
        </defs>
        {#each bins as bin}
          <rect
            x={xScale(bin.x0)}
            y={yScale(bin.length / yMax)}
            width={xScale(bin.x1) - xScale(bin.x0)}
            height={dimensions.innerHeight - yScale(bin.length / yMax)}
            stroke-width="1"
            class="transition-all stroke-slate-600"
            style="fill: url(#{gradientId})"
          />
        {/each}
        <AxisBottom scale={xScale} formatTick={xFormat} />
      </Chart>
      <div
        class="absolute Tooltip bg-primary shadow"
        transition:slide={{ duration: 150 }}
        style="left: {xScale(selectedX) +
          margins.left}px; height: {dimensions.innerHeight}px; top: {margins.top}px; opacity: {selected
          ? 1
          : 0};"
      />
    {/if}
  </div>
</div>

<style>
  .Tooltip {
    transition: all 250ms ease-in-out;
    pointer-events: none;
    width: 2px;
  }
</style>
