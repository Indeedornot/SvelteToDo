<script>
  import { onMount } from "svelte";
  import FaMoon from 'svelte-icons/fa/FaMoon.svelte';
  import FaSun from 'svelte-icons/fa/FaSun.svelte';

  export let className = "";

  onMount(() => {
    //prefers scheme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
      darkMode = true;
    } else {
      document.body.classList.remove("dark");
      darkMode = false;
    }
  });

  function toggleTheme(){
    document.body.classList.toggle("dark");
    darkMode = !darkMode;
  }

  let darkMode = false;
</script>

<div {...$$restProps} class={"text-font-primary " + className} on:click={toggleTheme}>
  {#if darkMode}
    <FaSun />
  {:else}
    <FaMoon />
  {/if}
</div>

