#------------------------------------------
# This demo program is just a long sequence of nops.
# It does not call exit, and will therefore crash
#-------------------------------------------
.intel_syntax noprefix

.global _start
.text

_start:
  .rept 4096
  nop
  .endr

