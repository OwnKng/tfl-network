<script lang="ts">
  import "@fontsource/source-code-pro"
  import "@fontsource/nunito"
  import "@fontsource/nunito/800.css"
  import "@fontsource/nunito/200.css"

  import Busses from "./lib/AllBusses/Busses.svelte"
  import Footer from "./lib/components/Footer.svelte"
  import CopyToClipboard from "./lib/components/CopyToClipboard.svelte"
</script>

<div class="text-gray-400">
  <nav class="w-full px-4 flex items-center py-2">
    <div class="max-w-page mx-auto w-full">
      <a class="text-xl font-bold text-white" href="https://www.ownkng.dev/"
        >OwnKng</a
      >
    </div>
  </nav>
  <header class="max-w-content mx-auto px-4 pt-12 gap-4">
    <h1 class="text-5xl md:text-6xl">How are London's bus routes connected?</h1>
    <div class="w-full w-full flex flex-col gap-1 pt-4 pb-1">
      <span class="text-sm text-light">Jan 2024</span>
      <CopyToClipboard link="https://network.ownkng.dev/" />
    </div>
  </header>
  <article class="pt-8">
    <section class="w-full max-w-content px-4 mx-auto">
      <p class="text-xl text-heading font-light pt-4">
        There are more than 19,000 bus stops in London and around 700 routes
        operating from them. A typical route consists of between 40 and 60
        stops.
        <sup>
          <a id="inline-1" class="text-xs" href="#footnote-1">[1]</a>
        </sup> Each stop that one route shares with another creates a connection
        between routes. This analysis explores the network that these connections
        create.
      </p>
      <p>
        A typical bus route connects at least once to between 20 to 40 other
        routes while navigating its stops. Many routes share multiple stops with
        their connected routes - so around half of London bus routes share
        almost 90% of their stops with at least one other route.
      </p>
      <p>
        On this analysis, some of London's least connected routes include the
        <a href="https://tfl.gov.uk/bus/route/399" target="_blank">399</a> and
        the
        <a href="https://tfl.gov.uk/bus/route/W5" target="_blank">W5</a>, which
        both share around a quarter of their stops with other routes.
      </p>
    </section>
    <Busses />
    <section>
      <div class="w-full max-w-content mx-auto px-4">
        <p>
          However, not all connections are equally important - a route that
          shares a single stop with a bus that connects to many other routes is
          more useful than sharing many stops with lots of poorly connected
          busses.
        </p>
        <p>
          To measure these connections across multiple degrees, we can calculate
          the <a href="https://en.wikipedia.org/wiki/Eigenvector_centrality"
            >eigenvector centrality
          </a>
          for each route.<sup><a id="inline-2" href="#footnote-2">[2]</a></sup>
          The routes with the highest eigenvectors tend to be the longer routes that
          connect parts of Zones 2 or 3 via Central London - including the
          <a href="https://tfl.gov.uk/bus/route/148" target="_blank"> 148 </a>,
          the <a href="https://tfl.gov.uk/bus/route/35" target="_blank">35</a>,
          and the
          <a href="https://tfl.gov.uk/bus/route/2" target="_blank">2</a>
          .
        </p>
        <p>
          Those bus numbers with the smallest eigenvectors tend to be the
          shorter routes on the very edges of London, such as the
          <a href="https://tfl.gov.uk/bus/route/608" target="_blank">608</a>,
          <a href="https://tfl.gov.uk/bus/route/346" target="_blank">346</a>, or
          the
          <a href="https://tfl.gov.uk/bus/route/372" target="_blank">372</a>.
        </p>
      </div>
    </section>
    <section class="w-full max-w-content px-4 mx-auto">
      <h2 class="text-xl">Data and Methodology</h2>
      <p>
        The data for piece was extracted using the
        <a href="https://api.tfl.gov.uk/" target="_blank">
          Transport for London API
        </a>. The analysis was undertaken in Python, using
        <a href="https://pandas.pydata.org/" target="_blank"> Pandas </a>
        and
        <a href="https://networkx.org/" target="_blank"> NetworkX </a>
        .
      </p>
      <p>
        Night busses were excluded from the analysis, as lots of night bus
        routes are similar to their daytime counterparts and most bus usage
        occurs during the day.
      </p>
      <p>
        This page was built with <a href="https://svelte.dev/">Svelte</a>. The
        graphs and visual analysis were all created using
        <a href="https://d3js.org/">D3</a>. Code available in this
        <a href="https://github.com/OwnKng/tfl-network" target="_blank">
          GitHub Repo.
        </a>
      </p>
    </section>
    <aside class="w-full max-w-content mx-auto px-4 pt-6">
      <h3>Notes</h3>
      <ol class="text-sm text-slate-400 flex flex-col gap-2">
        <li id="footnote-1">
          <a href="#inline-1">1.</a> This is counting all unique stops in both directions,
          regardless of which stand or letter of stop the route stops at. While most
          stops comprise several stands or letters, this analysis considers all stands
          or letters to be part of the same stop.
        </li>
        <li id="footnote-2">
          <a href="#inline-2">2.</a> As the eigenvectors are heavily skewed towards
          the left of the distribution, the graph above shows the log of the eigenvectors
          rescaled to between 0 and 100.
        </li>
      </ol>
    </aside>
  </article>
  <Footer />
</div>
