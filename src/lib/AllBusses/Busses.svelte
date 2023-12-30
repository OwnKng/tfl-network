<script lang="ts">
  import Network from "./Network.svelte"
  import { edges } from "../../assets/edges"
  import { nodes } from "../../assets/nodes"
  import { createCombobox, melt } from "@melt-ui/svelte"
  import { fly } from "svelte/transition"
  import { writable } from "svelte/store"
  import Details from "./Details.svelte"
  import Histograms from "../Histograms/Histograms.svelte"
  import { afterUpdate } from "svelte"

  const params = new URLSearchParams(window.location.search)
  const route = params.get("route") ?? "148"

  const selected = writable({ value: route, label: route, disabled: false })

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, touchedInput },
  } = createCombobox<any>({
    forceVisible: true,
    // @ts-ignore
    selected: selected,
  })

  $: if (!$open) {
    $inputValue = $selected?.label ?? ""
  }

  $: filtered = $touchedInput
    ? nodes.filter(({ id }) => {
        const normalizedInput = $inputValue.toLowerCase()
        return id.toLowerCase().startsWith(normalizedInput)
      })
    : nodes

  let selectedNode: string | null = "243"
  let selectedEdges: { source: string; target: string; value: number }[] = []

  $: {
    if ($selected && $selected.value !== selectedNode) {
      selectedNode = $selected.value
      selectedEdges = edges.filter((d) => d.source === selectedNode)
    } else if (!$selected) {
      selectedNode = null
      selectedEdges = []
    }
  }

  function handleClick(event: CustomEvent<{ node: string }>) {
    selected.set({
      value: event.detail.node,
      label: event.detail.node,
      disabled: false,
    })
  }

  afterUpdate(() => {
    params.set("route", $selected?.value ?? "")
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`)
  })
</script>

<section
  class="w-full mx-auto px-4 border-t py-4 bg-midnight-75 border-b border-midnight-50 flex flex-col gap-4 mb-4"
>
  <div class="w-full max-w-dashboard mx-auto flex flex-col gap-4 py-6">
    <h2 class="mt-0 max-w-content mx-auto w-full text-lg">
      Connections between London bus routes
    </h2>
    <div class="w-full sticky top-2 z-50 max-w-content mx-auto shadow-md">
      <div class="relative flex justify-between items-center">
        <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
        <label use:melt={$label}>
          <span class="sr-only">Select a bus route</span>
        </label>
        <input
          use:melt={$input}
          class="flex w-full py-4 px-2 items-center justify-between focus:outline-none bg-midnight-50 border border-midnight-25 rounded caret-primary"
          placeholder="Select a bus route"
        />
        {#if $selected}
          <button
            class="absolute right-2 w-8 h-8 justify-center items-center rounded-full bg-primary text-midnight"
            on:click={() => selected.set(null)}
          >
            X
          </button>
        {/if}
      </div>
      {#if $open}
        <ul
          class="z-50 flex max-h-[300px] flex-col overflow-hidden"
          use:melt={$menu}
          transition:fly={{ duration: 150, y: -5 }}
        >
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <div
            class="flex max-h-full flex-col gap-0 overflow-y-auto bg-midnight-50 rounded shadow divide-y divide-midnight-25 border border-midnight-25"
            tabindex="0"
          >
            {#each filtered as node, index (index)}
              <li
                use:melt={$option({
                  label: node.id,
                  value: node.id,
                })}
                class="relative cursor-pointer scroll-my-2 px-2 py-2 hover:bg-midnight-25 data-[highlighted]:bg-midnight-25 data-[disabled]:opacity-50"
              >
                <div>
                  <span class="block text-sm opacity-75">{node.id}</span>
                </div>
              </li>
            {:else}
              <li class="relative cursor-pointer rounded">No results found</li>
            {/each}
          </div>
        </ul>
      {/if}
    </div>
    <div class="flex flex-col gap-2 xl:grid xl:grid-cols-8 xl:gap-4">
      <div class="col-span-6 h-map max-h-screen">
        <Network {nodes} links={edges} {selectedNode} on:click={handleClick} />
      </div>
      <div class="col-span-2 flex flex-col gap-2">
        {#if selectedNode}
          <Details
            lineId={selectedNode}
            edges={selectedEdges}
            on:click={handleClick}
          />
        {/if}
      </div>
    </div>
    <Histograms selected={selectedNode} />
  </div>
</section>
