<script>
import { onMount } from 'svelte';
import {blinkStore, manual_render} from '../core/store'

let blink = blinkStore.getInstance()

let elem;
let first_line = "";
let disassebly_fail = false

function getFirstLine(mem, startPtr, line_len){
  let str = ""
  for(let j=0; j<line_len; j++){
    let ch = mem.getUint8(startPtr + j);
    if(!ch) break;
    str += String.fromCharCode(ch);
  }
  return str;
}

function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
}

function scrollRip(elem, currline){
  let old = elem.querySelector(".current");
  if(old){
    old.classList.remove("current");
  }
  let n = elem.childNodes[currline];
  if(n){
    n.classList.add("current")
    if(!isElementInViewport(n)){
      n.scrollIntoView({behaviour:"smooth"});
    }
  }
}

function updateDis(){
  if(!blink.m)return;
  if(!elem)return;
  if(!(blink.state == blink.states.PROGRAM_RUNNING ||
    blink.state == blink.states.PROGRAM_STOPPED)){
    first_line = "";
    return;
  }

  if(blink.state == blink.states.PROGRAM_STOPPED &&
    blink.stopReason.loadFail){
    disassebly_fail = true;
    first_line = "";
    return;
  }

  if(blink.state == blink.states.PROGRAM_STOPPED){
    first_line = "";
  }

  let startPtr = blink.m.getPtr("dis__buffer");
  let lines = blink.m.getPtr("dis__max_lines");
  let line_len = blink.m.getPtr("dis__max_line_len");
  let current_line = blink.m.getPtr("dis__current_line");
  let mem = blink.m.memView;

  //handle disassembler fails
  //TODO: there is a bug where first_line = junk data
  //      after a rip jump to the stack
  if(current_line > lines){
    // console.log({
    //   startPtr,
    //   lines,
    //   line_len,
    //   current_line
    // })
    disassebly_fail = true;
    return;
  }
  else{
    disassebly_fail = false;
  }

  let current_first_line = getFirstLine(mem, startPtr, line_len)
  if(current_first_line == first_line){
    scrollRip(elem, current_line);
  }
  else{
    first_line = current_first_line;
    // -----------------
    // Redraw everything
    // -----------------
    let str = ''
    for(let i=0; i< lines; i++){
      str += "<tr>"
      for(let j=0; j<line_len; j++){
        let ch = mem.getUint8(startPtr+i*line_len + j);
        if(!ch) break;
        str += String.fromCharCode(ch);
      }
      str += "</tr>"
    }
    elem.innerHTML = str;
    scrollRip(elem, current_line);
  }
}

//rerender the disassembler only when the render event is dispatched
//we are using svelte's store as a dispatch api for our custom
//rendering shenaningans.
//this is faster because this specific component is 
//manually updating the DOM, bypassing the optimized svelte renderer
$: $manual_render && updateDis();

onMount(async () => {
  updateDis();
});


</script>

<div class="disass" class:fail={disassebly_fail} >
  {#if disassebly_fail}
    <div class="box">
      <p>Disassembly failed</p>
    </div>
  {/if}
  <table>
    <tbody bind:this={elem} >
      {#each Array(100) as _}
        <tr>
          <td class="addr">0000000</td>
          <td class="hex">00 00</td>
          <td class="str">add 
            <span class="brown">BYTE PTR [</span><span class="red">eax</span><span class="brown">]</span>,
            <span class="red">al</span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .fail{
    background-color: red;
    background: repeating-linear-gradient(
      -45deg,
      var(--theme-dis-fail-stripebg1),
      var(--theme-dis-fail-stripebg1) 2px,
      var(--theme-dis-fail-stripebg2) 2px,
      var(--theme-dis-fail-stripebg2) 16px
      );
    min-height: calc(100vh - 2rem);
  }
  .fail table{
    display: none;
  }
  .fail .box{
    background-color: var(--theme-dis-fail-boxbg);
    margin: 2rem;
    padding: 1rem;
    border: 1px solid var(--theme-dis-fail-boxborder);
  }
</style>
