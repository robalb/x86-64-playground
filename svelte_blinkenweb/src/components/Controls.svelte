<script>
  import {blinkStore} from '../core/blinkSvelte'
  import {fetchBinaryFile} from '../core/utils'
  // import demo1_url from '../assets/example.elf?url'
  import demo1_url from '../assets/ld-new.elf?url'
  // import demo1_url from '../assets/demo_programs/argv.elf?url'

  let blink = blinkStore.getInstance()
  window['blink'] = blink;

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

<section>
  <h2>X86-64 playground</h2>
  <p><strong>State:</strong> {$blinkStore.state}</p>
  <button disabled={!cancompile} on:click={handle_demo}>compile</button>
  <button on:click={()=>blink.starti()}
    disabled={!canstart}
  > starti </button>
  <button on:click={()=>blink.run()}
    disabled={!canstart}
  > run </button>
  <button on:click={()=>blink.stepi()}
    disabled={!canstep}
  > stepi </button>
  <button on:click={()=>blink.continue()}
    disabled={!canstep}
  > continue </button>
</section>


<style>
  /*
  TODO: al: make the whole design. This is a placeholder
  */
  section{
    padding: 3rem;
    padding-top: 2rem;
  }
  h2{
    color: var(--color-blue);
    font-family: var(--code-font-family);
    padding: 0;
    margin: 0;
  }
  button{
    border: 1px solid var(--color-gray-t);
    /* border: transparent; */
    color: white;
    padding: .2rem 0.6rem;
    border-radius: 4px;
    background-color: #1c1e24;
    cursor: pointer;
  }
  button:disabled{
    color: gray;
  }
</style>
