import fasm_1_73_32 from "../assets/assemblers/fasm.1.73.32.elf?url";
import gnu_as_2_43_50 from "../assets/assemblers/gnu-as.2.43.50.elf?url";
import gnu_ld_2_43_50 from "../assets/assemblers/gnu-ld.2.43.50.elf?url";
import nasm_3_00 from "../assets/assemblers/nasm.3.00.elf?url";

export interface Binary {
	fileurl: string;
	commands: string;
}

export interface DiagnosticLine {
	line: number;
	error: string;
}

export type DiagnosticsParser = (
	assemblerLogs: string,
) => Array<DiagnosticLine>;

export interface AssemblerMode {
	id: string;
	display_name: string;
	description: string;
	//a function that will parse assembler errors in a structured format
	//that the code editor will understand
	diagnosticsParser?: DiagnosticsParser;
	binaries: {
		assembler: Binary;
		// Linker is optional. If absent, we assume that
		// the assembler will directly generate an executable
		linker?: Binary;
	};
}

export type Assemblers_key = keyof typeof assemblers;

/**
 * All the assemblers that can be selected from the UI,
 *
 * Every option provides the compile commands and the
 * binaries required to assemble a program into an ELF
 *
 * When adding a new assembler, make sure you follow these conventions:
 * - The input for an assembler must be the file /assembly.s
 * - the output from the linker must be the file /program
 * - If the linker program is not defined we assume that the assembler
 *   directly generates the ELF /program
 */
export const assemblers: Record<string, AssemblerMode> = {
	GNU_trunk: {
		id: "GNU_trunk",
		display_name: "GNU as",
		description:
			"GNU as + GNU ld, version 2.43.50. Compiled as a static MUSL binary",
		diagnosticsParser: gnu_diagnostics,
		binaries: {
			assembler: {
				fileurl: gnu_as_2_43_50,
				commands: "/assembler /assembly.s -o /program.o",
			},
			linker: {
				fileurl: gnu_ld_2_43_50,
				commands: "/linker /program.o -o /program",
			},
		},
	},
	FASM_trunk: {
		id: "FASM_trunk",
		display_name: "Fasm",
		description: "Flat assembler version 1.73.32",
		diagnosticsParser: fasm_diagnostics,
		binaries: {
			assembler: {
				fileurl: fasm_1_73_32,
				commands: "/assembler /assembly.s /program",
			},
		},
	},
	NASM_trunk: {
		id: "NASM_trunk",
		display_name: "nasm",
		description:
			"NASM 3.00 + GNU ld v2.43.50. Both compiled as a static MUSL binary",
		diagnosticsParser: null,
		binaries: {
			assembler: {
				fileurl: nasm_3_00,
				commands: "/assembler -felf64 /assembly.s -o /program.o",
			},
			linker: {
				fileurl: gnu_ld_2_43_50,
				commands: "/linker /program.o -o /program",
			},
		},
	},
} as const;

/**
 * Assembler Diagnostic parser for the GNU Assembler
 * Chatgpt-generated from unit tests
 */
export function gnu_diagnostics(str: string): Array<DiagnosticLine> {
	const diagnostics = [];
	const lines = str.split("\n");
	// Regex to capture lines with a format like: "/assembly.s:<line_number>: <error_message>"
	const regex = /\/assembly\.s:(\d+): (Error: .+)/;
	for (const line of lines) {
		const match = line.match(regex);
		if (match) {
			diagnostics.push({
				line: parseInt(match[1], 10),
				error: match[2],
			});
		}
	}
	return diagnostics;
}

/**
 * Assembler Diagnostic parser for the Fasm Assembler
 * Chatgpt-generated from unit tests
 */
export function fasm_diagnostics(str: string): Array<DiagnosticLine> {
	// Regex to match line number and error message in the input string
	const lineRegex = /\/assembly\.s \[(\d+)\]:/;
	const errorRegex = /error: .+/;

	const diagnostics = [];
	const lines = str.split("\n");
	let lineNum = null;
	let errorMsg = null;
	// Loop through each line to find line number and error message
	for (const line of lines) {
		const lineMatch = line.match(lineRegex);
		const errorMatch = line.match(errorRegex);
		// Capture line number if found
		if (lineMatch) {
			lineNum = parseInt(lineMatch[1]);
		}
		// Capture error message if found
		if (errorMatch) {
			errorMsg = errorMatch[0];
			// Add to diagnostics array if both line number and error message are found
			if (lineNum !== null && errorMsg !== null) {
				diagnostics.push({ line: lineNum, error: errorMsg });
				lineNum = null;
				errorMsg = null;
			}
		}
	}
	return diagnostics;
}
