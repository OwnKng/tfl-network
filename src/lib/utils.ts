export function bounds() {
  let nodes
  let strength = 1
  let padding = 0
  let minX = -100
  let maxX = 100
  let minY = -100
  let maxY = 100

  function force() {
    nodes.forEach((node) => {
      node.x = Math.max(node.x, minX + padding)

      node.x = Math.min(node.x, maxX - padding)

      node.y = Math.max(node.y, minY + padding)

      node.y = Math.min(node.y, maxY - padding)
    })
  }

  force.padding = function (_) {
    return arguments.length ? ((padding = +_), force) : padding
  }

  force.minX = function (_) {
    return arguments.length ? ((minX = +_), force) : minX
  }

  force.maxX = function (_) {
    return arguments.length ? ((maxX = +_), force) : maxX
  }

  force.minY = function (_) {
    return arguments.length ? ((minY = +_), force) : minY
  }

  force.maxY = function (_) {
    return arguments.length ? ((maxY = +_), force) : maxY
  }

  force.strength = function (_) {
    return arguments.length ? ((strength = +_), force) : strength
  }

  force.initialize = function (_nodes) {
    nodes = _nodes
  }

  return force
}

export const createMultiline = (linestring: string, name: string) => {
  return {
    type: "Feature",
    properties: {
      name,
    },
    geometry: {
      type: "MultiLineString",
      coordinates: JSON.parse(linestring),
    },
  }
}

export const createPoint = (lon: number, lat: number, properties: any) => {
  return {
    type: "Feature",
    properties: properties,
    geometry: {
      type: "Point",
      coordinates: [lon, lat],
    },
  }
}

export function createBoundingBox(
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number
) {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [xmin, ymin],
          [xmin, ymax],
          [xmax, ymax],
          [xmax, ymin],
          [xmin, ymin],
        ],
      ],
    },
  }
}

export function includesAll(arr1: string[], arr2: string[]) {
  return arr2.every((item) => arr1.includes(item))
}

export function isIn(arr1: any[], arr2: any[]) {
  return arr1.filter((el) => arr2.indexOf(el) > -1)
}
