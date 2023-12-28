<script lang="ts">
  import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceX,
    forceY,
    forceCollide,
  } from "d3-force"
  import { scaleSqrt } from "d3-scale"
  import { min, max } from "d3-array"
  import { onMount } from "svelte"
  import { Delaunay } from "d3-delaunay"
  import { bounds } from "../utils"
  import { drawSimulation } from "../simulation"
  import { createEventDispatcher } from "svelte"

  export let nodes: { id: string; connections: number }[] = []
  export let links: { source: string; target: string; value: number }[] = []
  export let selectedNode: string | null = null

  let nodesCopy = []
  let linksCopy = []

  let canvas: HTMLCanvasElement

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

  $: radiusScale = scaleSqrt([1, max(nodes, getConnections)], [2, 12])

  $: widthScale = scaleSqrt(
    [min(links.map(getValue)), max(links.map(getValue))],
    [1, 5]
  )

  const createSimulation = (nodes, edges) => {
    const _N = nodes.map((n) => ({ ...n }))
    const _E = edges.map((e) => ({ ...e }))

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink(edges).id((d) => d.id)
      )
      .force("charge", forceManyBody())
      .force("x", forceX())
      .force("y", forceY())
      .force(
        "collide",
        forceCollide((d) => radiusScale(getConnections(d)) + 1)
      )
      .force(
        "bounds",
        bounds()
          .minX(0)
          .maxX(dimensions.innerWidth)
          .minY(0)
          .maxY(dimensions.innerHeight)
          .padding(20)
      )
      .force(
        "center",
        forceCenter(dimensions.innerWidth / 2, dimensions.innerHeight / 2)
      )
      .stop()
      .tick(300)

    return [nodes, edges]
  }

  let voronoi: any | null = null

  //_ Interaction
  let highlightedCanvas: HTMLCanvasElement

  $: getSelected = () => {
    if (!selectedNode) return null

    return {
      nodes: nodesCopy.filter((node) => node.id === selectedNode),
      edges: linksCopy.filter((link) => link.source.id === selectedNode),
    }
  }

  $: highlighted = getSelected()

  function handleMouseOver(event: MouseEvent) {
    if (!voronoi) return null

    const x = event.offsetX - dimensions.margins.left
    const y = event.offsetY - dimensions.margins.top

    const index = voronoi.find(x, y)

    const id = getId(nodesCopy[index])

    highlighted = {
      nodes: nodesCopy.filter((node) => node.id === id),
      edges: linksCopy.filter((link) => link.source.id === id),
    }
  }

  function handleMouseLeave() {
    highlighted = getSelected()
  }

  const dispatch = createEventDispatcher()

  $: handleClick = (event: MouseEvent) => {
    if (!voronoi) return null

    const x = event.offsetX - dimensions.margins.left
    const y = event.offsetY - dimensions.margins.top

    const index = voronoi.find(x, y)

    const id = getId(nodesCopy[index])

    dispatch("click", { node: id })
  }

  $: if (highlighted) {
    drawSimulation({
      canvas: highlightedCanvas,
      nodes: highlighted.nodes,
      edges: highlighted.edges,
      edgeWidth: (d) => widthScale(getValue(d)),
      nodeRadius: (d) => radiusScale(getConnections(d)),
      edgeColor: () => "#5de4c7",
      nodeStroke: () => "#24282f",
      nodeFill: () => "#5de4c7",
      nodeLabelColor: () => "#0e0f12",
      showLabels: true,
      nodeLabel: (node) => node.id,
    })
  }

  onMount(() => {
    const [_N, _E] = createSimulation(nodes, links)

    nodesCopy = _N
    linksCopy = _E

    drawSimulation({
      canvas: canvas,
      nodes: _N,
      edges: _E,
      edgeColor: (d) => "rgba(255, 255, 255, 0.025)",
      edgeWidth: (d) => widthScale(getValue(d)),
      nodeRadius: (d) => radiusScale(getConnections(d)),
      nodeStroke: () => "#24282f",
      nodeFill: () => "#DCDDE5",
      nodeLabelColor: () => "#0e0f12",
      showLabels: true,
      nodeLabel: (node) => (getConnections(node) > 50 ? node.id : ""),
    })

    voronoi = Delaunay.from(_N.map(({ x, y }) => [x, y]))
  })

  function handleResize() {
    const [_N, _E] = createSimulation(nodes, links)

    nodesCopy = _N
    linksCopy = _E

    drawSimulation({
      canvas: canvas,
      nodes: _N,
      edges: _E,
      edgeColor: (d) => "rgba(255, 255, 255, 0.025)",
      edgeWidth: (d) => widthScale(getValue(d)),
      nodeRadius: (d) => radiusScale(getConnections(d)),
      nodeStroke: () => "#24282f",
      nodeFill: () => "#DCDDE5",
      nodeLabelColor: () => "#0e0f12",
      showLabels: true,
      nodeLabel: (node) => (getConnections(node) > 50 ? node.id : ""),
    })

    console.log("resized")

    voronoi = Delaunay.from(_N.map(({ x, y }) => [x, y]))
  }
</script>

<svelte:window on:resize={handleResize} />

<div class="w-full h-full">
  <div
    class="w-full h-full relative"
    bind:clientWidth={width}
    bind:clientHeight={height}
  >
    <canvas
      on:mousemove={handleMouseOver}
      width={dimensions.width}
      height={dimensions.height}
      bind:this={canvas}
      on:mouseleave={handleMouseLeave}
      style="opacity: {highlighted ? 0.5 : 1.0}"
      class="transition-all cursor-pointer border"
      on:click={handleClick}
    />
    <canvas
      width={dimensions.width}
      height={dimensions.height}
      bind:this={highlightedCanvas}
      id="tooltip"
      style="opacity: {highlighted ? 1.0 : 0.0}"
      class="transition-all"
    />
  </div>
</div>

<style>
  #tooltip {
    pointer-events: none;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
</style>
