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
    if(i == current_line){
      str += "--- "
    }
    str += "<span>"
    for(let j=0; j<line_len; j++){
      let ch = mem.getUint8(startPtr+i*line_len + j);
      if(!ch) break;
      str += String.fromCharCode(ch);
    }
    str += "</span><br/>"
  }
  elem.innerHTML = str;
}

//rerender registers on machine step
$: $blinkStore.state && updateDis();
</script>

<div bind:this={elem}>
</div>
