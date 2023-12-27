<script lang="ts">
  import "@fontsource/source-code-pro"
  import "@fontsource/nunito"

  import NetworkBuilder from "./lib/NetworkBuilder/NetworkBuilder.svelte"
  import Busses from "./lib/AllBusses/Busses.svelte"
  import Route from "./lib/Route/Route.svelte"
</script>

<main class="w-full flex flex-col gap-8 pb-8">
  <Busses />
  <NetworkBuilder />
  <Route />
</main>
