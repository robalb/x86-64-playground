import type { Assemblers_key } from "./assemblers";

const syscall_gnu = `;#---------------------
;#  GNU Assembler file
;#  Syscall Hello World
;#---------------------
.intel_syntax noprefix
.global _start
.text
_start:

  ;# sys_write
  mov rax, 1
  mov rdi, 1
  lea rsi, hello_string
  mov rdx, 14
  syscall

  ;# sys_exit
  mov rax, 60
  xor rdi, rdi
  syscall

.data
hello_string:
        .asciz  "Hello, world!\\n"
`;

const syscall_fasm = `;---------------------
;  Flat Assembler file
;  Syscall Hello World
;---------------------
format ELF64 executable 3
segment readable executable
entry $

  ; sys_write
	mov	edx,msg_size
	lea	rsi,[msg]
	mov	edi,1
	mov	eax,1
	syscall

  ; sys_exit
	xor	edi,edi
	mov	eax,60
	syscall

segment readable writeable
msg db 'Hello 64-bit world!',0xA
msg_size = $-msg
`;

const syscall_nasm = `;---------------------
;  NASM Assembler file
;  Syscall Hello World
;---------------------
section .text
global _start

_start:
  ; sys_write
  mov rax, 1          ; syscall: write
  mov rdi, 1          ; fd: stdout
  lea rsi, [rel msg]  ; pointer to string
  mov rdx, msg_size   ; string length
  syscall

  ; sys_exit
  mov rax, 60         ; syscall: exit
  xor rdi, rdi        ; exit code 0
  syscall

section .data
msg db "Hello, world!", 0xA
msg_size equ $ - msg
`;

const functions_gnu = `;#---------------------
;#  GNU Assembler file
;#  Function calls demo
;#---------------------
.intel_syntax noprefix
.global _start
.text

_start:
  ;# Set up arguments for print function
  mov rdi, 1
  lea rsi, hello_string
  mov rdx, 14
  call print

  ;# Set up arguments for exit function
  xor rdi, rdi
  call exit

;# Print function
;# Arguments:
;#   rdi - File descriptor (1 for stdout)
;#   rsi - Pointer to the string to print
;#   rdx - Length of the string
;# Return:
;#   None
print:
  push rbp
  mov rbp, rsp
  mov rax, 1
  syscall
  pop rbp
  ret

;# Exit function
;# Arguments:
;#   rdi - Exit code
;# Return:
;#   None
exit:
  push rbp
  mov rbp, rsp
  mov rax, 60
  syscall
  pop rbp
  ret

.data
hello_string:
  .asciz "Hello, world!\\n"
  
`;

const functions_fasm = `;---------------------
;  Flat Assembler file
;  Function calls demo
;---------------------
format ELF64 executable 3
segment readable executable
entry $

_start:
  ; Set up arguments for print function
  mov rdi, 1
  lea rsi, [msg]
  mov rdx, msg_size
  call print

  ; Set up arguments for exit function
  xor rdi, rdi
  call exit

; Print function
; Arguments:
;   rdi - File descriptor (1 for stdout)
;   rsi - Pointer to the string to print
;   rdx - Length of the string
; Return:
;   None
print:
  push rbp
  mov rbp, rsp
  mov rax, 1
  syscall
  pop rbp
  ret

; Exit function
; Arguments:
;   rdi - Exit code
; Return:
;   None
exit:
  push rbp
  mov rbp, rsp
  mov rax, 60
  syscall
  pop rbp
  ret


segment readable writeable
msg db 'Hello 64-bit world!',0xA
msg_size = $-msg

`;

const functions_nasm = `;---------------------
;  NASM Assembler file
;  Function calls demo
;---------------------
section .text
global _start

_start:
  ; Set up arguments for print function
  mov rdi, 1
  lea rsi, [rel msg]
  mov rdx, msg_size
  call print

  ; Set up arguments for exit function
  xor rdi, rdi
  call exit

; Print function
; Arguments:
;   rdi - File descriptor (1 for stdout)
;   rsi - Pointer to the string to print
;   rdx - Length of the string
; Return:
;   None
print:
  push rbp
  mov rbp, rsp
  mov rax, 1
  syscall
  pop rbp
  ret

; Exit function
; Arguments:
;   rdi - Exit code
; Return:
;   None
exit:
  push rbp
  mov rbp, rsp
  mov rax, 60
  syscall
  pop rbp
  ret

section .data
msg db "Hello, world!", 0xA
msg_size equ $ - msg
`;

export interface Snippet {
	id: string;
	display_name: string;
	description: string;
	mode: Assemblers_key;
	editorContent: string;
}

export const snippets: Record<string, Snippet> = {
	syscall_GNU: {
		id: "syscall_GNU",
		display_name: "Syscall (GNU as)",
		description:
			"A simple program that prints Hello World using raw syscalls, then quits. written for the Gnu Assembler, using the Intel syntax flavour",
		mode: "GNU_trunk",
		editorContent: syscall_gnu,
	},
	syscall_FASM: {
		id: "syscall_FASM",
		display_name: "Syscall (Fasm)",
		description:
			"A simple program that prints Hello World using raw syscalls, then quits. written for the Flat Assembler",
		mode: "FASM_trunk",
		editorContent: syscall_fasm,
	},
	syscall_NASM: {
		id: "syscall_NASM",
		display_name: "Syscall (NASM)",
		description:
			"A simple program that prints Hello World using raw syscalls, then quits. written for the Netwide Assembler (NASM)",
		mode: "NASM_trunk",
		editorContent: syscall_nasm,
	},
	functions_GNU: {
		id: "functions_GNU",
		display_name: "Functions (GNU as)",
		description:
			"Hello world using function calls. written for the Gnu Assembler, using the Intel syntax flavour",
		mode: "GNU_trunk",
		editorContent: functions_gnu,
	},
	functions_FASM: {
		id: "functions_FASM",
		display_name: "Functions (Fasm)",
		description:
			"Hello world using function calls. written for the Flat Assembler",
		mode: "FASM_trunk",
		editorContent: functions_fasm,
	},
	functions_NASM: {
		id: "functions_NASM",
		display_name: "Functions (NASM)",
		description:
			"Hello world using function calls. written for the Netwide Assembler (NASM)",
		mode: "NASM_trunk",
		editorContent: functions_nasm,
	},
} as const;

export const default_snippet: keyof typeof snippets = "syscall_FASM";
