<script>
import {blinkStore} from '../core/blinkSvelte'

let blink = blinkStore.getInstance()

let registers = [
  {name: "rax", color: "blue", str: "0x00"},
  {name: "rbx", color: "blue", str: "0x00"},
  {name: "rcx", color: "blue", str: "0x00"},
  {name: "rdx", color: "blue", str: "0x00"},

  {name: "rsp", color: "blue", str: "0x00"},
  {name: "rbp", color: "blue", str: "0x00"},
  {name: "rsi", color: "blue", str: "0x00"},
  {name: "rdi", color: "blue", str: "0x00"},
  {name: "rip", color: "blue", str: "0x00"},

  {name: "r8", color: "blue", str: "0x00"},
  {name: "r9", color: "blue", str: "0x00"},
  {name: "r10", color: "blue", str: "0x00"},
  {name: "r11", color: "blue", str: "0x00"},
  {name: "r12", color: "blue", str: "0x00"},
  {name: "r13", color: "blue", str: "0x00"},
  {name: "r14", color: "blue", str: "0x00"},
  {name: "r15", color: "blue", str: "0x00"},
  {name: "eflags", color: "blue", str: "[ ]"},
]

function updateRegisters(){
  if(!(blink.state == blink.states.PROGRAM_RUNNING ||
    blink.state == blink.states.PROGRAM_STOPPED)) return;

  let m = blink.m
  registers = [
{name: "rax", color: "blue", str: m.stringReadU64("rax")},
{name: "rbx", color: "blue", str: m.stringReadU64("rbx")},
{name: "rcx", color: "blue", str: m.stringReadU64("rcx")},
{name: "rdx", color: "blue", str: m.stringReadU64("rdx")},

{name: "rsp", color: "blue", str: m.stringReadU64("rsp")},
{name: "rbp", color: "blue", str: m.stringReadU64("rbp")},
{name: "rsi", color: "blue", str: m.stringReadU64("rsi")},
{name: "rdi", color: "blue", str: m.stringReadU64("rdi")},
{name: "rip", color: "blue", str: m.stringReadU64("rip")},

{name: "r8", color: "blue", str: m.stringReadU64("r8")},
{name: "r9", color: "blue", str: m.stringReadU64("r9")},
{name: "r10", color: "blue", str: m.stringReadU64("r10")},
{name: "r11", color: "blue", str: m.stringReadU64("r11")},
{name: "r12", color: "blue", str: m.stringReadU64("r12")},
{name: "r13", color: "blue", str: m.stringReadU64("r13")},
{name: "r14", color: "blue", str: m.stringReadU64("r14")},
{name: "r15", color: "blue", str: m.stringReadU64("r15")},
{name: "eflags", color: "blue", str: "[]"},
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
