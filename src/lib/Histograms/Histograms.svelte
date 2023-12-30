<script lang="ts">
  import { routes } from "../../assets/bus-routes"
  import Histogram from "../Charts/Histogram.svelte"
  import { format } from "d3-format"

  export let selected: string | null = null
</script>

<div class="w-full h-full grid grid-cols-1 md:grid-cols-3 mx-auto gap-6">
  <div class="w-full h-facet">
    <Histogram
      data={routes}
      title="Number of stops"
      x="num_stops"
      yFormat={(d) => format(".0%")(d)}
      {selected}
      label="number"
    />
  </div>
  <div class="w-full h-facet">
    <Histogram
      data={routes}
      x="shared_percent"
      title="% of stops shared with other routes"
      xFormat={(d) => format(".0%")(d)}
      yFormat={(d) => format(".0%")(d)}
      {selected}
      label="number"
    />
  </div>
  <div class="w-full h-facet">
    <Histogram
      data={routes}
      x="lines"
      title="Number of connected routes"
      yFormat={(d) => format(".0%")(d)}
      {selected}
      label="number"
    />
  </div>
</div>
