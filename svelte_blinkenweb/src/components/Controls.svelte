<script>
  export let mobile;
  export let showEditor;

  import Logo from './Logo.svelte';
  import { onMount } from 'svelte';
  import {blinkStore, state} from '../core/blinkSvelte'
  import {fetchBinaryFile} from '../core/utils'
    import ControlsEditor from './ControlsEditor.svelte';
    import WizardHat from './icons/WizardHat.svelte';
    import ArrowBack from './icons/ArrowBack.svelte';
  // import demo1_url from '../assets/example.elf?url'
  // import demo1_url from '../assets/ld-new.elf?url'
  // import demo1_url from '../assets/demo_programs/argv.elf?url'

  let blink = blinkStore.getInstance()
  window['blink'] = blink;

  //render conditionals
  let showControls = false;
  let canstart = false;
  let canstep = false;
  let cancompile = false;
  $: showControls = (
    !mobile || !showEditor
  )
  $: canstart = (
    $blinkStore.state == blink.states.PROGRAM_LOADED ||
    $blinkStore.state == blink.states.PROGRAM_STOPPED
  )
  $: canstep = (
    $blinkStore.state == blink.states.PROGRAM_RUNNING
  )
  $: cancompile = (
    $blinkStore.state != blink.states.NOT_READY &&
    $blinkStore.state != blink.states.ASSEMBLING &&
    $blinkStore.state != blink.states.LINKING
  )

  //temporary control state logic
	let compiler_options = [
		{ id: 1, text: `Fasm`, uri: 'fasm' },
		{ id: 2, text: `Gnu AS`, uri: 'gnu' },
	];
  let demo_options = [
		{ id: 1, text: `Hello World`, uri: 'hello_world' },
		{ id: 2, text: `Functions`, uri:'functions' }
  ]

	let selected_compiler;
  let selected_demo;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    let compiler_opt = compiler_options.find(c => c.uri == params.get('compiler'));
    if(compiler_opt) selected_compiler = compiler_opt;
    let demo_opt = demo_options.find(c => c.uri == params.get('demo'));
    if(demo_opt) selected_demo = demo_opt;
  });

  function handle_compiler_change(){
    window.location.search = `?compiler=${selected_compiler.uri}&demo=${selected_demo.uri}`;
  }

  function handle_demo_change(e){
    window.location.search = `?compiler=${selected_compiler.uri}&demo=${selected_demo.uri}`;
  }


  //control handlers

  async function handle_compile(){
    // let filedata = await fetchBinaryFile(demo1_url)
    // blink.loadElf(filedata);
    blink.loadASM($blinkStore.asm);
  }

  function handle_back(){
    blink.setready()
    blinkStore.setUploadedElfName("")
  }

</script>


<header>
  <a class="logo" href="/" aria-label="homepage">
    <Logo/>
  </a>
  <nav>
    <a href="https://github.com/robalb/x86-64-playground/blob/master/docs/about.md" target="_blank">About</a>
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
  <section class="controls__row controls__row-top">
    {#if (showEditor || !mobile) && !$blinkStore.uploadedElf}
      <div class="btgroup">
        <select class="btgroup__button btgroup__button--select"
          bind:value={selected_compiler} on:change={handle_compiler_change}>
          {#each compiler_options as question}
            <option value={question}>
              {question.text}
            </option>
          {/each}
        </select>
        <button class="btgroup__button"
          disabled={!cancompile} on:click={handle_compile}>
          <WizardHat aria-hidden="true" focusable="false" width="26px" height="26px" />
          compile</button>
      </div>

      <ControlsEditor />

    {:else}
      <button on:click={handle_back} class="button" >
        <ArrowBack aria-hidden="true" focusable="false" width="16px" height="16px"/>
        Back to editor
      </button>
    {/if}

  </section>

  {#if showControls}
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
  {/if}
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
  /*      Buttons&c       */
  /* -------------------- */
  /* button, select{ */
  /*   border: 1px solid var(--color-gray-t); */
  /*   color: white; */
  /*   padding: .2rem 0.6rem; */
  /*   border-radius: 4px; */
  /*   background-color: transparent; */
  /*   cursor: pointer; */
  /*   height: 2rem; */
  /*   display: flex; */
  /*   align-items: center; */
  /* } */
  /* button:disabled{ */
  /*   color: gray; */
  /* } */
  /* button:not(:disabled):active{ */
  /*   border: 1px solid rgba(255,255,255,0.7); */

  /* } */

  /* button svg{ */
  /*   stroke: white; */
  /*   fill: white; */
  /*   height: 18px; */
  /*   width: 18px; */
  /*   margin-right: 3px; */
  /* } */
  /* button:disabled svg{ */
  /*   fill: gray; */
  /*   stroke: gray; */
  /* } */

  /* .group{ */
  /*   display: flex; */
  /*   border: 1px solid var(--color-gray-t); */
  /*   background-color: transparent; */
  /*   border-radius: 4px; */
  /* } */
  /* .group button{ */
  /*   display: flex; */
  /*   border: 1px solid transparent; */
  /* } */
  /* .group button:nth-child(1){ */
  /*   border-right: 1px solid var(--color-gray-t); */
  /*   border-top-right-radius: 0; */
  /*   border-bottom-right-radius: 0; */
  /* } */
  /* .group button:nth-child(2){ */
  /*   border-top-left-radius: 0; */
  /*   border-bottom-left-radius: 0; */
  /* } */
  /* .group button:active:not(:disabled):nth-child(1){/* I hereby challenge you to write a line with more selectors */
  /*   border-right: 1px solid rgba(255,255,255,0.7); */
  /* } */


  /* .compilebt{ */
  /*   display: flex; */
  /*   border: 1px solid var(--color-gray-t); */
  /*   background-color: #1c1e24; */
  /*   border-radius: 4px; */
  /*   margin-right: 1rem; */
  /* } */
  /* .compilebt button{ */
  /*   display: flex; */
  /*   border: 1px solid transparent; */
  /*   align-items:center; */
  /*   background-color:transparent; */
  /*   padding: 0 0.6rem; */
  /*   border-top-left-radius: 0; */
  /*   border-bottom-left-radius: 0; */
  /* } */
  /* .compilebt button svg{ */
  /*   width: 25px; */
  /*   height: 25px; */
  /*   stroke: white; */
  /* } */
  /* .compilebt select{ */
  /*   border: 1px solid transparent; */
  /*   background-color:rgba(255,255,255,.1); */
  /*   border-top-right-radius: 0; */
  /*   border-bottom-right-radius: 0; */
  /* } */

  .m-left-1{
    margin-left: 1rem;
  }
  .fill-none {
    fill: none;
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
