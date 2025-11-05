<script>
import { blinkStore, term_buffer, state } from "../core/store";

let blink = blinkStore.getInstance();
let termref;

function scroll() {
	if (termref != null) {
		requestAnimationFrame(() => {
			termref.scrollTop = termref.scrollHeight;
		});
	}
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
</style>
