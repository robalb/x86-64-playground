<script>
  import {blinkStore} from '../core/blinkSvelte'

  let blink = blinkStore.getInstance()

  //handle terminal scroll
  let termref;
  function scroll(){
    if(termref){
      setTimeout(()=>{
        termref.parentElement.scrollTop = termref.parentElement.scrollHeight; // focus on bottom
      },1)
    }
  }
  $: $blinkStore.state && scroll()

</script>

<div class="term" bind:this={termref}>
  <div class="term__codewrap">
    <code >{$blinkStore.term_buffer}</code>
  </div>
{#if $blinkStore.state == blink.states.PROGRAM_STOPPED}
    <p class="stopinfo">{blink.stopReason.details}</p>
{/if}
</div>


<style>
  .term{
    background-color: rgb(0,0,0,0.4);
    background-color: var(--theme-panel-bg);
    padding: .5rem;
    padding-left: 0;
    font-family: var(--code-font-family);
  }
  .term__codewrap{
    padding-left: 1rem;
    flex-grow: 1;
  }
  .term code {
    font-size: .9rem;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
  }
 .stopinfo{
    /*TODO al: customize colors, find proper design */
    background-color: rgb(224, 73, 35);
    background-color: rgb(96, 48, 36);
    color: white;
    border: 1px solid rgb(245, 127, 97);

    padding-left: 1rem;
  }
</style>
