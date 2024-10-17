<script>
  export let isMobile = false;
  export let showEditor = false;

  import {blinkStore, state} from '../core/blinkSvelte'
  import {fetchBinaryFile} from '../core/utils'
  import { onMount } from 'svelte';
  // import demo1_url from '../assets/example.elf?url'
  // import demo1_url from '../assets/ld-new.elf?url'
  // import demo1_url from '../assets/demo_programs/argv.elf?url'
  import Logo from './Logo.svelte';

  let blink = blinkStore.getInstance()
  window['blink'] = blink;

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

  let canstart = false;
  let canstep = false;
  let cancompile = false;
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

  let showDebuggerRow = true;
  let showCompilerRow = true;
  $: showCompilerRow = (
    $blinkStore.state == blink.states.READY ||
    $blinkStore.state == blink.states.NOT_READY ||
    $blinkStore.state == blink.states.LINKING ||
    $blinkStore.state == blink.states.ASSEMBLING
  )
  $: showDebuggerRow = !showCompilerRow


  async function handle_compile(){
    // let filedata = await fetchBinaryFile(demo1_url)
    // blink.loadElf(filedata);
    blink.loadASM($blinkStore.asm);
  }

  function handle_back(){
    blink.setready()
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


{#if showDebuggerRow}
  <section class="debugger">
    <button on:click={handle_back}>

      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back to editor</button>
  </section>
  <section class="debugger">
    <div class="group">
      <button on:click={()=>blink.starti()}
        disabled={!canstart} > 
        <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-4 w-4 hover:bg-secondary-8 stroke-2 stroke-accent-1 ml-1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path></svg> -->
        starti 
      </button>
      <button on:click={()=>blink.run()}
        disabled={!canstart} > 
        <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-4 w-4 hover:bg-secondary-8 stroke-2 stroke-accent-1 ml-1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path></svg> -->
        run 
      </button>
    </div>

    <button class="debugbt" on:click={()=>blink.stepi()}
      disabled={!canstep}
    > stepi </button>
    <button class="debugbt" on:click={()=>blink.continue()}
      disabled={!canstep}
    > continue </button>
  </section>
{/if}

{#if showCompilerRow}
  <section class="editor">
    <div class="compilebt">
      <select bind:value={selected_compiler} on:change={handle_compiler_change}>
        {#each compiler_options as question}
          <option value={question}>
            {question.text}
          </option>
        {/each}
      </select>
      <button disabled={!cancompile} on:click={handle_compile}>
        <svg aria-hidden="true" focusable="false" version="1.0" xmlns="http://www.w3.org/2000/svg" width="606.7" height="664" viewBox="0 0 455 498"><path d="M147 103c-1 1-2 2-2 5 0 4 0 4-5 5-10 1-8 12 3 12 2 0 2 0 2 4l2 5c4 4 9 1 9-5 0-4 0-4 2-4 7 0 12-5 9-9-2-2-3-3-6-3-4 0-4 0-5-5 0-4-3-7-5-7l-4 2z"/><path d="M241 114c-19 3-37 13-50 29a386 386 0 0 0-65 146 147 147 0 0 0 153-3c8-5 9-7 9-8a1290 1290 0 0 0-18-70c-2-11-2-11 0-12 4-4 17-8 23-9 7 0 12 1 20 6 12 7 16 9 22 9 4 0 5 0 7-3 4-4 2-10-4-24-17-33-41-55-69-60-7-2-22-2-28-1z"/><path d="m75 149-2 8c-2 14-11 23-26 25-6 1-8 3-8 6 0 4 3 6 9 6 9 1 18 8 23 16l2 9c1 5 1 7 3 8 4 3 9 0 9-5 0-7 3-13 9-19s12-9 19-9c3 0 7-3 7-6s-2-5-9-6c-8-1-15-5-20-11-3-4-6-12-6-17l-2-4c-1-2-6-3-8-1z"/><path d="m312 230-1 6c0 3-1 4-5 4l-6 2c-3 5 0 9 6 10 4 1 5 1 5 5 0 5 2 6 5 6 4 0 6-2 6-7 0-4 0-4 3-4 5 0 7-1 8-4 2-4-1-7-7-8-4 0-4 0-4-4l-2-5c-1-2-6-3-8-1z"/><path d="M297 286a139 139 0 0 1-69 33 170 170 0 0 1-108-20l-9-5-32 9c-14 5-22 10-29 16-11 10-13 19-9 30 6 11 18 15 53 17 19 1 32 2 76 8l26 3 4-4c3-3 5-4 10-5l8-2 6-4c3-3 4-4 5-9 2-13 8-20 18-20s16 6 18 19c2 9 7 14 17 16l8 2c3 1 4 1 12-2 16-6 29-14 43-26 18-14 21-24 14-35-6-9-23-16-49-20-11-2-12-2-13-1z"/><path d="M244 346c-2 2-3 3-3 7-2 14-12 24-25 26-6 0-9 2-9 6s2 5 9 6c13 2 23 12 25 25 0 6 2 9 6 9 3 0 6-3 6-7 0-13 14-27 27-27 4 0 7-2 7-6 0-3-3-6-7-6s-13-3-17-7c-5-4-9-12-10-18 0-4-1-6-3-8s-3-2-6 0z"/></svg>
        compile</button>
    </div>

    <select bind:value={selected_demo} on:change={handle_demo_change}>
      {#each demo_options as question}
        <option value={question}>
          {question.text}
        </option>
      {/each}
    </select>
  </section>
{/if}

{#if showDebuggerRow}
  {#if $state == blink.states.PROGRAM_STOPPED}
    <p class="stopinfo">{blink.stopReason.details}</p>
  {/if}
{/if}


<style>
  /*
  TODO: clean this file, and integrate the colors with the theme.
  right now everything is hardcoded. everything is a test
  */

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


  section.editor,
  section.debugger{
    background-color: var(--theme-panel-controls-bg);
    border-bottom: 1px solid var(--theme-panel-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  button, select{
    border: 1px solid var(--color-gray-t);
    color: white;
    padding: .2rem 0.6rem;
    border-radius: 4px;
    background-color: #1c1e24;
    cursor: pointer;
    height: 2rem;
    display: flex;
    align-items: center;
  }
  button:disabled{
    color: gray;
  }

  button svg{
    stroke: white;
    height: 18px;
    width: 18px;
    margin-right: 3px;
  }

  section.debugger{
    border-top: 1px solid var(--theme-panel-border);
    justify-content: left;
  }

  .group{
    display: flex;
    border: 1px solid var(--color-gray-t);
    background-color: #1c1e24;
    border-radius: 4px;
  }
  .group button{
    display: flex;
    border: 1px solid transparent;
    align-items:center;
    background-color:transparent;
  }
  .group button svg{
    height: 18px;
    width: 18px;
    margin-right: 3px;
  }
  .group button:nth-child(1){
    border-right: 1px solid var(--color-gray-t);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .group button:nth-child(2){
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }


  .debugbt{
    margin-left: 1rem;
  }


  .compilebt{
    display: flex;
    border: 1px solid var(--color-gray-t);
    background-color: #1c1e24;
    border-radius: 4px;
    margin-right: 1rem;
  }
  .compilebt button{
    display: flex;
    border: 1px solid transparent;
    align-items:center;
    background-color:transparent;
    padding: 0 0.6rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .compilebt button svg{
    width: 25px;
    height: 25px;
    fill: white;
  }
  .compilebt button:disabled svg{
    fill: gray;
  }
  .compilebt select{
    border: 1px solid transparent;
    background-color:rgba(255,255,255,.1);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  section.editor select{
    background-color:rgba(255,255,255,.1);
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
