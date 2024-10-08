## TODO:

-[x] understand exit and signals, fix exit

-[x] clean files, and extra stuff that is not needed, even in blinkenlib.c

-[x] conceptually separate load and start.
  load should only write the elf in the vfs.
  start should call loadelf.
  running status should be checked against
  the m->running flags, not our own.

- [x] design good wasm-side api, write stuff in header file.

-[x] clean notes, paste design doc

### todo week 2

- integrate assembler
- test proper design for code editor and disassembler sharing the same panel
- first release with github pages


