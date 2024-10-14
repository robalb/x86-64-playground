<script>
import {blinkStore} from '../core/blinkSvelte'

let blink = blinkStore.getInstance()

let elem;
let first_line = "";

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
      console.log("not visible")
      n.scrollIntoView({behaviour:"smooth"});
    }
  }
}

function updateDis(){
  if(!blink.m)return;
  if(!elem)return;
  if(!(blink.state == blink.states.PROGRAM_RUNNING ||
    blink.state == blink.states.PROGRAM_STOPPED)) return;

  let startPtr = blink.m.getPtr("dis__buffer");
  let lines = blink.m.getPtr("dis__max_lines");
  let line_len = blink.m.getPtr("dis__max_line_len");
  let current_line = blink.m.getPtr("dis__current_line");
  let mem = blink.m.memView;
  let current_first_line = getFirstLine(mem, startPtr, line_len)
  if(current_first_line == first_line){
    scrollRip(elem, current_line);
  }
  else{
    first_line = current_first_line;
    /* ================= */
    /* Redraw everything */
    /* ================= */
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

//rerender registers on machine step
$: $blinkStore.state && updateDis();


</script>

<div class="disass" >
<table >
    <tbody bind:this={elem}>
      {#each Array(100) as _, i}
        <tr >
          <td class="addr">004000{i}</td>
          <td class="hex">ba 14 00 00 00</td>
          <td class="str">mov <span class="blue">0x14</span>, <span class="red">edx</span></td>
        </tr>
        <tr>
          <td class="addr">004000{i}</td>
          <td class="hex">ba 14 00 00 00</td>
          <td class="str">mov <span class="blue">0x14</span>, <span class="brown">[</span><span class="red">rdx</span><span class="brown">]</span></td>
        </tr>
      {/each}
    </tbody>
</table>
</div>

<style>

</style>
