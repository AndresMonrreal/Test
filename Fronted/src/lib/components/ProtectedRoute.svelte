<script>
  import { goto } from '$app/navigation'
  import { auth } from '$lib/stores/auth.svelte.js'
  import { onMount } from 'svelte'

  let { children } = $props()
  let ready = $state(false)

  onMount(() => {
    if (!auth.isLoggedIn) {
      goto('/login')
    } else {
      ready = true
    }
  })
</script>

{#if ready}
  {@render children()}
{/if}
