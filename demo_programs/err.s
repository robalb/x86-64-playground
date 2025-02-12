#------------------------------------------
# This demo program crashes
#-------------------------------------------
.intel_syntax noprefix

.global _start
.text

_start:
  nop
  mov eax, 20
  xor ecx, ecx
  xor edx, edx   # Clear EDX (upper part of dividend)
  div ecx        # Divide EAX by ECX (this will cause a division by zero exception)

  nop
  push 0
  ret

