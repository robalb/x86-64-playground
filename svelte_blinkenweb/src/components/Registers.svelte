<script>
import {blinkStore} from '../core/blinkSvelte'

let blink = blinkStore.getInstance()

let registers = [
  {name: "rax", updated: false, str: "0x00"},
  {name: "rbx", updated: false, str: "0x00"},
  {name: "rcx", updated: false, str: "0x00"},
  {name: "rdx", updated: false, str: "0x00"},

  {name: "rsp", updated: false, str: "0x00"},
  {name: "rbp", updated: false, str: "0x00"},
  {name: "rsi", updated: false, str: "0x00"},
  {name: "rdi", updated: false, str: "0x00"},
  {name: "rip", updated: true, str: "0x00"},

  {name: "r8 ", updated: false, str: "0x00"},
  {name: "r9 ", updated: false, str: "0x00"},
  {name: "r10", updated: false, str: "0x00"},
  {name: "r11", updated: false, str: "0x00"},
  {name: "r12", updated: false, str: "0x00"},
  {name: "r13", updated: false, str: "0x00"},
  {name: "r14", updated: false, str: "0x00"},
  {name: "r15", updated: false, str: "0x00"},
  {name: "eflags", color: "blue", str: "[ ]"},
]

function updateRegisters(){
  if(!(blink.state == blink.states.PROGRAM_RUNNING ||
    blink.state == blink.states.PROGRAM_STOPPED)) return;

  let m = blink.m
  registers = [
{name: "rax", updated: false, str: m.stringReadU64("rax")},
{name: "rbx", updated: false, str: m.stringReadU64("rbx")},
{name: "rcx", updated: false, str: m.stringReadU64("rcx")},
{name: "rdx", updated: false, str: m.stringReadU64("rdx")},

{name: "rsp", updated: false, str: m.stringReadU64("rsp")},
{name: "rbp", updated: false, str: m.stringReadU64("rbp")},
{name: "rsi", updated: false, str: m.stringReadU64("rsi")},
{name: "rdi", updated: false, str: m.stringReadU64("rdi")},
{name: "rip", updated: false, str: m.stringReadU64("rip")},

{name: "r8 ",  updated: false, str: m.stringReadU64("r8")},
{name: "r9 ",  updated: false, str: m.stringReadU64("r9")},
{name: "r10", updated: false, str: m.stringReadU64("r10")},
{name: "r11", updated: false, str: m.stringReadU64("r11")},
{name: "r12", updated: false, str: m.stringReadU64("r12")},
{name: "r13", updated: false, str: m.stringReadU64("r13")},
{name: "r14", updated: false, str: m.stringReadU64("r14")},
{name: "r15", updated: false, str: m.stringReadU64("r15")},
{name: "eflags", color: "blue", str: "[]"},
  ]
}

//rerender registers on machine step
$: $blinkStore.render && updateRegisters();

</script>

<section class="registers">
{#each registers as r}
    <p>
      <span class="name" class:updated={r.updated}>{r.name}</span> : 
      <span class="int">{r.str}</span>
    </p>
{/each}

</section>


<style>
.registers {
  padding: .5rem;
  padding-left: 1rem;

  font-family: var(--code-font-family);
  font-size: .9rem;
}
.registers p{
  margin: 0;
}

.registers {
  & .name {
    color: var(--theme-reg-name);
    white-space: pre;
  }
  & .updated{
    color: var(--theme-reg-name-updated);
  }
  & .int {
    color: var(--theme-reg-value-int);
  }
}

</style>
