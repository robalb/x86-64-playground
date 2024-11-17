
# implementing intel dialect in blink

This is an experiment, I plan to freely modify
the blink code until I get something stable.
Then I'll work on a proper patch upstream.


this is what we call:

    disGetLine(){
      xedd = GetInstruction /*huge magical function*/
     return DisLineCode()
     }


we need to understand and modify DisLineCode
if we want the new syntax

it's actually very simple:
```
  DisAddr() //the instr address
  DisRaw() //the raw bytes of the instr.
  DisCode() //the mnemonic. what we want to change
```

    disCode():
      spec = DisSpec()
      return DisInst(spec)

discCode will generate the instruction
based on a normalized string spec.
we can keep the string spec the same,
and only change the DisInst logic

https://imada.sdu.dk/u/kslarsen/dm546/Material/IntelnATT.htm


time to properly learn xed
https://intelxed.github.io/ref-manual/index.html




a simple entry point seems to be DisArg.


all we need to do:
remove the $,% prefix

now the hard part is
the memory addressing.

We are using this test

```
mov dword [rdi], 0x10000
mov     eax,[ebx+20h]
add     eax,[ebx+ecx*2h]
lea     eax,[ebx+ecx]
sub     eax,[ebx+ecx*4h-20h]
```

```
Intel Syntax
instr   foo,segreg:[base+index*scale+disp]
mov     eax,[ebx+20h]
add     eax,[ebx+ecx*2h
lea     eax,[ebx+ecx]
sub     eax,[ebx+ecx*4h-20h]

AT&T Syntax
instr   %segreg:disp(base,index,scale),foo
movl    0x20(%ebx),%eax
addl    (%ebx,%ecx,0x2),%eax
leal    (%ebx,%ecx),%eax
subl    -0x20(%ebx,%ecx,0x4),%eax
```


Who is generating the
memory addressing strings?

Someone in disarg.c

By looking for `:`
we find DisSego, clearly the responsible for

```
%segreg:disp(base,index,scale),foo
________
```
upstream from there, we find DisM

```
static char *DisM(struct Dis *d, u64 rde, char *p) {
  p = DisSego(d, rde, p);
  p = DisDisp(d, rde, p);
  p = DisBis(d, rde, p);
  return p;
}
```


DisInt
DisSymImp


Done!.

this test disassembles properly:

```
;---------------------
;  Flat Assembler file
;  Function calls demo
;---------------------
format ELF64 executable 3
segment readable executable
entry $

_start:
  ; Set up arguments for print function
  mov rdi, 1
  
  mov eax, ebx
  mov rax, [rbx]
  mov qword [rdi], 0x10000
  mov dword [rdi], 0x10000
  mov word [rdi], 0x100
  mov byte [rdi], 0x10
  mov     eax,[ebx+20h]
  add     eax,[ebx+ecx*2h]
  lea     eax,[ebx+ecx]
  sub     eax,[ebx+ecx*4h-20h]
  
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


```
