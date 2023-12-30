import { edges } from "../assets/edges"

export function getEdges(id: string, n = 10): string[] {
  const allEdges = edges.filter((e) => e.source === id)

  if (!allEdges.length) return []

  return allEdges
    .sort((a, b) => b.value - a.value)
    .slice(0, n)
    .map((e) => e.target)
}
