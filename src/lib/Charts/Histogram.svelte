<script lang="ts">
  import Chart from "../primatives/Chart.svelte"
  import { scaleLinear } from "d3-scale"
  import { max, bin, sum } from "d3-array"
  import AxisBottom from "../primatives/AxisBottom.svelte"
  import Axis from "../primatives/Axis.svelte"
  import Grid from "../primatives/Grid.svelte"
  import Gradient from "../primatives/Gradient.svelte"
  import { draw, fly, slide, fade } from "svelte/transition"

  export let data: any[] = []
  export let x: string
  export let percent: boolean = true
  export let xFormat = (d: any) => d
  export let yFormat = (d: any) => d
  export let selected: string | null = null
  export let label = "id"
  export let gradientColors = ["#f87171", "#ef4444"]

  const gradientId = crypto.randomUUID()

  let w = 0
  let h = 0

  const margins = {
    top: 0,
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

  $: yScale = scaleLinear([0, 0.22], [dimensions.innerHeight, 0]).nice()

  // Interaction
  $: selectedX = selected ? getX(data.find((d) => getLabel(d) === selected)) : 0
</script>

<div class="w-full h-full relative" bind:clientHeight={h} bind:clientWidth={w}>
  {#if w > 100}
    <Chart {dimensions}>
      <defs>
        <Gradient id={gradientId} colors={gradientColors} y2="0" x2="100%" />
      </defs>
      <Grid orientation="y" scale={yScale} />
      {#each bins as bin}
        <rect
          x={xScale(bin.x0)}
          y={yScale(bin.length / yMax)}
          width={xScale(bin.x1) - xScale(bin.x0)}
          height={dimensions.innerHeight - yScale(bin.length / yMax)}
          stroke="var(--colors-midnight)"
          class="transition-all"
          style="fill: url(#{gradientId})"
        />
      {/each}
      <AxisBottom scale={xScale} formatTick={xFormat} />
      <Axis
        orientation="left"
        scale={yScale}
        hideAxisLine
        hideTicks
        formatTick={yFormat}
        left={15}
        bottom={-5}
      />
    </Chart>
    <div
      class="absolute Tooltip"
      transition:slide={{ duration: 150 }}
      style="left: {xScale(selectedX) +
        margins.left}px; height: {dimensions.innerHeight}px; top: {margins.top}px; opacity: {selected
        ? 1
        : 0};"
    />
  {/if}
</div>

<style>
  .Tooltip {
    transition: all 250ms ease-in-out;
    pointer-events: none;
    width: 1px;
    background: var(--colors-white);
  }
</style>
