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

let eflagsStr = "0x0";
let eflagsBytes = BigInt(0x0);
let eflagsUpdated = false;
let eflags = [
	{
		name: "CF",
		name_short: "C",
		name_long: "Carry Flag",
		name_gef: "carry",
		name_1: "CY",
		name_0: "NC",
		mask: 0x00000001,
		value: 0,
		updated: false,
		description:
			"1=Carry, 0=No carry. Indicates an arithmetic carry or borrow out of the most significant bit in arithmetic operations.",
	},
	{
		name: "PF",
		name_short: "P",
		name_long: "Parity Flag",
		name_gef: "parity",
		name_1: "PE",
		name_0: "PO",
		mask: 0x00000004,
		value: 0,
		updated: false,
		description:
			"1=Even, 0=Odd. Set if the least significant byte of the result contains an even number of set bits.",
	},
	{
		name: "AF",
		name_short: "A",
		name_long: "Auxiliary Carry Flag",
		name_gef: "auxiliary",
		name_1: "AC",
		name_0: "NA",
		mask: 0x00000010,
		value: 0,
		updated: false,
		description:
			"1=Auxiliary carry, 0=No auxiliary carry. Indicates a carry or borrow between bit 3 and bit 4 of the lower nibble (used in BCD arithmetic).",
	},
	{
		name: "ZF",
		name_short: "Z",
		name_long: "Zero Flag",
		name_gef: "zero",
		name_1: "ZR",
		name_0: "NZ",
		mask: 0x00000040,
		value: 0,
		updated: false,
		description:
			"1=Zero, 0=Nonzero. Set if the result of an arithmetic or logical operation is zero.",
	},
	{
		name: "SF",
		name_short: "S",
		name_long: "Sign Flag",
		name_gef: "sign",
		name_1: "NG",
		name_0: "PL",
		mask: 0x00000080,
		value: 0,
		updated: false,
		description:
			"1=Negative, 0=Positive. Reflects the sign (most significant bit) of the result of the last arithmetic operation.",
	},
	{
		name: "TF",
		name_short: "T",
		name_long: "Trap Flag",
		name_gef: "trap",
		display: false,
		name_1: "ST",
		name_0: "NT",
		mask: 0x00000100,
		value: 0,
		updated: false,
		description:
			"1=Enable single-step mode for debugging; generates a debug exception after each instruction.",
	},
	{
		name: "DF",
		name_short: "D",
		name_long: "Direction Flag",
		name_gef: "direction",
		name_1: "DN",
		name_0: "UP",
		mask: 0x00000400,
		value: 0,
		updated: false,
		description:
			"1=Decrement, 0=Increment. Controls string operations; if set, string instructions process data from high addresses to low addresses.",
	},
	{
		name: "OF",
		name_short: "O",
		name_long: "Overflow Flag",
		name_gef: "overflow",
		name_1: "OV",
		name_0: "NV",
		mask: 0x00000800,
		value: 0,
		updated: false,
		description:
			"1=Overflow, 0=No overflow. Indicates that the signed result of an operation is too large to fit in the destination operand.",
	},
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

	eflagsStr = blink.m.stringReadU64("flags");
	const new_eflagsBytes = blink.m.readU64("flags");
	if (new_eflagsBytes === eflagsBytes) {
		eflagsUpdated = false;
	} else {
		eflagsUpdated = true;
		eflagsBytes = new_eflagsBytes;
	}
	for (const flag of eflags) {
		const new_value = (BigInt(flag.mask) & eflagsBytes) > 0;
		if (new_value === flag.value) {
			flag.updated = false;
		} else {
			flag.updated = true;
			flag.value = new_value;
		}
	}
	//force svelte rerendering
	eflags = eflags;
}

//rerender registers on machine step
$: $manual_render && updateRegisters();
</script>

<section class="registers">
{#each registers as r}
    <p>
      <span class="name infotooltip" tabindex="0" aria-describedby="info-tooltip" class:updated={r.updated}>{r.name}</span> : 
      <span class="int">{r.str}</span>
    </p>
{/each}
    <br/>
    <p>
      <span class="name" class:updated={eflagsUpdated}>eflags</span> : 
      <span class="int">
            {eflagsStr}
        </span>
        <br/>
        [
{#each eflags as f}
    {#if f.value}
        <span class="flag infotooltip" tabindex="0" aria-describedby="info-tooltip" class:updated={f.updated} 
                    title={f.name_long + ": " + f.description}
                >{f.name_gef}</span>
    {/if}
            <span></span>
{/each}
        ]
    </p>
    <br/>

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
  & .infotooltip:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}

</style>
