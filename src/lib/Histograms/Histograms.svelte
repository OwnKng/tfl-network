<script lang="ts">
  import { nodes } from "../../assets/nodes"
  import Histogram from "../Charts/Histogram.svelte"
  import { format } from "d3-format"

  export let selected: string | null = null
</script>

<div class="w-full h-full grid grid-cols-1 md:grid-cols-4 mx-auto gap-6">
  <div class="w-full h-facet">
    <Histogram
      data={nodes}
      title="Number of stops"
      x="num_stops"
      yFormat={(d) => format(".0%")(d)}
      {selected}
      label="id"
    />
  </div>
  <div class="w-full h-facet">
    <Histogram
      data={nodes}
      x="shared_percent"
      title="% of stops shared"
      xFormat={(d) => format(".0%")(d)}
      yFormat={(d) => format(".0%")(d)}
      {selected}
      label="id"
    />
  </div>
  <div class="w-full h-facet">
    <Histogram
      data={nodes}
      x="connections"
      title="Number of connected routes"
      yFormat={(d) => format(".0%")(d)}
      {selected}
      label="id"
    />
  </div>
  <div class="w-full h-facet">
    <Histogram
      data={nodes}
      x="centrality_scaled"
      title="Eigenvector centrality score"
      xFormat={(d) => Math.round(d)}
      {selected}
      label="id"
    />
  </div>
</div>
