import {blink_modes} from './blink'

let syscall_gnu =`.intel_syntax noprefix

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

.data
hello_string:
        .asciz  "Hello, world!\\n"
`;

let syscall_fasm=`format ELF64 executable 3

segment readable executable
entry $
  ;---------------------
  ; write your code here
  ;---------------------

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

let functions_gnu= `.intel_syntax noprefix

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

let functions_fasm =`format ELF64 executable 3

segment readable executable
entry $

_start:
  ; Set up arguments for print function
  mov rdi, 1
  lea rsi, [msg]
  mov rdx, 14
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





export let snippets={
"syscall":{
    [blink_modes.GNU]:syscall_gnu,
    [blink_modes.FASM]: syscall_fasm
  },
  "functions":{
    [blink_modes.GNU]: functions_gnu,
    [blink_modes.FASM]: functions_fasm
  }
}

