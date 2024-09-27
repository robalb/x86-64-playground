
<script>
  import './styles/style.css';
  import './styles/light-theme.css';
  import './styles/dark-theme.css';

  import GdbEmbed from './components/GdbEmbed.svelte'

  import {blinkStore} from './core/blinkSvelte'
  import {fetchBinaryFile} from './core/utils'
  import demo1_url from './assets/example.elf?url'
  console.log(demo1_url)

  let blink = blinkStore.getInstance()
  window["blink"] = blink;

  async function handle_demo(){
    let filedata = await fetchBinaryFile(demo1_url)
    // console.log(filedata)
    blink.loadElf(filedata);
  }
  
  let data = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]
  let registers = [
    {color: "blue", name: "rip", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "rax", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "rbx", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "rcx", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "rdx", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "rdi", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "red", name: "rsi", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "rsp", bytes: [0x50, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00], preview: "hex_int"},
    {color: "blue", name: "rbp", bytes: [0x50, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00], preview: "hex_int"},
    {color: "blue", name: "r8 ", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "r9 ", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "r10", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "r11", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "r12", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "r13", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "r14", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
    {color: "blue", name: "r15", bytes: [0,0,0,0,0,0,0,0], preview: "hex_int"},
  ]
  
  let colorRegions = {
    blue: [0,1,2,3,4,5,6,7]
  }
  let startAddress = 0
  

  //handle terminal scroll
  let termref;
  function scroll(){
    if(termref){
      termref.scrollTop = termref.scrollHeight; // focus on bottom
    }
  }
  $: $blinkStore.state && scroll()

</script>

<main>

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
</div>

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
  button{
    border: 1px solid gray;
    color: white;
    padding: .3rem;
  }
  button:disabled{
    color: gray;
  }
  .term{
    height: 800px;
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

</style>

