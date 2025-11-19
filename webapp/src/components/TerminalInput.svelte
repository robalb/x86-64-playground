<script>
import { blinkStore, term_buffer, state } from "../core/store";

let blink = blinkStore.getInstance();
// If the program was paused because of a read syscall,
// the buffer size will be stored in rdx,per kernel ABI
// https://syscalls.mebeim.net/?table=x86/64/x64/latest
const bufsize = Number(blink.m.readU64("rdx"));

let stdin_str = "";
let nonascii = false

$: nonascii = stdin_str.length > 0 && currentBytes > stdin_str.length;
//TODO: handle non-ascii char detection

// Use TextEncoder API to calculate bytes in real-time
const encoder = new TextEncoder();
$: currentBytes = encoder.encode(stdin_str).length;
$: bytesLeft = bufsize - currentBytes;
$: isOverLimit = currentBytes > bufsize;

function lineEnter(e){
    e.preventDefault();
    blink.readLineEnter(stdin_str)
    stdin_str = "";
}

</script>

<form class="stdin" on:submit={lineEnter}>
    {#if nonascii}
        <label class="warning">You entered non-ascii characters. The terminal will transform them into multiple utf-8 encoded bytes</label>
    {/if}
    {#if  bufsize==0}
        <label class="warning">The read size (rdx) is set to 0. The program will not actually read your input</label>
    {:else if isOverLimit}
        <label class="warning">The read size (rdx) is set to {bufsize}. The last {currentBytes - bufsize} bytes of your input will be ignored</label>
    {/if}
    <label>Enter your input ({currentBytes}/{bufsize} bytes):</label>
    <div class="stdin_row">
        <input type="text" bind:value={stdin_str}/>
        <button type="submit" class="button" >submit</button>
    </div>
</form>

<style>
.stdin{
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--code-font-family);
    background-color: #6ab0f3;
    background-color: #6ab0f35c;
    background-color: #33486c;
    background-color: #3e4c64;
    border: 1px solid var(--color-blue);
    color: var(--theme-exitcodeinfo-fg);
    padding-left: 1rem;
    font-size: 16px;
    margin: 16px 0;
}
.stdin .stdin_row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 2px 0 6px 0;
    padding-right: 1rem;
}
.stdin input{
    font-family: var(--code-font-family);
    font-size: 16px;
    width: 100%;
    height: 2rem;
    border-radius: 4px 0px 0px 4px;
    padding-left: 6px;
    border: 1px solid white;
}
.stdin input:focus-visible{
    outline: 3px solid var(--theme-focus);
}

label {
    margin: 8px 0;
}

 label.warning{
    background-color: var(--theme-exitcodeinfo-bg);
    color: var(--theme-exitcodeinfo-fg);
    border: 1px solid var(--theme-exitcodeinfo-border);
    margin: 0;
    margin: 6px 1rem 0 0;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 14px;

  background-color: #daaa62;
  color: #171515;
  border: 1px solid rgb(0, 0, 0);

  }
</style>

