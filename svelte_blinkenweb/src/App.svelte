<script lang="ts">
import './styles/style.css';
import DesktopLayout from './DesktopLayout.svelte';
import MobileLayout from './MobileLayout.svelte';

import {blinkStore, uploadedElf} from './core/blinkSvelte'
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

  let firstfile: any;
  if (e.dataTransfer.items) {
    firstfile = [...e.dataTransfer.items].find((item) => item.kind == "file")
  } else {
    firstfile = [...e.dataTransfer.files][0]
  }
  if (firstfile) {
    const file = firstfile.getAsFile();
    let filedata = await fileToArrayBuffer(file);
    blink.loadElf(filedata);
    blink.starti()
    blinkStore.setUploadedElfName(file.name)
  }

}

</script>

<!-- attach an action to the browser window -->
<svelte:window bind:innerWidth />

<div 
  on:dragover={handleDragover}
  on:drop={handleDrop}
  role="region"
>
{#if dragDecoration}
  <div class="drag">
      <div class="drag__box">
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
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
