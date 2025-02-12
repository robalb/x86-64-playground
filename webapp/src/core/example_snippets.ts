import type {Assemblers_key} from './assemblers'

let syscall_gnu =`;#---------------------
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

let syscall_fasm=`;---------------------
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
`

let functions_gnu= `;#---------------------
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

let functions_fasm =`;---------------------
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


export interface Snippet{
  id: string;
  display_name: string;
  description: string;
  mode: Assemblers_key;
  editorContent: string;
}


export let snippets: Record<string, Snippet> = {
  "syscall_GNU":{
    id: "syscall_GNU",
    display_name: "Syscall (GNU as)",
    description: "A simple program that prints Hello World using raw syscalls, then quits. written for the Gnu Assembler, using the Intel syntax flavour",
    mode:  "GNU_trunk",
    editorContent: syscall_gnu
  },
  "syscall_FASM":{
    id: "syscall_FASM",
    display_name: "Syscall (Fasm)",
    description: "A simple program that prints Hello World using raw syscalls, then quits. written for the Flat Assembler",
    mode:  "FASM_trunk",
    editorContent: syscall_fasm
  },
  "functions_GNU":{
    id: "functions_GNU",
    display_name: "Functions (GNU as)",
    description: "Hello world using function calls. written for the Gnu Assembler, using the Intel syntax flavour",
    mode:  "GNU_trunk",
    editorContent: functions_gnu
  },
  "functions_FASM":{
    id: "functions_FASM",
    display_name: "Functions (Fasm)",
    description: "Hello world using function calls. written for the Flat Assembler",
    mode:  "FASM_trunk",
    editorContent: functions_fasm
  },
} as const;


export let default_snippet: keyof typeof snippets = "syscall_FASM";

