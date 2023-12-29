<script lang="ts">
  import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceX,
    forceY,
    forceCollide,
  } from "d3-force"
  import { scaleSqrt } from "d3-scale"
  import { min, max } from "d3-array"
  import { Delaunay } from "d3-delaunay"
  import { drawSimulation } from "../simulation"
  import Tooltip from "./Tooltip.svelte"

  export let nodes: { id: string; connections: number }[] = []
  export let links: { source: string; target: string; value: number }[] = []

  $: nodeCopy = nodes.map((d) => ({ ...d }))
  $: linkCopy = links.map((d) => ({ ...d }))

  let width = 0
  let height = 0

  let margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  $: dimensions = {
    width: width,
    height: height,
    margins: margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
  }

  $: getId = (d) => d["id"]
  $: getValue = (d) => d["value"]
  $: getConnections = (d) => d["connections"]

  $: radiusScale = scaleSqrt([1, 120], [8, 30])

  $: widthScale = scaleSqrt(
    [min(links.map(getValue)), max(links.map(getValue))],
    [2, 8]
  )

  let canvas: HTMLCanvasElement

  //_ Simulation
  $: simulation = forceSimulation(nodeCopy)
    .force(
      "link",
      forceLink(linkCopy).id((d) => d.id)
    )
    .force("charge", forceManyBody())
    .force(
      "collide",
      forceCollide().radius((d) => radiusScale(d.connections) + 6)
    )
    .force("x", forceX(dimensions.innerWidth / 2))
    .force("y", forceY(dimensions.innerHeight / 2))
    .on("tick", tick)

  let voronoi: any | null = null

  function tick() {
    drawSimulation({
      canvas: canvas,
      nodes: nodeCopy,
      edges: linkCopy,
      nodeRadius: (node) => radiusScale(node.connections),
      edgeWidth: (edge) => widthScale(edge.value),
      edgeColor: (edge) => "rgba(255, 255, 255, 1)",
      nodeStroke: (node) => "#18181b",
      nodeFill: (node) => "#5de4c7",
      nodeLabelColor: () => "#0e0f12",
      nodeLabelFont: () => "14px Source Code Pro",
      showLabels: true,
      nodeLabel: (node) => node.id,
    })

    voronoi = Delaunay.from(
      nodeCopy,
      (d) => d.x,
      (d) => d.y
    )
  }

  //_ Interaction
  let highlightedCanvas: HTMLCanvasElement

  const tooltip = {
    top: 0,
    left: 0,
    data: null,
  }

  function handleMouseOver(mouse: MouseEvent) {
    if (!voronoi) return

    const x = mouse.offsetX - dimensions.margins.left
    const y = mouse.offsetY - dimensions.margins.top

    const index = voronoi.find(x, y)

    const id = getId(nodeCopy[index])

    tooltip.top = mouse.offsetY
    tooltip.left = mouse.offsetX
    tooltip.data = {
      node: [nodeCopy[index]],
      edges: linkCopy.filter((link) => link.source.id === id),
    }
  }

  function handleMouseLeave() {
    tooltip.data = null
  }

  $: if (tooltip.data) {
    drawSimulation({
      canvas: highlightedCanvas,
      nodes: tooltip.data.node,
      edges: tooltip.data.edges,
      edgeWidth: (d) => widthScale(getValue(d)),
      nodeRadius: (d) => radiusScale(getConnections(d)),
      edgeColor: () => "#5de4c7",
      nodeStroke: () => "#292e3d",
      nodeFill: () => "#5de4c7",
      nodeLabelColor: () => "#0e0f12",
      nodeLabelFont: () => "14px Source Code Pro",
      showLabels: true,
      nodeLabel: (node) => node.id,
    })
  }
</script>

<div
  class="w-full h-full relative"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <canvas
    bind:this={canvas}
    {width}
    {height}
    on:mousemove={handleMouseOver}
    on:mouseleave={handleMouseLeave}
    style="opacity: {tooltip.data ? 0.5 : 1.0}"
  />
  <canvas
    bind:this={highlightedCanvas}
    {width}
    {height}
    class="absolute top-0 left-0 pointer-events-none"
    style="opacity: {tooltip.data ? 1.0 : 0.0}"
  />
  {#if tooltip.data}
    <Tooltip top={tooltip.top} left={tooltip.left} node={tooltip.data.node} />
  {/if}
</div>
