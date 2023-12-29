<script lang="ts">
  import { routes } from "../../assets/bus-routes"
  import Histogram from "../Charts/Histogram.svelte"
  import { format } from "d3-format"
  import { createCombobox, melt } from "@melt-ui/svelte"
  import { nodes } from "../../assets/busses"
  import { fly } from "svelte/transition"

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, touchedInput, selected },
  } = createCombobox<any>({
    forceVisible: true,
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
</script>

<section class="w-full max-w-page mx-auto px-4 flex flex-col gap-6">
  <div class="col-span-2 flex flex-col gap-2 w-full items-end">
    <div class="w-full max-w-[400px]">
      <div class="flex flex-col gap-1">
        <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
        <label use:melt={$label}>
          <span class="sr-only">Highlight a bus route</span>
        </label>
        <div class="relative flex justify-between items-center">
          <input
            use:melt={$input}
            class="flex w-full py-3 px-2 w-full items-center justify-between focus:outline-none bg-midnight-50 border border-midnight-25 rounded caret-primary carat-2"
            placeholder="Highlight a bus route"
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
    <div class="w-full h-full grid grid-cols-3 mx-auto gap-4">
      <div class="w-full">
        <h2 class="text-sm ml-[10px]">Number of stops</h2>
        <div class="w-full h-facet">
          <Histogram
            data={routes}
            x="num_stops"
            yFormat={(d) => format(".0%")(d)}
            selected={$selected?.value}
            label="number"
          />
        </div>
      </div>
      <div class="col-span-1 row-span-1">
        <h2 class="text-sm ml-[10px]">Shared of shared stops</h2>
        <div class="w-full h-facet">
          <Histogram
            data={routes}
            x="shared_percent"
            xFormat={(d) => format(".0%")(d)}
            yFormat={(d) => format(".0%")(d)}
            selected={$selected?.value}
            label="number"
          />
        </div>
      </div>
      <div class="col-span-1 row-span-1">
        <h2 class="text-sm ml-[10px]">Number of connected routes</h2>
        <div class="w-full h-facet">
          <Histogram
            data={routes}
            x="lines"
            yFormat={(d) => format(".0%")(d)}
            selected={$selected?.value}
            label="number"
          />
        </div>
      </div>
    </div>
  </div>
</section>
