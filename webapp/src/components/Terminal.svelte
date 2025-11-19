<script>
import { blinkStore, term_buffer, state } from "../core/store";

let blink = blinkStore.getInstance();
let termref;
let stdin_str = "";

function scroll() {
	if (termref != null) {
		requestAnimationFrame(() => {
			termref.scrollTop = termref.scrollHeight;
		});
	}
}

function lineEnter(){
    blink.readLineEnter(stdin_str)
    stdin_str = "";
}
// Scroll the terminal wen the program state
// or the terminal buffer change
$: ($term_buffer || $state) && scroll();
</script>

<div class="term" bind:this={termref}>
  <div class="term__codewrap">
    <code >{$term_buffer}</code>
  </div>
{#if $state == blink.states.PROGRAM_STOPPED}
    <p class="exitcodeinfo">{blink.stopReason.details}</p>
{:else if $state == blink.states.PROGRAM_READLINE_PAUSE}
    <div class="stdin">
        <label>Enter your input:</label>
        <div class="stdin_row">
            <input type="text" bind:value={stdin_str}/>
            <button on:click={lineEnter}>submit</button>
        </div>
    </div>
{/if}
</div>


<style>
  .term{
    background-color: rgb(0,0,0,0.4);
    background-color: var(--theme-panel-bg);
    padding: .5rem;
    padding-left: 0;
    font-family: var(--code-font-family);
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
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
 .exitcodeinfo{
    background-color: var(--theme-exitcodeinfo-bg);
    color: var(--theme-exitcodeinfo-fg);
    border: 1px solid var(--theme-exitcodeinfo-border);

    padding-left: 1rem;
  }

  .stdin{
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--code-font-family);
    background-color: #6ab0f3;
    background-color: #6ab0f35c;
    border: 1px solid var(--color-blue);
    color: var(--theme-exitcodeinfo-fg);
    padding-left: 1rem;
    font-size: 16px;
    margin: 16px 0;
  }
  .stdin.stdin_row {
      display: flex;
  }
  .stdin input{
    font-family: var(--code-font-family);
    font-size: 16px;

    margin: 2px 0 6px 0;

    border: 1px solid white;
  }
  .stdin input:focus-visible{
      outline: 3px solid var(--theme-focus);
  }
</style>
