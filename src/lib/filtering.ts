import { edges, nodes } from "../assets/busses"

export function getEdges(id: string, n = 10): string[] {
  const allEdges = edges.filter((e) => e.source === id)

  if (!allEdges.length) return []

  return allEdges
    .sort((a, b) => b.value - a.value)
    .slice(0, n)
    .map((e) => e.target)
}

export function getCentralityScore(id: string): number {
  return nodes.find((n) => n.id === id)?.centrality_group || 0
}
