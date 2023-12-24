<script lang="ts">
  import "@fontsource/source-code-pro"
  import "@fontsource/nunito"

  import NetworkBuilder from "./lib/NetworkBuilder.svelte"
  import Busses from "./lib/AllBusses/Busses.svelte"
</script>

<main class="w-full flex flex-col gap-8">
  <Busses />
  <NetworkBuilder />
</main>
