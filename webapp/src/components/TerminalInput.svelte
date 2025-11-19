<script>
import { blinkStore, term_buffer, state } from "../core/store";

let blink = blinkStore.getInstance();
// If the program was paused because of a read syscall,
// the buffer size will be stored in rdx,per kernel ABI
// https://syscalls.mebeim.net/?table=x86/64/x64/latest
const bufsize = blink.m.readU64("rdx");

let stdin_str = "";

function lineEnter(){
    blink.readLineEnter(stdin_str)
    stdin_str = "";
}

</script>

<form class="stdin">
    <label>Enter your input (0/{bufsize} bytes):</label>
    <div class="stdin_row">
        <input type="text" bind:value={stdin_str}/>
        <button type="submit" class="button" on:click={lineEnter}>submit</button>
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
</style>

