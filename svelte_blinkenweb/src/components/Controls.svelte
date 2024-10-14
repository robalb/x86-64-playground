<script>
  import {blinkStore} from '../core/blinkSvelte'
  import {fetchBinaryFile} from '../core/utils'
  // import demo1_url from '../assets/example.elf?url'
  // import demo1_url from '../assets/ld-new.elf?url'
  import demo1_url from '../assets/demo_programs/argv.elf?url'
  import Logo from './Logo.svelte';

  let blink = blinkStore.getInstance()
  window['blink'] = blink;

	let compiler_options = [
		{ id: 1, text: `Gnu AS` },
		{ id: 2, text: `Fasm` },
	];
  let demo_options = [
		{ id: 1, text: `Hello World` },
		{ id: 2, text: `Functions` }
  ]

	let selected_compiler;
  let selected_demo;

	let compiler_answer = '';
  let demo_answer = ' ';

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

  async function handle_demo(){
    // let filedata = await fetchBinaryFile(demo1_url)
    // blink.loadElf(filedata);
    blink.loadASM($blinkStore.asm);
  }

</script>
  <header>
    <div class="logo">
    <Logo/>
    </div>
    <!-- <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="606.7" height="664" viewBox="0 0 455 498"><path d="M147 103c-1 1-2 2-2 5 0 4 0 4-5 5-10 1-8 12 3 12 2 0 2 0 2 4l2 5c4 4 9 1 9-5 0-4 0-4 2-4 7 0 12-5 9-9-2-2-3-3-6-3-4 0-4 0-5-5 0-4-3-7-5-7l-4 2z"/><path d="M241 114c-19 3-37 13-50 29a386 386 0 0 0-65 146 147 147 0 0 0 153-3c8-5 9-7 9-8a1290 1290 0 0 0-18-70c-2-11-2-11 0-12 4-4 17-8 23-9 7 0 12 1 20 6 12 7 16 9 22 9 4 0 5 0 7-3 4-4 2-10-4-24-17-33-41-55-69-60-7-2-22-2-28-1z"/><path d="m75 149-2 8c-2 14-11 23-26 25-6 1-8 3-8 6 0 4 3 6 9 6 9 1 18 8 23 16l2 9c1 5 1 7 3 8 4 3 9 0 9-5 0-7 3-13 9-19s12-9 19-9c3 0 7-3 7-6s-2-5-9-6c-8-1-15-5-20-11-3-4-6-12-6-17l-2-4c-1-2-6-3-8-1z"/><path d="m312 230-1 6c0 3-1 4-5 4l-6 2c-3 5 0 9 6 10 4 1 5 1 5 5 0 5 2 6 5 6 4 0 6-2 6-7 0-4 0-4 3-4 5 0 7-1 8-4 2-4-1-7-7-8-4 0-4 0-4-4l-2-5c-1-2-6-3-8-1z"/><path d="M297 286a139 139 0 0 1-69 33 170 170 0 0 1-108-20l-9-5-32 9c-14 5-22 10-29 16-11 10-13 19-9 30 6 11 18 15 53 17 19 1 32 2 76 8l26 3 4-4c3-3 5-4 10-5l8-2 6-4c3-3 4-4 5-9 2-13 8-20 18-20s16 6 18 19c2 9 7 14 17 16l8 2c3 1 4 1 12-2 16-6 29-14 43-26 18-14 21-24 14-35-6-9-23-16-49-20-11-2-12-2-13-1z"/><path d="M244 346c-2 2-3 3-3 7-2 14-12 24-25 26-6 0-9 2-9 6s2 5 9 6c13 2 23 12 25 25 0 6 2 9 6 9 3 0 6-3 6-7 0-13 14-27 27-27 4 0 7-2 7-6 0-3-3-6-7-6s-13-3-17-7c-5-4-9-12-10-18 0-4-1-6-3-8s-3-2-6 0z"/></svg> -->
    <!-- <h2>x86-64<br/>playground</h2> -->
  <a href="#">about</a>
  <a href="#">settings</a>
  </header>
    <!-- <p><strong>State:</strong> {$blinkStore.state}</p> -->

<section class="runner">

    <div class="group">
      <button on:click={()=>blink.starti()}
        disabled={!canstart}
      > starti </button>
      <button on:click={()=>blink.run()}
        disabled={!canstart}
      > run 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-4 w-4 hover:bg-secondary-8 stroke-2 stroke-accent-1 ml-1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path></svg>
      </button>
    </div>

    <button class="debugbt" on:click={()=>blink.stepi()}
      disabled={!canstep}
    > stepi </button>
    <button class="debugbt" on:click={()=>blink.continue()}
      disabled={!canstep}
    > continue </button>

</section>

<section class="editor">
  <div class="compilebt">
    <select bind:value={selected_compiler} on:change={() => (compiler_answer = '')}>
      {#each compiler_options as question}
        <option value={question}>
          {question.text}
        </option>
      {/each}
    </select>
    <button disabled={!cancompile} on:click={handle_demo}>
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="606.7" height="664" viewBox="0 0 455 498"><path d="M147 103c-1 1-2 2-2 5 0 4 0 4-5 5-10 1-8 12 3 12 2 0 2 0 2 4l2 5c4 4 9 1 9-5 0-4 0-4 2-4 7 0 12-5 9-9-2-2-3-3-6-3-4 0-4 0-5-5 0-4-3-7-5-7l-4 2z"/><path d="M241 114c-19 3-37 13-50 29a386 386 0 0 0-65 146 147 147 0 0 0 153-3c8-5 9-7 9-8a1290 1290 0 0 0-18-70c-2-11-2-11 0-12 4-4 17-8 23-9 7 0 12 1 20 6 12 7 16 9 22 9 4 0 5 0 7-3 4-4 2-10-4-24-17-33-41-55-69-60-7-2-22-2-28-1z"/><path d="m75 149-2 8c-2 14-11 23-26 25-6 1-8 3-8 6 0 4 3 6 9 6 9 1 18 8 23 16l2 9c1 5 1 7 3 8 4 3 9 0 9-5 0-7 3-13 9-19s12-9 19-9c3 0 7-3 7-6s-2-5-9-6c-8-1-15-5-20-11-3-4-6-12-6-17l-2-4c-1-2-6-3-8-1z"/><path d="m312 230-1 6c0 3-1 4-5 4l-6 2c-3 5 0 9 6 10 4 1 5 1 5 5 0 5 2 6 5 6 4 0 6-2 6-7 0-4 0-4 3-4 5 0 7-1 8-4 2-4-1-7-7-8-4 0-4 0-4-4l-2-5c-1-2-6-3-8-1z"/><path d="M297 286a139 139 0 0 1-69 33 170 170 0 0 1-108-20l-9-5-32 9c-14 5-22 10-29 16-11 10-13 19-9 30 6 11 18 15 53 17 19 1 32 2 76 8l26 3 4-4c3-3 5-4 10-5l8-2 6-4c3-3 4-4 5-9 2-13 8-20 18-20s16 6 18 19c2 9 7 14 17 16l8 2c3 1 4 1 12-2 16-6 29-14 43-26 18-14 21-24 14-35-6-9-23-16-49-20-11-2-12-2-13-1z"/><path d="M244 346c-2 2-3 3-3 7-2 14-12 24-25 26-6 0-9 2-9 6s2 5 9 6c13 2 23 12 25 25 0 6 2 9 6 9 3 0 6-3 6-7 0-13 14-27 27-27 4 0 7-2 7-6 0-3-3-6-7-6s-13-3-17-7c-5-4-9-12-10-18 0-4-1-6-3-8s-3-2-6 0z"/></svg>
      compile</button>
  </div>

  <select bind:value={selected_demo} on:change={() => (demo_answer = '')}>
    {#each demo_options as question}
      <option value={question}>
        {question.text}
      </option>
    {/each}
  </select>


</section>


<style>
@import url('https://fonts.googleapis.com/css2?family=Neuton&display=swap');
  /*
  TODO: al: make the whole design. This is a placeholder
  */

  header{
    padding: .5rem;
    padding-left: 1rem;
    display: flex;
    align-items:center;
    /* background-color: white; */
    /* background-color: var(--color-blue); */
    color: #1c1e24;
  }
  header .logo{
    height: 2.4rem;
    flex-shrink:0;
  }

  h2{
    color: var(--color-blue);
    color: black;
    color: #1c1e24;
    font-family: var(--code-font-family);
    padding: 0;
    margin: 0;
    line-height: 1.3rem;
    font-size: 1.3rem;
    font-family: "Neuton", serif;
    font-weight: 400;
  }
  a{
    margin-left: 1rem;
    color: #1c1e24;
  }


  section.editor,
  section.runner{
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
    /* border: transparent; */
    color: white;
    padding: .2rem 0.6rem;
    border-radius: 4px;
    background-color: #1c1e24;
    cursor: pointer;
    height: 2rem;
  }
  button:disabled{
    color: gray;
  }

  section.runner{
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
    border-radius: 0;
  }
  .group button:nth-child(1){
    border-right: 1px solid var(--color-gray-t);
  }


  .debugbt{
    margin-left: 1rem;
  }


  .compilebt{
    display: flex;
    border: 1px solid var(--color-gray-t);
    background-color: #1c1e24;
    border-radius: 4px;
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

</style>
