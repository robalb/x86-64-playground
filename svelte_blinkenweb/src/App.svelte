<script lang="ts">
import './styles/style.css';
import DesktopLayout from './DesktopLayout.svelte';
import MobileLayout from './MobileLayout.svelte';

let innerWidth = 0; 
let breakpoints = {
  mobile: 640
}

</script>

<!-- attach an action to the browser window -->
<svelte:window bind:innerWidth />

{#if innerWidth <= breakpoints.mobile}
  <MobileLayout/>
{:else}
  <DesktopLayout/>
{/if}

