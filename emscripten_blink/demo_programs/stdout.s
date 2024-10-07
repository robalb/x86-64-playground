#------------------------------------------
# This demo program is just a long sequence of nops.
# It does not call exit, and will therefore crash
#-------------------------------------------
.intel_syntax noprefix

.global _start
.text

_start:
  mov rax, 0x0a21646c726f5720
  push rax
  mov rax, 0x6f6c6c6548
  push rax

  mov rax, 1
  mov rdi, 1
  mov rsi, rsp
  mov rdx, 14
  syscall

  mov rax, 60
  xor rdi, rdi
  syscall
