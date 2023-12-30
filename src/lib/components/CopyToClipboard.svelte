<script lang="ts">
  export let link: string

  let success = false

  function copyToClipboard() {
    navigator.clipboard.writeText(link)
    success = true
  }

  $: {
    if (success) {
      setTimeout(() => {
        success = false
      }, 2000)
    }
  }
</script>

<button
  class="bg-primary text-midnight w-8 h-8 px-1 py-1 flex justify-center rounded-full items-center"
  on:click={copyToClipboard}
>
  {#if success}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-check"
      viewBox="0 0 16 16"
    >
      <path
        d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
      />
    </svg>
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-link-45deg"
      viewBox="0 0 16 16"
    >
      <path
        d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"
      />
      <path
        d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"
      />
    </svg>
  {/if}
</button>
