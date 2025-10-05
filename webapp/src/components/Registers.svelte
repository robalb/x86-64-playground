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
		name: "IF",
		name_short: "I",
		name_long: "Interrupt Enable Flag",
		display: false,
		name_1: "EI",
		name_0: "DI",
		mask: 0x00000200,
		value: 0,
		updated: false,
		description:
			"1=Maskable interrupts enabled, 0=Disabled. Controls whether external interrupt requests are processed.",
	},
	{
		name: "DF",
		name_short: "D",
		name_long: "Direction Flag",
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
		name_1: "OV",
		name_0: "NV",
		mask: 0x00000800,
		value: 0,
		updated: false,
		description:
			"1=Overflow, 0=No overflow. Indicates that the signed result of an operation is too large to fit in the destination operand.",
	},
	{
		name: "IOPL",
		name_short: "IO",
		name_long: "I/O Privilege Level",
		display: false,
		name_1: "IOPL3",
		name_0: "IOPL0",
		mask: 0x00003000,
		value: 0,
		updated: false,
		description:
			"Two-bit field indicating the I/O privilege level required for I/O instructions. Only used in protected mode (bits 12–13).",
	},
	{
		name: "NT",
		name_short: "N",
		name_long: "Nested Task Flag",
		name_1: "NT",
		name_0: "NNT",
		mask: 0x00004000,
		value: 0,
		updated: false,
		description:
			"Controls the chaining of interrupts and exceptions in hardware task switching. Set when executing a nested task.",
	},
	{
		name: "RF",
		name_short: "R",
		name_long: "Resume Flag",
		name_1: "RF1",
		name_0: "RF0",
		mask: 0x00010000,
		value: 0,
		updated: false,
		description:
			"Used by the debugger to control the handling of debug exceptions. When set, disables breakpoints for the next instruction.",
	},
	{
		name: "VM",
		name_short: "V",
		name_long: "Virtual-8086 Mode Flag",
		name_1: "VM",
		name_0: "PM",
		mask: 0x00020000,
		value: 0,
		updated: false,
		description:
			"1=Virtual-8086 mode active. Indicates that the processor is executing in a virtual 8086 environment under protected mode.",
	},
	{
		name: "AC",
		name_short: "A",
		name_long: "Alignment Check Flag",
		name_1: "AC1",
		name_0: "AC0",
		mask: 0x00040000,
		value: 0,
		updated: false,
		description:
			"Controls alignment check exceptions in user mode. Set to enable alignment checking of memory references.",
	},
	{
		name: "VIF",
		name_short: "VI",
		name_long: "Virtual Interrupt Flag",
		name_1: "VIF1",
		name_0: "VIF0",
		mask: 0x00080000,
		value: 0,
		updated: false,
		description:
			"Virtual image of IF flag, used in virtual-8086 mode for interrupt virtualization.",
	},
	{
		name: "VIP",
		name_short: "VP",
		name_long: "Virtual Interrupt Pending",
		name_1: "VIP1",
		name_0: "VIP0",
		mask: 0x00100000,
		value: 0,
		updated: false,
		description:
			"Indicates that an interrupt is pending in virtual-8086 mode. Used with VIF for virtualization.",
	},
	{
		name: "ID",
		name_short: "ID",
		name_long: "ID Flag",
		name_1: "ID1",
		name_0: "ID0",
		mask: 0x00200000,
		value: 0,
		updated: false,
		description:
			"Allows the CPUID instruction to be executed when set. Software can toggle this bit to check for CPUID support.",
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
      <span class="name" class:updated={r.updated}>{r.name}</span> : 
      <span class="int">{r.str}</span>
    </p>
{/each}
    <br/>
    <p>
      <span class="name" class:updated={eflagsUpdated}>eflags</span> : 
      <span class="int">
            {eflagsStr}
        </span>
        [
{#each eflags as f}
    {#if f.value}
        <span class="flag" class:updated={f.updated}>{f.name_short}</span>
    {/if}
{/each}
        ]
    </p>
    <br/>

    <p>
      <span class="int">
            xmm0
      </span>

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
