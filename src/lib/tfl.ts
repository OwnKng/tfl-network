import { createBoundingBox, createMultiline, createPoint, isIn } from "./utils"
import { min, max } from "d3-array"

const BASE_URL = "https://api.tfl.gov.uk/line/"

export async function getLine(line: string) {
  const res = await fetch(`${BASE_URL}${line}/route`)

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const lineDetails = await res.json()
  const { routeSections } = lineDetails

  const { originationName, destinationName } = routeSections[0]

  return [originationName, destinationName]
}

type TFLData = {
  lineStrings: string[]
  stations: Stations[]
}

type Stations = {
  name: string
  lat: number
  lon: number
  lines: Lines[]
}

type Lines = {
  id: string
}

export async function getLinePath(line: string) {
  const res = await fetch(`${BASE_URL}${line}/route/sequence/inbound`)

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const data = await res.json()
  const { lineStrings, stations } = data as TFLData

  return { lineStrings: createMultiline(lineStrings[0], line), stations }
}

export async function getLinePaths(lines: string[]) {
  const lineData = await Promise.all(lines.map((line) => getLinePath(line)))

  const lons = lineData.flatMap((line) =>
    line.stations.map((station) => station.lon)
  )
  const lats = lineData.flatMap((line) =>
    line.stations.map((station) => station.lat)
  )

  const stations = lineData
    .flatMap((line) => line.stations)
    .reduce(
      (acc, cur) =>
        acc.map((s) => s.name).includes(cur.name) ? acc : [...acc, cur],
      [] as Stations[]
    )
    .map((station) => ({
      ...station,
      lines: isIn(
        station.lines.map((line) => line.id),
        lines
      ),
    }))
    .map(({ lat, lon, name, lines }) => createPoint(lon, lat, { name, lines }))

  return {
    lines: lineData.map(({ lineStrings }) => lineStrings),
    points: stations,
    bounds: createBoundingBox(min(lons), max(lons), min(lats), max(lats)),
  }
}
