<script language="ts">
  export let cancompile;

  import { createSelect, melt } from '@melt-ui/svelte';
  import ArrowDropDown from './icons/ArrowDropDown.svelte';
  import WizardHat from './icons/WizardHat.svelte';

  import { assemblers } from '../core/assemblers';
  import {blinkStore, state, mode} from '../core/store'

  let blink = blinkStore.getInstance()
  let assemblerModes = Object.values(assemblers)

  async function handle_compile(){
    blink.loadASM($blinkStore.editorContent_read);
    //analytics
    if(window.hasOwnProperty("goatcounter")){
      window.goatcounter.count({
          path:  function(p) { return 'click-compile-' + p },
          event: true,
      })
    }
  }

  function handle_assembler_change(e){
    // See the melt ui docs on change functions
    // https://www.melt-ui.com/docs/controlled#change-functions
    if(e.curr.value != e.next.value){
      blinkStore.setMode(e.next.value)
    }
    return e.next
  }

  function setMode(mode_id){
    selected.set({
        value: mode_id,
        label: assemblers[mode_id].display_name
    })
  }

  const {
    elements: { trigger, menu, option, group, groupLabel, label },
    states: { selected, selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
      forceVisible: true,
      onSelectedChange: handle_assembler_change,
      defaultSelected: {value: $mode, label: assemblers[$mode].display_name},
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
          <!-- <span>{mode.description}</span> -->
        </div>
      {/each}
    </div>
  {/if}


  <button class="btgroup__button"
    disabled={!cancompile} on:click={handle_compile}>
    <WizardHat aria-hidden="true" focusable="false" width="26px" height="26px" />
    compile</button>
</div>



