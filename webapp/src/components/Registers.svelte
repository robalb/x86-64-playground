<script>
import { blinkStore, manual_render } from "../core/store";

const blink = blinkStore.getInstance();

let registers = [
	{ name: "rax", updated: false, str: "0x00" },
	{ name: "rbx", updated: false, str: "0x00" },
	{ name: "rcx", updated: false, str: "0x00" },
	{ name: "rdx", updated: false, str: "0x00" },

	{ name: "rsp", updated: false, str: "0x00" },
	{ name: "rbp", updated: false, str: "0x00" },
	{ name: "rsi", updated: false, str: "0x00" },
	{ name: "rdi", updated: false, str: "0x00" },

	{ name: "r8 ", updated: false, str: "0x00" },
	{ name: "r9 ", updated: false, str: "0x00" },
	{ name: "r10", updated: false, str: "0x00" },
	{ name: "r11", updated: false, str: "0x00" },
	{ name: "r12", updated: false, str: "0x00" },
	{ name: "r13", updated: false, str: "0x00" },
	{ name: "r14", updated: false, str: "0x00" },
	{ name: "r15", updated: false, str: "0x00" },
	{ name: "rip", updated: true, str: "0x00" },
];

function updateRegisters() {
	if (
		!(
			blink.state === blink.states.PROGRAM_RUNNING ||
			blink.state === blink.states.PROGRAM_STOPPED
		)
	)
		return;

	for (const reg of registers) {
		const new_str = blink.m.stringReadU64(reg.name.trim());
		if (new_str === reg.str) {
			reg.updated = false;
		} else {
			reg.updated = true;
			reg.str = new_str;
		}
	}
	//force svelte rendering
	registers = registers;
}

//rerender registers on machine step
$: $manual_render && updateRegisters();
</script>

<section class="registers">
{#each registers as r}
    <p>
      <span class="name" class:updated={r.updated}>{r.name}</span> : 
      <span class="int">{r.str}</span>
    </p>
{/each}
    <p>
      <span class="name" class:updated={false}>eflags</span> : 
      <span class="int">[]</span>
    </p>

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
