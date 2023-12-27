<script lang="ts">
  import { draw } from "svelte/transition"
  import { quintOut } from "svelte/easing"
  import { onMount } from "svelte"

  export let path = ""
  export let color = "black"
  export let i = 0
  export let strokeWidth = 2

  export let style = ""

  let loaded = false

  onMount(() => {
    loaded = true
  })
</script>

{#if loaded}
  <path
    in:draw={{
      duration: 2000,
      easing: quintOut,
      delay: i * 100,
    }}
    class={`Line`}
    d={path}
    {style}
    fill="transparent"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  />
{/if}
