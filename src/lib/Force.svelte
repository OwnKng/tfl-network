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
  import { drawSimulation } from "./simulation"

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
      forceCollide().radius((d) => radiusScale(d.connections) + 8)
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
      showLabels: true,
      nodeLabel: (node) => node.id,
    })

    voronoi = Delaunay.from(
      nodeCopy,
      (d) => d.x,
      (d) => d.y
    )
  }
</script>

<div class="w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
  <canvas bind:this={canvas} {width} {height} />
</div>
