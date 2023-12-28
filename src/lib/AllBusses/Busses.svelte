<script lang="ts">
  import Network from "./Network.svelte"
  import { nodes, edges } from "../../assets/busses"
  import { createCombobox, melt } from "@melt-ui/svelte"
  import { fly } from "svelte/transition"
  import { writable } from "svelte/store"
  import Details from "./Details.svelte"

  const selected = writable(
    null as {
      value: string
      label: string
      disabled: boolean
    } | null
  )

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, touchedInput },
  } = createCombobox<any>({
    forceVisible: true,
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
    selected.set({ value: event.detail.node, label: event.detail.node })
  }
</script>

<section
  class="w-full mx-auto px-4 bg-midnight-75 border-t border-b border-midnight-50"
>
  <div class="flex flex-col gap-2 py-2 max-w-dashboard">
    <h2 class="text-3xl font-bold">Connectivity of London bus routes</h2>
    <div class="flex flex-col gap-2 xl:grid xl:grid-cols-8 xl:gap-4">
      <div class="col-span-6 h-screen">
        <Network {nodes} links={edges} {selectedNode} on:click={handleClick} />
      </div>
      <div class="col-span-2 flex flex-col gap-2">
        <div class="w-full">
          <div class="flex flex-col gap-1">
            <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
            <label use:melt={$label}>
              <span class="sr-only">Select a bus route</span>
            </label>
            <div class="relative flex justify-between items-center">
              <input
                use:melt={$input}
                class="flex w-full py-4 px-2 w-full items-center justify-between focus:outline-none bg-midnight-50 border border-midnight-25 rounded caret-primary carat-2"
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
          </div>
          {#if $open}
            <ul
              class="z-40 flex max-h-[300px] flex-col overflow-hidden"
              use:melt={$menu}
              transition:fly={{ duration: 150, y: -5 }}
            >
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <div
                class="flex max-h-full flex-col gap-0 overflow-y-auto bg-midnight-50 py-2 rounded shadow divide-y divide-midnight-25 border border-midnight-25"
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
                  <li class="relative cursor-pointer rounded">
                    No results found
                  </li>
                {/each}
              </div>
            </ul>
          {/if}
        </div>
        <div>
          {#if selectedNode}
            <Details
              lineId={selectedNode}
              edges={selectedEdges}
              on:click={handleClick}
            />
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
