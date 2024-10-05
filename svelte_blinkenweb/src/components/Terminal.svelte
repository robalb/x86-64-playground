<script>
  import {blinkStore} from '../core/blinkSvelte'

  let blink = blinkStore.getInstance()

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

<div class="term" bind:this={termref}>
<code >{$blinkStore.term_buffer}</code>
{#if $blinkStore.state == blink.states.PROGRAM_STOPPED}
  <div class="stopInfo">
    <p>{blink.stopReason.details}</p>
  </div>
{/if}
</div>


<style>
  .term{
    /* height: calc(100vh - 200px); */
    overflow: auto;
    background-color: rgb(0,0,0,0.4);
    padding: .5rem;
    padding-left: 1rem;
  }
  .term code {
    font-family: var(--code-font-family);
    /* background-color: transparent; */
  }
  .term .stopInfo{
    background-color: darkred;
    color: white;
  }
</style>
