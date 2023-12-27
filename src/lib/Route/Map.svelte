<script lang="ts">
  import { geoPath, geoMercator } from "d3-geo"
  import Line from "../primatives/Line.svelte"
  import { scaleThreshold } from "d3-scale"
  import { Delaunay } from "d3-delaunay"
  import Tooltip from "../helpers/Tooltip.svelte"

  export let lines: any[]
  export let points: any[]

  export let margins = { top: 20, right: 10, bottom: 20, left: 10 }

  export let bounds: any

  let width = 0
  let height = 0

  $: dimensions = {
    width,
    height,
    margins,
    innerWidth: width - margins.left - margins.right,
    innerHeight: height - margins.top - margins.bottom,
  }

  $: projection = geoMercator().fitSize(
    [dimensions.innerWidth, dimensions.innerHeight],
    bounds
  )

  $: pathGenerator = geoPath(projection)

  $: colorScale = scaleThreshold(
    [2],
    ["var(--colors-gunmetal)", "var(--colors-primary)"]
  )

  // Interaction
  let tooltip = {
    top: 0,
    left: 0,
    data: null,
  }

  $: delaunay = Delaunay.from(
    points.map((d) => [
      projection(d.geometry.coordinates)[0],
      projection(d.geometry.coordinates)[1],
    ])
  )

  function handleMouseOver(mouse: MouseEvent) {
    const x = mouse.offsetX - dimensions.margins.left
    const y = mouse.offsetY - dimensions.margins.top

    const index = delaunay.find(x, y)

    const point = points[index]

    tooltip = {
      top: mouse.offsetY,
      left: mouse.offsetX,
      data: point.properties,
    }
  }
</script>

<div class="w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
  <svg {width} {height}>
    <g transform={`translate(${margins.left}, ${margins.top})`}>
      {#each lines as line, i}
        <Line
          path={pathGenerator(line)}
          color="var(--colors-gunmetal)"
          {i}
          strokeWidth={1}
        />
      {/each}
      {#each points as point}
        <circle
          cx={projection(point.geometry.coordinates)[0]}
          cy={projection(point.geometry.coordinates)[1]}
          r={point.properties.lines.length === 1 ? 3 : 4}
          fill={colorScale(point.properties.lines.length)}
          stroke={tooltip.data?.name === point.properties.name
            ? "var(--colors-white)"
            : "var(--colors-midnight-75)"}
        />
      {/each}
    </g>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <rect
      x="0"
      y="0"
      {width}
      {height}
      fill="transparent"
      on:mousemove={handleMouseOver}
      on:mouseleave={() => (tooltip.data = null)}
    />
  </svg>
  {#if tooltip.data}
    <Tooltip top={tooltip.top} left={tooltip.left}>
      {tooltip.data?.name}
      <div class="flex gap-1">
        {#each tooltip.data.lines as line}
          <span class="bg-primary rounded text-midnight px-2 py-1">{line}</span>
        {/each}
      </div>
    </Tooltip>
  {/if}
</div>
