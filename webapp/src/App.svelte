<script lang="ts">
import './styles/style.css';
import DesktopLayout from './DesktopLayout.svelte';
import MobileLayout from './MobileLayout.svelte';

import {blinkStore, uploadedElf} from './core/store'
let blink = blinkStore.getInstance()

//make the blink wrapper accessible to the developer tools
window['blink'] = blink;

let innerWidth = 0; 
let breakpoints = {
  mobile: 640
}

let dragDecoration = false;
let timer = null;

function handleDragover(e){
  e.preventDefault();
  dragDecoration = true;
  clearTimeout(timer)
  timer = setTimeout(()=>{
    dragDecoration = false;
  }, 2000)
}

function handleDragLeave(e){
  e.preventDefault();
  clearTimeout(timer)
  timer = setTimeout(()=>{
    dragDecoration = false;
  }, 100)
}

export const fileToArrayBuffer = (blob: Blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsArrayBuffer(blob)
  })
}

async function handleDrop(e){
  e.preventDefault();
  console.log("drop")
  dragDecoration = false;
  //extract the first file dropped in the page
  let firstfile: any;
  if (e.dataTransfer.items) {
    firstfile = [...e.dataTransfer.items].find((item) => item.kind == "file")
  } else {
    firstfile = [...e.dataTransfer.files][0]
  }
  //execute the file in the blink emulator
  if (firstfile) {
    const file = firstfile.getAsFile();
    let filedata = await fileToArrayBuffer(file);
    blink.loadElf(filedata);
    blinkStore.setUploadedElfName(file.name)
  }

}

</script>

<!-- attach an action to the browser window -->
<svelte:window bind:innerWidth />

<div 
  on:dragover={handleDragover}
  on:drop={handleDrop}
  on:dragleave={handleDragLeave}
  role="region"
>
  {#if dragDecoration}
    <div class="drag">
      <div class="drag__box">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185 211.2"> 
        <path d="M24.8 190.2c-2.6-1.5-2.4 5.5-2.4-73V47h13.2c12.7 0 13.2 0 14.3-.6 1.9-1.2 2-1.5 2-15.8v-13h105.6l1.3.7c.7.4 1.5 1.2 1.9 2 .6 1 .6 3.2.6 84 0 81.8 0 83-.6 84.2-.5.8-1.1 1.4-2 1.9l-1.5.6H26.1zm75.2-35.7 2-5c.8-2.4 1.6-4.5 1.8-4.7.2-.2 1.8-1 3.6-1.7l3.1-1.4 1.6.7 4.5 2.1c1.6.8 3.3 1.4 3.8 1.4.9 0 1.7-.7 5.6-4.6 5.5-5.5 5.3-4.7 2.3-11l-2-4.2 1.4-3.5 1.4-3.6 2.6-.8 5-1.8c2.3-.9 2.5-1 2.8-2.1.3-.7.3-3.4.3-7-.1-5-.2-6-.7-6.4a30 30 0 0 0-5.2-2.2l-4.7-1.6-1.4-3.3-1.4-3.7c0-.3 1-2.4 2-4.7 1.2-2.4 2.2-4.6 2.2-5 0-.7-1.1-2-4.8-5.6-3-3-5-4.7-5.4-4.7-.3 0-2.6 1-5 2-2.4 1.2-4.5 2.1-4.8 2.1-.3 0-6.6-2.4-6.9-2.7l-1.7-4.7c-.9-2.5-1.8-4.8-2.1-5.1-.4-.5-1.2-.6-7.3-.6-6 0-6.8 0-7.2.6-.3.3-1.2 2.6-2.1 5.1l-1.8 4.7c-.3.3-6.5 2.7-6.8 2.7-.3 0-2.4-.9-4.8-2-2.4-1.2-4.7-2.1-5-2.1-1 0-10.2 9.2-10.2 10.2 0 .4 1 2.7 2.1 5a45 45 0 0 1 2 4.8c0 .2-.5 1.8-1.3 3.7L56.1 97l-4.7 1.6c-2.6 1-5 1.9-5.2 2.2-.5.5-.5.3-.5 9.7v4.6l1 .4c.4.3 2.8 1.2 5.1 2l4.4 1.5 1.4 3.5L59 126l-2 4.2c-3 6.3-3.2 5.5 2.3 11 3.9 4 4.7 4.6 5.5 4.6.6 0 3-.9 5.4-2l4.4-2.2L78 143c1.8.8 3.4 1.5 3.6 1.8.2.2 1 2.2 1.8 4.5 2 5.5 1.8 5.3 2.6 5.6.4.2 3.6.2 7.2.2 5.8 0 6.5-.1 6.9-.6zm-14.4-18A29.6 29.6 0 0 1 66 120.7a31.2 31.2 0 0 1-1-23.1 29.5 29.5 0 0 1 56 2.9c.5 2.3.7 3.5.7 7.7 0 4.1-.2 5.3-.8 7.4a29.4 29.4 0 0 1-35.4 20.9zM35.8 31.2a497 497 0 0 1 7.6-7.5l.1 7.5v7.5H28.3z" />
      </svg>
        <h2>Run your executable</h2>
        <p>Drop a statically-linked ELF here to
          execute it in a sandboxed environment</p>
      </div>
    </div>
  {/if}

  {#if innerWidth <= breakpoints.mobile}
    <MobileLayout/>
  {:else}
    <DesktopLayout/>
  {/if}
</div>

<style>
.drag{
  display: block;
  background-color: rgba(0,0,0,0.6);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  justify-content:center;
  align-items:center;
  animation: fadeIn .2s ease-in forwards;
}
.drag__box{
  padding: 2rem;
  margin: 2rem;
  background-color: var(--color-violet-100);
  border-radius: 10px;
  outline: 2px dashed rgba(255,255,255,.4);
  outline-offset: -10px;
  display: flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  color: var(--color-gray-100);
  max-width: 50%;
  text-align:center;
}
.drag__box h2, .drag__box p{
  margin: 0;
}

.drag__box svg{
  width: 80px;
  height: auto;
  fill: var(--color-gray-100);
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
