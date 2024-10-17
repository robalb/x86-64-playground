<script lang="ts">
import './styles/style.css';
import DesktopLayout from './DesktopLayout.svelte';

let innerWidth = 0; 
$: isMobile = innerWidth <= 640; 

</script>

<!-- attach an action to the browser window -->
<svelte:window bind:innerWidth />

{#if isMobile}
  <h1>mobile layout</h1>
{:else}
  <DesktopLayout/>
{/if}

