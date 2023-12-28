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
  import { bounds } from "../utils"
  import { drawSimulation } from "../simulation"
  import { createEventDispatcher, onMount } from "svelte"

  export let nodes: { id: string; connections: number }[] = []
  export let links: { source: string; target: string; value: number }[] = []
  export let selectedNode: string | null = null

  let nodesCopy: any[] = []
  let linksCopy: any[] = []

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

  $: widthScale = scaleSqrt([1, max(links.map(getValue))], [1, 12])

  $: createSimulation = () => {
    const _N = nodes.map((n) => ({ ...n }))
    const _E = links.map((e) => ({ ...e }))

    const simulation = forceSimulation(_N)
      .force("charge", forceManyBody())
      .force(
        "link",
        forceLink(_E)
          .id((d) => d.id)
          .distance(0)
      )
      .force(
        "collide",
        forceCollide((d) => radiusScale(getConnections(d)) + 0.2)
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
      .force("x", forceX(dimensions.innerWidth / 2))
      .force("y", forceY(dimensions.innerHeight / 2))
      .stop()

    return [_N, _E, simulation]
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

  function handleClick(event: MouseEvent, nodes: any[]) {
    if (!voronoi) return null

    const x = event.offsetX - dimensions.margins.left
    const y = event.offsetY - dimensions.margins.top

    const index = voronoi.find(x, y)

    const id = getId(nodes[index])

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
    const [_N, _E, simulation] = createSimulation()
    simulation.tick(150)

    canvas.width = dimensions.innerWidth
    canvas.height = dimensions.innerHeight

    highlightedCanvas.width = dimensions.innerWidth
    highlightedCanvas.height = dimensions.innerHeight

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

    nodesCopy = _N
    linksCopy = _E
  })
</script>

<div class="w-full h-full overflow-hidden">
  <div
    class="w-full h-full relative"
    bind:clientWidth={width}
    bind:clientHeight={height}
  >
    <canvas
      on:mousemove={handleMouseOver}
      bind:this={canvas}
      on:mouseleave={handleMouseLeave}
      style="opacity: {highlighted ? 0.5 : 1.0}"
      class="transition-opacity cursor-pointer"
      on:click={(e) => handleClick(e, nodesCopy)}
    />
    <canvas
      bind:this={highlightedCanvas}
      id="tooltip"
      style="opacity: {highlighted ? 1.0 : 0.0}"
      class="transition-opacity"
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
