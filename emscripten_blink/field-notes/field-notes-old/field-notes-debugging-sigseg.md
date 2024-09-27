
our goal is to run minimal assembly programs
generated via my shellcode playground.

AS of now, both blinkenlib, and blink/blinkenlights
sigseg on the first instruction (the vm generates a 
sigseg signal, not an actual sigseg of the vm)

but it works with hello worlds programs generated via gcc with the default libc

ideas:
- try without mode tiny
- follow via gdb the execution of blinkenlib,

  in both the libc and non-libc version, and see the difference.


```
LoadInstruction() simple, easy to understand.
                  it calls loadInstriction2 which is complicated,
                  does some stuff with the cache which is breaking
                  with my nolibc assembly program.

LoadInstructionSlow() this could be a replacement for loadInstruction2.
                      It probably does th esame thing, but its simple to
                      understand
                      
note: what LoadInstruction - LoadInstructionSlow seems to be doing is:
- take the bytes at the given rsp, and decode them into the machine xedd struct.
- rsp is not increased, nothing is executed at this stage

a temprary fix could be to modify LoadInstruction to call
LoadInstructionSlow.
Even if it does not work, it'll help to troubleshoot stuff.


ExecuteInstruction, with jit disable, will just call:
  jitlessDispatch, which is the hearth of the machine. it will:
    - call loadinstruction (the function we know)
    - set up some attributes in the machine, based on the loaded instruction
    - increase the instruciton pointer
    - call the function returned by GetOp()


so it's clear we dont need to call loadinstruction before executeinstruction, executeinstruction does it already.
but we have to fix loadinstruction


```


looking for problem in LoadInstruction:
```
it's clear that at some point, lookupaddress2 is called,
to get the page table the current instruction is living in.
That function is failing.

```


time to learn about paging
https://zolutal.github.io/understanding-paging/



# solution 1

turns out, the first idea i had was the right path:
compiling with
```
./configure
make mode=tiny
```

worked, now my minimal example_elf works in both blink
and blinkelights.
There is an issue: blinkenlinb segfaults.

Apparently LoadProgram expects some globals,
that with --disable-all were not required.



## attempt 2

trying --configure-all, enabling 
flags manually and checking what happens

initial status:
- all disable flags are defined
- program sigsegs for nx bit


jit:  emulator segfaults
x87: nx sigseg
threads: that's it <------


# conclusions

--disable-all is good, but threads must remain active

-disable-threads (included in disable-all) breaks stuff



with threads(working)
b LoaderCopy

```
STOP 1 (line 71 executed)
[#0] 0x55555555969f → LoaderCopy(m=0x5555555aa5f0, vaddr=0x4000b0, amt=0xf50, image=0x5555555b0630, offset=0x0, prot=0x1)
[#1] 0x555555559e52 → LoaderCopy(prot=<optimized out>, offset=0x0, image=0x5555555b0630, amt=0xf50, vaddr=0x4000b0, m=0x5555555aa5f0)
[#2] 0x555555559e52 → LoadElfLoadSegment(m=0x5555555aa5f0, path=<optimized out>, image=0x7ffff7fae000, imagesize=0x1210, phdr=<optimized out>, last_end=<optimized out>, last_prot=0x7fffffffd82c, aslr=0x0, fd=0x3)
[#3] 0x55555555a958 → LoadElf(m=0x5555555aa5f0, elf=0x5555555a9a30, ehdr=0x7ffff7fae000, esize=0x1210, fd=0x3)
[#4] 0x55555555b21c → LoadProgram(m=0x5555555aa5f0, execfn=0x7fffffffdafa "./example_elf", prog=<optimized out>, args=<optimized out>, vars=0x7fffffffdaf0, biosprog=0x0)
[#5] 0x5555555586f8 → main(argc=<optimized out>, argv=<optimized out>)

STOP 2 (line 71 executed)
[#0] 0x55555555969f → LoaderCopy(m=0x5555555aa5f0, vaddr=0x401014, amt=0xfec, image=0x5555555b1620, offset=0x0, prot=0x5)
[#1] 0x555555559e52 → LoaderCopy(prot=<optimized out>, offset=0x0, image=0x5555555b1620, amt=0xfec, vaddr=0x401014, m=0x5555555aa5f0)
[#2] 0x555555559e52 → LoadElfLoadSegment(m=0x5555555aa5f0, path=<optimized out>, image=0x7ffff7fae000, imagesize=0x1210, phdr=<optimized out>, last_end=<optimized out>, last_prot=0x7fffffffd82c, aslr=0x0, fd=0x3)
[#3] 0x55555555a958 → LoadElf(m=0x5555555aa5f0, elf=0x5555555a9a30, ehdr=0x7ffff7fae000, esize=0x1210, fd=0x3)
[#4] 0x55555555b21c → LoadProgram(m=0x5555555aa5f0, execfn=0x7fffffffdafa "./example_elf", prog=<optimized out>, args=<optimized out>, vars=0x7fffffffdaf0, biosprog=0x0)
[#5] 0x5555555586f8 → main(argc=<optimized out>, argv=<optimized out>)

```


## attempt 3

m->tlb is the transaction lookaside buffer, basically cache for
memory translations.
we set a `b runLoop`, then `p m->tlb`

with threads disabled (broken):
note how the addresses we care about are already cached,
and have not executable flags
```
gef➤  p m->tlb
$1 = {{
    page = 0x400000,
    entry = 0x8040000000400c07
  }, {
    page = 0x401000,
    entry = 0x8040000000401c07
  }, {
    page = 0x0,
    entry = 0x0
  } <repeats 29 times>, {
    page = 0x7ffff7bff000,
    entry = 0x80407ffff7bffc07
  }}

```

with threads enabled (working)
this is different, there is no cached addr.
```
gef➤  p m->tlb
$1 = {{
    page = 0x0,
    entry = 0x0
  } <repeats 31 times>, {
    page = 0x7ffff7bff000,
    entry = 0x80407ffff7bffc07
  }}
```


this fix works!:

I disabled the tlb lookup in memory.c:FindPageTableEntry
```diff
diff --git a/blink/memory.c b/blink/memory.c
index 99e14a1..65b8c27 100644
--- a/blink/memory.c
+++ b/blink/memory.c
@@ -189,7 +189,7 @@ u64 FindPageTableEntry(struct Machine *m, u64 page) {
     atomic_store_explicit(&m->invalidated, false, memory_order_relaxed);
   }
   tlbkey = (page >> 12) & (ARRAYLEN(m->tlb) - 1);
-  if (LIKELY(m->tlb[tlbkey].page == page &&
+  if (false && LIKELY(m->tlb[tlbkey].page == page &&
              ((entry = m->tlb[tlbkey].entry) & PAGE_V))) {
     STATISTIC(++tlb_hits);
     return entry;
diff --git a/example_elf b/example_elf
index f50c2b7..e491bda 100755
```

now FindPageTableEntry returns a page entry
that is executable


a proper solution, that does not involve changing the code:
call ResetTlb() immediately after LoadProgram


## finding the culprit:

we set a breakpoint in `FindPageTableEntry`, run my example_elf, and inspected the execution flow
for two different versions of blink: the broken one, compiled without threads, and the working one
compiled with threads. For simplicity, all other flags were disabled, but I could reproduce this
behaviour with all features enabled 

------
blink WITH threads (the issue does not happen)
------

func is called by stack trace in
LoadProgram several times.
Once, with the addr "0x400100", which is the executable addr of our code.

that function call will return a non executable page entry (should not be happening, bug?),
and will cache it in the machine tlb (`m->tlb`)

immediately after, the function will be called with other
adresses as arg (for example, as part of loadArgv>pushString>...>virtualcopy)

and this other call will trigger a reset of the tlb
```
    187    if (UNLIKELY(atomic_load_explicit(&m->invalidated, memory_order_acquire))) {
 →  188      ResetTlb(m);
    189      atomic_store_explicit(&m->invalidated, false, memory_order_relaxed);
    190    }
```

Ignore the atomic_load stuff, the reset happens because `m->invalidated` is true

As a result, when LoadProgram finishes, the tlb is clean
except for the last address, which is a stack address and is therefore not important that it is 
executable



------
blink WITHOUT threads (where the issue happens)
------

func is called by stack trace in
LoadProgram several times.
Once, with the addr "0x400100", which is the executable addr of our code.

after that, with other addresses, such as the stack addr.

ResetTlb is never called, because `m->invalidated` is false





In conclusion, there are 3 elements at play here:

- FindPageTableEntry is caching addresses with the wrong access levels.
- in most situations, the cache gets invalidated by calls to InvalidateSystem
  somewhere in ReserveVirtual, before the emulated program actually starts.
- in a very simple elf like mine, the cache is not invalidated.
  the reason this happens only with threads disabled is not clear, but
  i know that with threads, m->invalidated is always true, which causes FindPageTableentry to reset the tlb.
  without threads m->invalidated is always false, so the tlb is never reset,


From what I can tell, the issue is that
`FindPageTableEntry` is caching addresses with the wrong access levels
when it's called during the `LoadProgram` phase.
This always happens, but it's normally not a problem because the tlb gets invalidated on every
call of `FindPageTableEntry`.
