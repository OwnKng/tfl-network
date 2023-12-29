<script lang="ts">
  import { nodes, edges } from "../../assets/busses"
  import { createCombobox, melt } from "@melt-ui/svelte"
  import { fly } from "svelte/transition"
  import { writable } from "svelte/store"
  import Force from "./Force.svelte"
  import GraphPaper from "../GraphPaper.svelte"

  const selected = writable([
    {
      value: "89",
      label: "89",
      disabled: false,
    },
    {
      value: "21",
      label: "21",
      disabled: false,
    },
    {
      value: "47",
      label: "47",
      disabled: false,
    },
    {
      value: "26",
      label: "26",
      disabled: false,
    },
    {
      value: "89",
      label: "89",
      disabled: false,
    },
    {
      value: "207",
      label: "207",
      disabled: false,
    },
    {
      value: "65",
      label: "65",
      disabled: false,
    },
    {
      value: "207",
      label: "207",
      disabled: false,
    },
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

  $: searchedNodes = $touchedInput
    ? nodes.filter(({ id }) => {
        const normalizedInput = $inputValue.toLowerCase()
        return id.toLowerCase().startsWith(normalizedInput)
      })
    : nodes

  let filteredNodes: any[] = []
  let filteredEdges: any[] = []

  $: {
    const ids = $selected.map((d) => d.value)

    filteredNodes = nodes.filter((d) => ids.includes(d.id))

    filteredEdges = edges.filter(
      (d) => ids.includes(d.source) && ids.includes(d.target)
    )
  }
</script>

<div
  class="w-full pt-4 w-full bg-midnight-75 border-t border-b border-midnight-25 rounded shadow mx-auto"
>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="relative w-full px-4">
        <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
        <label class="sr-only" use:melt={$label}> Select route </label>
        <div class="flex bg-midnight-50 rounded shadow px-1 flex-wrap">
          <div class="flex gap-2 flex-wrap">
            {#each $selected as node, index (index)}
              <button
                on:click={() =>
                  selected.update((s) => s.filter((n) => n !== node))}
                class="flex items-center justify-center px-2 py-1 text-sm rounded-lg shadow my-2 bg-primary text-midnight"
              >
                {node.value}
              </button>
            {/each}
          </div>
          <input
            bind:this={inputElement}
            use:melt={$input}
            class="flex rounded px-2 py-4 grow bg-midnight-50 focus:outline-none"
            placeholder="Search for a route"
          />
        </div>
      </div>
      {#if $open}
        <ul
          class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md shadow-lg bg-midnight-75 divide-y divide-midnight-25 border border-midnight-50"
          use:melt={$menu}
          transition:fly={{ duration: 150, y: -5 }}
        >
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <div class="flex max-h-full flex-col overflow-y-auto" tabindex="0">
            {#each searchedNodes as node, index (index)}
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
    <GraphPaper>
      <div class="w-full h-map border-t border-midnight-25">
        {#if filteredNodes.length > 0}
          <Force nodes={filteredNodes} links={filteredEdges} />
        {/if}
      </div>
    </GraphPaper>
  </div>
</div>
