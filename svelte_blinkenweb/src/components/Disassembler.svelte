<script>
import {blinkStore} from '../core/blinkSvelte'

let blink = blinkStore.getInstance()

let elem;

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

  let str = ''
  for(let i=0; i< lines; i++){
    str += '<tr '
    if(i == current_line){
      str += ' class="current"'
    }
    str += ">"
    for(let j=0; j<line_len; j++){
      let ch = mem.getUint8(startPtr+i*line_len + j);
      if(!ch) break;
      str += String.fromCharCode(ch);
    }
    str += "<tr/>"
  }
  elem.innerHTML = str;
}

//rerender registers on machine step
$: $blinkStore.state && updateDis();
</script>

<div class="disass">
<table bind:this={elem}>
  <tr>
    <td class="addr">004000b0</td>
    <td class="hex">90</td>
    <td class="str">nop</td>
  </tr>
  <tr >
    <td class="addr">004000b0</td>
    <td class="hex">54</td>
    <td class="str">push rsp</td>
  </tr>
  <tr class="current">
    <td class="addr">00400000</td>
    <td class="hex">ba 14 00 00 00</td>
    <td class="str">mov <span class="blue">0x14</span>, <span class="red">edx</span></td>
  </tr>
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
  <tr>
    <td class="addr">004000b1</td>
    <td class="hex">ba 14 00 00 00</td>
    <td class="str">mov $0x14, %edx%esi # a very long line, dunno why, probably the text</td>
  </tr>
</table>
</div>

<style>

</style>
