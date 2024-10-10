let syscall_gdb =`.intel_syntax noprefix

.global _start
.text

_start:
  ;#---------------------
  ;# write your code here
  ;#---------------------

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

hello_string:
        .asciz  "Hello, world!\\n"
`;

let syscall_fasm=`
; fasm demonstration of writing 64-bit ELF executable,
; from the fasm examples repository.
; (thanks to František Gábriš)

format ELF64 executable 3

segment readable executable

entry $

  push rsp
	mov	edx,msg_siz
	lea	rsi,[msg]
	mov	edi,1		; STDOUT
	mov	eax,1		; sys_write
	syscall

	xor	edi,edi 	; exit code 0
	mov	eax,60		; sys_exit
	syscall

segment readable writeable

msg db 'Hello 64-bit world!',0xA
msg_size = $-msg
  
`

let functions_gdb= `.intel_syntax noprefix

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

hello_string:
  .asciz "Hello, world!\\n"

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
  
`;

let functions_fasm =`
`;





export let snippets={
"syscall":{
    "gdb":syscall_gdb,
    "fasm": syscall_fasm
  },
  "functions":{
    "gdb": functions_gdb,
    "fasm": functions_fasm
  }
}

