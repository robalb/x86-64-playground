<script language="ts">
  export let cancompile;

  import { createSelect, melt } from '@melt-ui/svelte';
  import ArrowDropDown from './icons/ArrowDropDown.svelte';
  import WizardHat from './icons/WizardHat.svelte';

  import { assemblers } from '../core/assemblers';
  import {blinkStore, state, mode} from '../core/store'

  let blink = blinkStore.getInstance()
  let assemblerModes = Object.values(assemblers)
  function handle_assembler_change(e){
    console.log("change:")
    console.log(e)
    if(e.next.value){
      blinkStore.setMode(e.next.value)
    }
    return e.next
  }
  function setMode(e){
    console.log("mode change in store: asdasdasd")
    console.log(e)
  }

  // let selectModeStore = {
  //   subscribe: mode.subscribe,
  //   set: function(){
  //     console.log("aaa")
  //   }
  // }

  const {
    elements: { trigger, menu, option, group, groupLabel, label },
    states: { selected, selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
      forceVisible: true,
      onSelectedChange: handle_assembler_change,
      defaultSelected: $mode,
      positioning: {
        placement: 'bottom',
        fitViewport: true,
        sameWidth: true,
      },
    });

$: $mode && setMode($mode)

</script>


<div class="btgroup">
  <button class="btgroup__button btgroup__button--select"
    {...$trigger} use:trigger
    aria-label="Assembler"
    >
    {$selectedLabel || $mode}
    <ArrowDropDown aria-hidden="true" focusable="false" />
  </button>
  {#if $open}
    <div
      {...$menu} use:menu
    >
      {#each assemblerModes as mode}
        <div
          {...$option({ value: mode.id, label: mode.display_name})} use:option
        >
          {mode.display_name}
        </div>
      {/each}
    </div>
  {/if}


  <button class="btgroup__button"
    disabled={!cancompile} on:click={()=>{}}>
    <WizardHat aria-hidden="true" focusable="false" width="26px" height="26px" />
    compile</button>
</div>



