
<script>
  import './styles/style.css';
  import './styles/light-theme.css';
  import './styles/dark-theme.css';

  import GdbEmbed from './components/GdbEmbed.svelte'
  import Registers from './components/Registers.svelte'

  import {blinkStore} from './core/blinkSvelte'
  import {fetchBinaryFile} from './core/utils'
  import demo1_url from './assets/example.elf?url'
  // import demo2_url from './assets/demo_programs/argv.elf?url'

  console.log(demo1_url)

  let blink = blinkStore.getInstance()
  window["blink"] = blink;

  async function handle_demo(){
    let filedata = await fetchBinaryFile(demo1_url)
    // console.log(filedata)
    blink.loadElf(filedata);
  }
  
  //handle terminal scroll
  let termref;
  function scroll(){
    if(termref){
      setTimeout(()=>{
        termref.scrollTop = termref.scrollHeight; // focus on bottom
      },1)
    }
  }
  $: $blinkStore.state && scroll()

</script>

<main>

<section class="controls">

<h1>Emulator Properties</h1>

<p><strong>State:</strong> {$blinkStore.state}</p>


  <button on:click={handle_demo}>load demo</button>
  <button on:click={()=>blink.starti()}
    disabled={$blinkStore.state != blink.states.PROGRAM_LOADED}
  > starti </button>
  <button on:click={()=>blink.stepi()}
    disabled={$blinkStore.state != blink.states.PROGRAM_RUNNING}
  > stepi </button>
  <button on:click={()=>blink.continue()}
    disabled={$blinkStore.state != blink.states.PROGRAM_RUNNING}
  > continue </button>

<div class="term" bind:this={termref}>
<p><strong>stdout:</strong><br/></p>
<code >{$blinkStore.term_buffer}</code>
{#if $blinkStore.state == blink.states.PROGRAM_STOPPED}
  <div class="stopInfo">
    <p>{blink.stopReason.details}</p>
  </div>
{/if}
</div>

</section>
<section class="regs">
    <Registers/>
</section>
  <!-- <GdbEmbed -->
  <!--     on:runClick={()=>console.log("run clicked")} -->
  <!--     on:resetClick={()=>console.log("reset clicked")} -->
  <!--     {data} -->
  <!--     showAscii={true} -->
  <!--     {startAddress} -->
  <!--     {registers} -->
  <!--     colorRegions={colorRegions} -->
  <!-- > -->
  <!-- push rax -->
  <!-- xor rbx rbx -->
  <!-- mov [rax] rbx -->
  <!-- </GdbEmbed> -->
</main>

<style>
  main{
    display: flex;
    flex-direction:row;
    width: 100%;
  }
  .controls{
    flex-grow:1;
  }
  .regs{
    max-width: 400px;
    border: 1px solid gray;
  }
  button{
    border: 1px solid gray;
    color: white;
    padding: .3rem;
  }
  button:disabled{
    color: gray;
  }
  .term{
    height: calc(100vh - 200px);
    border: 1px solid gray;
    overflow: auto;
    font-family: 'Lucida Console', Monaco, monospace;
    background-color: rgb(0,0,0,0.4);
    margin: .5rem;
    padding: .5rem;
  }
  .term code {
    background-color: transparent!important;
  }
  .term .stopInfo{
    background-color: darkred;
    color: white;
  }

</style>

