type EdgeType = {
  source: {
    x: number
    y: number
  }
  target: {
    x: number
    y: number
  }
}

type NodeType = {
  x: number
  y: number
}

export const drawSimulation = ({
  canvas,
  nodes,
  edges,
  edgeColor = () => "white",
  edgeWidth = () => 1,
  nodeRadius = () => 1,
  nodeFill = () => "white",
  nodeStroke = () => "white",
  showLabels = false,
  nodeLabel = () => "",
}: {
  canvas: HTMLCanvasElement
  nodes: NodeType[]
  edges: EdgeType[]
  edgeColor?: (edge: any) => string
  edgeWidth?: (edge: any) => number
  nodeRadius?: (node: any) => number
  nodeFill?: (node: any) => string
  nodeStroke?: (node: any) => string
  showLabels?: boolean
  nodeLabel?: (node: any) => string
}) => {
  const context = canvas?.getContext("2d")

  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height)

    edges.forEach((edge) => {
      context.beginPath()
      context.moveTo(edge.source.x, edge.source.y)
      context.lineTo(edge.target.x, edge.target.y)

      context.strokeStyle = edgeColor(edge)
      context.lineWidth = edgeWidth(edge)
      context.stroke()
    })

    nodes.forEach((node) => {
      context.beginPath()
      const r = nodeRadius(node)

      context.arc(node.x, node.y, r, 0, 2 * Math.PI)

      context.fillStyle = nodeFill(node)
      context.fill()

      context.strokeStyle = nodeStroke(node)
      context.lineWidth = 1
      context.stroke()

      if (showLabels) {
        context.font = "10px Source Code Pro"
        context.fillStyle = nodeStroke(node)

        context.textAlign = "center"
        context.textBaseline = "middle"
        context.fillText(nodeLabel(node), node.x, node.y)
      }
    })
  }
}
