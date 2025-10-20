<script>
export let mobile;
export let showEditor;

import Logo from "./Logo.svelte";
import ArrowBack from "./icons/ArrowBack.svelte";
import ControlsFileMenu from "./ControlsFileMenu.svelte";
import { blinkStore, state } from "../core/store";
import ControlsCompilebt from "./ControlsCompilebt.svelte";

let blink = blinkStore.getInstance();

//-------------------
//render conditionals
//-------------------
let showControls = false;
let canstart = false;
let canstep = false;
let cancompile = false;

$: showControls = !mobile || !showEditor;

$: canstart =
	$blinkStore.state === blink.states.PROGRAM_LOADED ||
	$blinkStore.state === blink.states.PROGRAM_STOPPED;

$: canstep = $blinkStore.state === blink.states.PROGRAM_RUNNING;

$: cancompile =
	$blinkStore.state !== blink.states.NOT_READY &&
	$blinkStore.state !== blink.states.ASSEMBLING &&
	$blinkStore.state !== blink.states.LINKING;

$: showLoadingBar =
	$blinkStore.state === blink.states.NOT_READY ||
	$blinkStore.state === blink.states.ASSEMBLING ||
	$blinkStore.state === blink.states.LINKING;

//-------------------
//control handlers
//-------------------
function handle_back() {
	blink.setready();
	blinkStore.setUploadedElfName("");
}
</script>


<header>
  <a class="logo" href="https://x64.halb.it" aria-label="homepage">
    <Logo/>
  </a>
  <nav>
    <a href="https://x64.halb.it" target="_blank">About</a>
    <a href="https://github.com/robalb/x86-64-playground" target="_blank">Github</a>
  </nav>
</header>

<!--
   Controls are organized in two rows. Debugger row and Editor row.
   Their visibility and position changes with program state and window size,
   which makes everything pretty messsy to follow. Take this map, it will
   be useful:

   MOBILE:
   ----------
   Top row     (editor row is here. Always visible)
   ----------
   Bottom row  (debugger row is here. only visible when debugger is active)
   ----------

   DESKTOP:
   ----------
   Top row     (Debugger row is here. Always visible)
   ----------
   Bottom row  (Editor row is here. Always visible)
   ----------
 -->
<div class="controls" class:controls-inverted={!mobile} >

  <!-- Editor row -->
    <section class="controls__row controls__row-top">
      {#if (showEditor || !mobile) && !$blinkStore.uploadedElf}
      <ControlsCompilebt cancompile={cancompile} />
      <ControlsFileMenu />

      {:else}
        <button on:click={handle_back} class="button" >
          <ArrowBack aria-hidden="true" focusable="false" width="16px" height="16px"/>
          Back to editor
        </button>
      {/if}

    </section>
  <!-- /Editor row -->

  {#if showControls}
  <!-- Debugger row -->
    <section class="controls__row controls__row-bottom">

      <div class="btgroup">
        <button class="btgroup__button"
          on:click={()=>blink.starti()}
          disabled={!canstart} > 
          starti 
        </button>
        <button class="btgroup__button"
          on:click={()=>blink.run()}
          disabled={!canstart} > 
          run 
        </button>
      </div>

      <button class="button m-left-1" on:click={()=>blink.stepi()}
        disabled={!canstep}
      > stepi </button>
      <button class="button m-left-1" on:click={()=>blink.continue()}
        disabled={!canstep}
      > continue </button>

    </section>
  <!-- /Debugger row -->
  {/if}

  <div class="loadingbar">
    <div class="loadingbar__content"
      class:active={showLoadingBar}
    ></div>
  </div>


</div>


{#if mobile && !showEditor && $state == blink.states.PROGRAM_STOPPED}
  <p class="stopinfo">{blink.stopReason.details}</p>
{/if}


<style>

  /* -------------------- */
  /*        Header        */
  /* -------------------- */
  header{
    padding: .5rem;
    padding-left: 1rem;
    display: flex;
    align-items:center;
    justify-content:space-between;
    background-color: var(--theme-panel-controls-bg);
  }
  header .logo{
    height: 2.4rem;
    flex-shrink:0;
  }
  header nav{
    color: white;
    margin: 0 .5rem;
    flex-shrink:0;
  }
  header nav a {
    color: var(--color-gray-100);
    text-decoration: none;
    padding: .5rem;
    border-radius: 8px;
  }
  header nav a:hover{
    color: var(--color-gray-0);
    background-color: var(--color-gray-300);
  }


  /* -------------------- */
  /*      Controls        */
  /* -------------------- */
  .controls{
    background-color: var(--theme-panel-controls-bg);
    border-top: 1px solid var(--theme-panel-border);
    border-bottom: 1px solid var(--theme-panel-border);
    display: flex;
    flex-direction: column;
  }
  .controls-inverted{
    flex-direction: column-reverse;
  }
  .controls__row{
    display: flex;
    align-items: center;
    justify-content: left;
    padding: .5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .controls__row-top {
    justify-content: space-between;
  }
  :not(.controls-inverted) .controls__row-bottom {
    border-top: 1px solid var(--theme-panel-border);
  }
  .controls-inverted .controls__row-bottom {
    border-bottom: 1px solid var(--theme-panel-border);
  }


  /* -------------------- */
  /*      Loading bar     */
  /* -------------------- */
  .loadingbar{
    height: 0;
    width: 100%;
  }
  .loadingbar__content{
    position:relative;
    height: 1px;
    /* background: repeating-linear-gradient(to right, black 0%, #de4f17 50%, var(--color-gold-100) 100%); */
    background: repeating-linear-gradient(to right, black 0%, var(--color-gray-100) 50%, white 100%);
    width: 100%;
    background-size: 200% auto;
    background-position: 0 100%;
    animation: gradient 2s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    display:none;
  }
  .loadingbar__content.active{
    display:block;
  }

@keyframes gradient { 
  0%   { background-position: 0 0; }
  100% { background-position: -200% 0; }
}


  /* -------------------- */
  /*        Other         */
  /* -------------------- */


  .m-left-1{
    margin-left: 1rem;
  }

 .stopinfo{
    /*TODO: remove hardcoded colors, find proper design */
    background-color: rgb(224, 73, 35);
    background-color: rgb(96, 48, 36);
    color: white;
    border: 1px solid rgb(245, 127, 97);
    margin: 0;
    padding-left: 1rem;
  }

</style>
