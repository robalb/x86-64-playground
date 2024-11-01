<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte'
    import Close from './icons/Close.svelte';
  const {
    elements: { trigger, portalled, overlay, content, title, description, close },
    states: { open }
  } = createDialog()
</script>

<button {...$trigger} use:trigger
  type="button"
  class="button button--secondary"
> Share </button>

{#if $open}
  <div {...$portalled} use:portalled>
    <div {...$overlay} use:overlay />
    <div {...$content} use:content>
      <h2 {...$title} use:title>Dialog Title</h2>
      <p {...$description} use:description>
        Dialog description
        Loreem ipsum dolom sit amlete as etiscindur 
        Loreem ipsum dolom sit amlete as etiscindur 
        Loreem ipsum dolom sit amlete as etiscindur 
        Loreem ipsum dolom sit amlete as etiscindur 
        Loreem ipsum dolom sit amlete as etiscindur 
        Loreem ipsum dolom sit amlete as etiscindur 
        Loreem ipsum dolom sit amlete as etiscindur 
        Loreem ipsum dolom sit amlete as etiscindur 
      </p>
      <button {...$close} use:close> <Close style="fill:var(--theme-primary);"/> </button>
    </div>
  </div>
{/if}
