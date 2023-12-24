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
