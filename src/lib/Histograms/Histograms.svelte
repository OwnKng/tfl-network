<script lang="ts">
  import { routes } from "../../assets/bus-routes"
  import Histogram from "../Charts/Histogram.svelte"
  import { format } from "d3-format"

  export let selected: string | null = null
</script>

<div class="w-full h-full grid grid-cols-1 md:grid-cols-3 mx-auto gap-6">
  <div>
    <h2 class="text-sm ml-[10px]">Number of stops</h2>
    <div class="w-full h-facet">
      <Histogram
        data={routes}
        x="num_stops"
        yFormat={(d) => format(".0%")(d)}
        {selected}
        label="number"
      />
    </div>
  </div>
  <div>
    <h2 class="text-sm ml-[10px]">% of stops shared</h2>
    <div class="w-full h-facet">
      <Histogram
        data={routes}
        x="shared_percent"
        xFormat={(d) => format(".0%")(d)}
        yFormat={(d) => format(".0%")(d)}
        {selected}
        label="number"
      />
    </div>
  </div>
  <div>
    <h2 class="text-sm ml-[10px]">Number of connected routes</h2>
    <div class="w-full h-facet">
      <Histogram
        data={routes}
        x="lines"
        yFormat={(d) => format(".0%")(d)}
        {selected}
        label="number"
      />
    </div>
  </div>
</div>
