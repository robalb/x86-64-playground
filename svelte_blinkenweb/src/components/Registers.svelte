<script>
import {blinkStore} from '../core/blinkSvelte'

let blink = blinkStore.getInstance()

let registers = [
  {name: "rip_cs", color: "blue", str: "0x00"},
  {name: "rip", color: "blue", str: "0x00"},
  {name: "rsp", color: "blue", str: "0x00"},
  {name: "rbp", color: "blue", str: "0x00"},
  {name: "rax", color: "blue", str: "0x00"},
]

function updateRegisters(){
  if(blink.state == blink.states.NOT_READY || blink.state == blink.states.READY){
    return
  }

  let m = blink.m
  let rip = m.readU64("rip") + m.readU64("cs__base");
  let rip_s = rip.toString(16)
  registers = [
    {name: "rip_cs", color: "blue", str: rip_s},
    {name: "rip", color: "blue", str: m.stringReadU64("rip")},
    {name: "rsp", color: "blue", str: m.stringReadU64("rsp")},
    {name: "rbp", color: "blue", str: m.stringReadU64("rbp")},
    {name: "rax", color: "blue", str: m.stringReadU64("rax")},
  ]
}

//rerender registers on machine step
$: $blinkStore.state && updateRegisters();

</script>

<h1>registers</h1>

<section class="registers">
{#each registers as r}
  <a><span class={"name " + r.color}>{r.name}</span>  : <span class="int">{r.str}</span> </a><br/>
{/each}

</section>


<style>
.registers {
  padding: 1rem;
  --drag-line-color: transparent;
  --controls-bg-color: #1c1e24;
  --controls-fg-color: #d0d5df;
  --controls-border-color: rgba(255, 255, 255, .4); /*light*/
  --controls-border-color: rgba(255, 255, 255, .2); /*dark*/
  --panel-bg-color: #20232a;
  --panel-fg-color: white;

  --reg-blue-color: #6ab0f3;
  --reg-red-color: #fca369;
  --reg-hexdump-color: #818a9d;
  --reg-int-color: white;
}

.registers {
  & .name {
    color: var(--reg-blue-color);
  }
  & .blue{
    color: var(--reg-blue-color);
  }
  & .red{
    color: var(--reg-red-color);
  }
  & .hex {
    display: none;
    color: var(--reg-hexdump-color);
  }
  & .int {
    color: var(--reg-int-color);
  }
}

</style>
