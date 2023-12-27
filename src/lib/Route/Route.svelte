<script lang="ts">
  import { getLinePaths } from "../tfl"
  import Map from "./Map.svelte"
  import { nodes } from "../../assets/busses"
  import { createCombobox, melt } from "@melt-ui/svelte"
  import { fly } from "svelte/transition"
  import { writable } from "svelte/store"
  import GraphPaper from "../GraphPaper.svelte"

  const selected = writable([
    { value: "21", label: "21", disabled: false },
    { value: "47", label: "47", disabled: false },
  ] as { value: string; label: string; disabled: boolean }[])

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, touchedInput },
  } = createCombobox({
    forceVisible: true,
    onSelectedChange: ({ next }) => {
      inputValue.set("")
      inputElement.focus()
      return next
    },
    multiple: true,
    selected: selected,
  })

  let inputElement: HTMLInputElement

  $: filtered = $touchedInput
    ? nodes.filter(({ id }) => {
        const normalizedInput = $inputValue.toLowerCase()
        return id.toLowerCase().startsWith(normalizedInput)
      })
    : nodes

  $: ids = $selected.map((d) => d.value)
</script>

<section
  class="w-full h-full max-w-dashboard mx-auto flex flex-col gap-4 border border-midnight-50 bg-midnight-75 divide-y divide-midnight-50 rounded shadow"
>
  <div class="px-2">
    <h3>Where do routes connect?</h3>
  </div>
  <div class="grid grid-cols-8 h-map gap-2">
    <div class="col-span-6">
      <GraphPaper>
        {#if ids.length}
          {#await getLinePaths(ids)}
            <span>Loading</span>
          {:then lines}
            <div class="w-full h-full">
              <Map
                lines={lines.lines}
                points={lines.points}
                bounds={lines.bounds}
              />
            </div>
          {:catch error}
            <span>{error.message}</span>
          {/await}
        {/if}
      </GraphPaper>
    </div>
    <div class="w-full h-full col-span-2 px-2 py-2">
      <div class="flex gap-2 flex-wrap">
        {#each $selected as node, index (index)}
          <button
            on:click={() => selected.update((s) => s.filter((n) => n !== node))}
            class="flex items-center justify-center px-2 py-1 text-sm rounded-lg shadow my-2 bg-primary text-midnight"
          >
            {node.value}
          </button>
        {/each}
      </div>
      <div class="relative w-full">
        <div class="flex bg-midnight-50 rounded shadow px-1 flex-wrap">
          <input
            bind:this={inputElement}
            use:melt={$input}
            class="flex rounded px-2 py-4 grow bg-midnight-50 focus:outline-none"
            placeholder="Search for a route"
          />
        </div>
      </div>
    </div>
    {#if $open}
      <ul
        class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md shadow-lg bg-midnight-75 divide-y divide-midnight-50 border border-midnight-50"
        use:melt={$menu}
        transition:fly={{ duration: 150, y: -5 }}
      >
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div class="flex max-h-full flex-col overflow-y-auto" tabindex="0">
          {#each filtered as node, index (index)}
            <li
              use:melt={$option({
                value: node.id,
                label: node.id,
              })}
              class="relative cursor-pointer data-[highlighted]:bg-midnight-50 data-[disabled]:opacity-50"
            >
              {#if $selected.map((d) => d.value).includes(node.id)}
                <div class="py-2 px-2 bg-midnight-50 w-full">
                  {node.id}
                </div>
              {:else}
                <div class="py-2 px-2 w-full">{node.id}</div>
              {/if}
            </li>
          {/each}
        </div>
      </ul>
    {/if}
  </div>
</section>
