<script lang="ts">
  import { createDropdownMenu, melt } from '@melt-ui/svelte';
  import ArrowForward from './icons/ArrowForward.svelte';
  import ArrowDropDown from './icons/ArrowDropDown.svelte';
  import {blinkStore, state} from '../core/store'

  let blink = blinkStore.getInstance()

  let fileElem:any;
  function handleLoadExec(){
    if(!fileElem) return
    fileElem.click()
  }
  export const fileToArrayBuffer = (blob: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsArrayBuffer(blob)
    })
  }
  async function handleFileUpload(e){
    if (fileElem && fileElem.files.length) {
      const file = fileElem.files[0]
      let filedata = await fileToArrayBuffer(file);
      blink.loadElf(filedata);
      blinkStore.setUploadedElfName(file.name)
    }
  }


  const {
    elements: { trigger, menu, item, separator, },
    builders: { createSubmenu, },
    states: { open },
  } = createDropdownMenu({
    forceVisible: true,
    loop: true,
  });

  const {
    elements: { subMenu, subTrigger },
    states: { subOpen },
  } = createSubmenu();



  const personsArr = [
    'Hello world (Fasm)',
    'Hello world (Gnu AS)',
    'Functions (Fasm)',
    'Functions (Gnu AS)',
    'Shellcode (Fasm)',
    'Shellcode (Gnu AS)',
  ];
</script>


<input
  on:change={handleFileUpload}
  type="file" class="file" bind:this={fileElem} />

<button
  type="button"
  class="button button--secondary p-right-0 m-left-1"
  {...$trigger} use:trigger
  aria-label="File options"
>
  File
  <ArrowDropDown aria-hidden="true" focusable="false" />
</button>

{#if $open}
  <div {...$menu} use:menu >
    <div {...$item} use:item>Share</div>
    <div {...$subTrigger} use:subTrigger>
      Load example
      <div class="rightSlot">
        <ArrowForward style="" height="12px" width="12px"/>
      </div>
    </div>
    {#if $subOpen}
      <div {...$subMenu} use:subMenu >
        <div class="text">Examples</div>
          {#each personsArr as person}
            <div {...$item} use:item>{person}</div>
          {/each}
      </div>
    {/if}

    <div {...$separator} use:separator />
    <div {...$item} use:item on:m-click={handleLoadExec}>
      Load executable from your files
    </div>

  </div>
{/if}

<style>
.p-right-0{
  padding-right: 0;
}
.m-left-1{
  margin-left: 1rem;
}

.rightSlot {
  margin-left: auto;
  padding-left: 1.25rem;
}

.text {
  padding: .1rem .5rem;
  color: var(--theme-text-fg-disabled);
}

.file{
  display: none;
}
</style>
