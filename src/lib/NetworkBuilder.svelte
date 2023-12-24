<script lang="ts">
  import { nodes, edges } from "../assets/busses"
  import { createCombobox, melt } from "@melt-ui/svelte"
  import { fly } from "svelte/transition"
  import { writable } from "svelte/store"
  import Force from "./Force.svelte"

  const selected = writable(
    [] as { value: string; label: string; disabled: string }[]
  )

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

<div class="w-full px-4">
  <div class="flex flex-col gap-1">
    <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
    <label class="sr-only" use:melt={$label}> Select route </label>
    <div class="relative w-full">
      <div class="flex bg-white rounded shadow px-1 flex-wrap">
        <div class="flex gap-2 flex-wrap">
          {#each $selected as node, index (index)}
            <button
              on:click={() =>
                selected.update((s) => s.filter((n) => n !== node))}
              class="flex items-center justify-center px-2 py-1 text-sm bg-magnum-100 rounded-md my-1 bg-zinc-100 text-zinc-600"
            >
              {node.value}
            </button>
          {/each}
        </div>
        <input
          bind:this={inputElement}
          use:melt={$input}
          class="flex rounded bg-white px-2 py-4 text-black grow"
          placeholder="Search for a route"
        />
      </div>
    </div>
  </div>
  {#if $open}
    <ul
      class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md shadow-lg bg-white"
      use:melt={$menu}
      transition:fly={{ duration: 150, y: -5 }}
    >
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div
        class="flex max-h-full flex-col overflow-y-auto bg-white text-black"
        tabindex="0"
      >
        {#each searchedNodes as node, index (index)}
          <li
            use:melt={$option({
              value: node.id,
              label: node.id,
            })}
            class="relative cursor-pointer py-2 px-2
        data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-600
          data-[disabled]:opacity-50"
          >
            {#if $selected.map((d) => d.value).includes(node.id)}
              <span class="text-amber-300">
                {node.id}
              </span>
            {:else}
              <span>{node.id}</span>
            {/if}
          </li>
        {/each}
      </div>
    </ul>
  {/if}
  <div class="w-full h-screen">
    {#if filteredNodes.length > 0}
      <Force nodes={filteredNodes} links={filteredEdges} />
    {/if}
  </div>
</div>
