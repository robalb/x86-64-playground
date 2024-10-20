<script lang="ts">
import { PaneGroup, Pane, PaneResizer } from "paneforge";
import Hexdump from './components/Hexdump.svelte';
import Editor from './components/Editor.svelte';
import Registers from './components/Registers.svelte';
import Disassembler from './components/Disassembler.svelte';
import Terminal from './components/Terminal.svelte';
import Controls from './components/Controls.svelte';
import {TabsAutomatic} from './core/ARIA'

import {blinkStore, state} from './core/blinkSvelte'

let blink = blinkStore.getInstance()

// Initialize tablist
function initTabARIA(node){
  console.log(node)
  let t =  new TabsAutomatic(node);
  return{
    update(){
    },
    destroy: ()=>{
      t.release();
    }
  }
}

let showEditor = true;
$: showEditor = (
  $state == blink.states.READY ||
  $state == blink.states.NOT_READY ||
  $state == blink.states.ASSEMBLING ||
  $state == blink.states.LINKING
)

</script>

<div class="pane">
  <div class="controls">
    <Controls mobile={true} showEditor={showEditor}/>
  </div>
  <div class="tabs">
  {#if showEditor}
      <Editor/>
  {:else}
    <div id="tabpanel-1" role="tabpanel" tabindex="0" aria-labelledby="tab-1">
      <Disassembler />
    </div>
    <div id="tabpanel-2" role="tabpanel" tabindex="0" aria-labelledby="tab-2" class="is-hidden">
      <Terminal/>
    </div>
    <div id="tabpanel-3" role="tabpanel" tabindex="0" aria-labelledby="tab-3" class="is-hidden">
      <Registers/>
    </div>
    <div id="tabpanel-4" role="tabpanel" tabindex="0" aria-labelledby="tab-4" class="is-hidden">
      <Hexdump/>
    </div>

    <div use:initTabARIA role="tablist" aria-label="debugger panels" class="automatic">
      <button id="tab-1" type="button" role="tab" aria-selected="true" aria-controls="tabpanel-1">
        <span class="focus">Disassembly</span>
      </button>
      <button id="tab-2" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-2" tabindex="-1">
        <span class="focus">Terminal</span>
      </button>
      <button id="tab-3" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-3" tabindex="-1">
        <span class="focus">Registers</span>
      </button>
      <button id="tab-4" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-4" tabindex="-1">
        <span class="focus">Memory</span>
      </button>
    </div>
  {/if}
  </div>
      
</div>

<style>
  .pane{
    display: flex; 
    justify-content: center; 
    flex-direction:column;
    align-items: stretch;
    height: 100vh; 
    height: 100dvh; 
    /* border: 1px solid var(--theme-panel-border); */
  }

  .controls{
    /* overflow: auto;  */
    /* height: 100%; */
    /*this is cool the first time you see it, then super annoying */
    /* scroll-behavior: smooth; */
  }

  .tabs {
    height: 100%;
    overflow: auto;
  }

  [role="tablist"] {
    width: 100%;
    display: flex;
    background-color: var(--theme-panel-bg);
    position: fixed;
    bottom: 0;
  }

  [role="tab"],
  [role="tab"]:focus,
  [role="tab"]:hover {
    display:flex;
    align-items:center;
    justify-content:center;
    /* display: inline-block; */
    /* z-index: 2; */
    margin: 0;
    outline: none;
    overflow: hidden;
    text-align: left;
    cursor: pointer;

    /* font-weight: bold; */
    /* max-width: 22%; */
    /* top: 2px; */
    /* margin-top: 4px; */
    /* padding: 3px 3px 4px; */
    /* border: 1px solid hsl(219deg 1% 72%); */
    /* border-bottom: 2px solid hsl(219deg 1% 72%); */
    /* border-radius: 5px 5px 0 0; */
    /* background: hsl(220deg 20% 94%); */

    background-color: transparent;
    height: 3rem;
    flex-grow: 1;

    font-size: 1.1rem;
    border: 1px solid var(--theme-panel-border);
    border-right: 0px;
    border-bottom: 6px solid red;
  }

  [role="tab"]:first-child{
    border-left: 0;
  }

  [role="tab"][aria-selected="true"] {
    /* padding: 2px 2px 4px; */
    /* margin-top: 0; */
    /* border-width: 2px; */
    /* border-top-width: 6px; */
    /* border-bottom-color: hsl(220deg 43% 99%); */
    /* background: hsl(220deg 43% 99%); */
    border-top-color: transparent;
    background-color: var(--theme-bg);
    border-bottom: 6px solid var(--theme-focus);
  }

  [role="tab"][aria-selected="false"] {
    border-bottom: 6px solid transparent;
  }

  [role="tab"] span.focus {
    display: inline-block;
    margin: 2px;
    padding: 4px 6px;
  }

  [role="tab"]:hover span.focus,
  [role="tab"]:focus span.focus,
  [role="tab"]:active span.focus {
    /* padding: 2px 4px; */
    /* border: 2px solid var(--theme-focus); */
    /* border-radius: 3px; */
  }

  [role="tabpanel"] {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding-bottom: 3rem;
  }

  [role="tabpanel"].is-hidden {
    display: none;
  }

  [role="tabpanel"] p {
    margin: 0;
  }

</style>


