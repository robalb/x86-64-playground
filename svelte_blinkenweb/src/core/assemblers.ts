import fasm_1_73_32 from '../assets/assemblers/fasm.1.73.32.elf?url'
import gnu_as_2_43_50 from '../assets/assemblers/gnu-as.2.43.50.elf?url'
import gnu_ld_2_43_50 from '../assets/assemblers/gnu-ld.2.43.50.elf?url'

export interface Binary {
  fileurl: string;
  commands: string;
}

export interface AssemblerMode {
  display_name: string;
  description: string;
  binaries: {
    assembler: Binary;
    // Linker is optional. If absent, we assume that
    // the assembler will directly generate an executable
    linker?: Binary;
  }
}

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
  'GNU_trunk': {
    display_name: 'GNU as',
    description: 'GNU as + GNU ld, version 2.43.50. Compiled as a static MUSL binary',
    binaries: {
      assembler: {
        fileurl: gnu_as_2_43_50,
        commands: '/assembler /assembly.s -o /program.o'
      },
      linker: {
        fileurl: gnu_ld_2_43_50,
        commands: '/linker /program.o -o /program'
      },
    },
  },
  'FASM_trunk': {
    display_name: 'Fasm',
    description: 'Flat assembler version 1.73.32',
    binaries: {
      assembler: {
        fileurl: fasm_1_73_32,
        commands: '/assembler /assembly.s /program',
      },
    },
  }
} as const;



