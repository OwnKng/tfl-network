<script lang="ts">
  import "@fontsource/source-code-pro"
  import "@fontsource/nunito"
  import "@fontsource/nunito/800.css"

  import Busses from "./lib/AllBusses/Busses.svelte"
  import Histograms from "./lib/Histograms/Histograms.svelte"
</script>

<div class="text-gray-300 pt-4 pb-8">
  <nav class="w-full px-4">
    <div class="max-w-page mx-auto">
      <a class="text-xl font-bold text-white" href="https://www.ownkng.dev/"
        >OwnKng</a
      >
    </div>
  </nav>
  <header class="max-w-content mx-auto px-4 pb-4 pt-12 flex flex-col gap-4">
    <h1 class="text-4xl md:text-6xl">How are London's busses connected?</h1>
    <p class="text-2xl">A network analysis of bus routes</p>
  </header>
  <article class="max-w-content mx-auto px-4 flex flex-col gap-2">
    <p class="text-lg">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
  </article>
  <main class="w-full flex flex-col gap-8 pt-4 pb-8">
    <Busses />
    <div class="flex flex-col gap-2">
      <p class="w-full mx-auto w-full max-w-content">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p class="w-full mx-auto w-full max-w-content">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
    <Histograms />
  </main>
  <div class="w-full max-w-content px-4 mx-auto flex flex-col gap-2">
    <h2>Data and Methodology</h2>
    <div class="flex flex-col gap-1">
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </div>
  </div>
</div>
