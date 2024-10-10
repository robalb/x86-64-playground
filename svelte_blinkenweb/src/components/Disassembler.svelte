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

  let str = '<tr'
  for(let i=0; i< lines; i++){
    if(i == current_line){
      str += ' class="current"'
    }
    str += "/> <td>"
    for(let j=0; j<line_len; j++){
      let ch = mem.getUint8(startPtr+i*line_len + j);
      if(!ch) break;
      str += String.fromCharCode(ch);
    }
    str += "</td><tr/>"
  }
  elem.innerHTML = str;
}

//rerender registers on machine step
$: $blinkStore.state && updateDis();
</script>

<table bind:this={elem}>
</table>

<!-- <div class="disass"> -->
<!--   <p> -->
<!--     <span class="addr">004000b0</span> -->
<!--     <span class="hex" >90</span> -->
<!--     <span class="str" >nop</span> -->
<!--   </p> -->
<!--   <p> -->
<!--     <span class="addr">004000b0</span> -->
<!--     <span class="hex" >54</span> -->
<!--     <span class="str" >push rsp</span> -->
<!--   </p> -->
<!--   <p> -->
<!--     <span class="addr">004000b1</span> -->
<!--     <span class="hex" >ba 14 00 00 00</span> -->
<!--     <span class="str" >mov $0x14,%edx%esi</span> -->
<!--   </p> -->
<!-- </div> -->
<div class="disass2">
<table >
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
.disass2{
    padding: .5rem;
    padding-left: 0;
    font-family: var(--code-font-family);
    font-size: .9rem;
    overflow-x: auto;
  }
/* Remove default styles from the table */
table, th, td {
  border: none;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
}

table {
  width: 100%;
}

tr.current{
  border: 1px solid gray;
  background-color: rgba(255,255,255,0.1);
}

th, td {
  text-align: left;
}

td {
    padding-right: 1rem;
  }

.addr{
  color: var(--theme-disaddr-fg);
  width: 100px; /* Adjust as needed */
  text-align:right;
  padding-left: 1rem;
  }
.hex {
  color: var(--theme-dishex-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px; /* Adjust as needed */
}
.str{
  white-space: nowrap;
  color: white;
}

span.red{
  color: #ffa657;
}
span.brown{
  color: #ff7b72;
}
span.blue{
  color: #a5d6ff;
  color: #79c0ff;
}


</style>
