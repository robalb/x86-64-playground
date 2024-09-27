#------------------------------------------
# This demo program is just an exit system call.
# It will close as soon as it's executed.
#-------------------------------------------
.intel_syntax noprefix

.global _start
.text

_start:
  mov rax, 0x3c #exit syscall
  mov rdi, 0    #exit code
  syscall
