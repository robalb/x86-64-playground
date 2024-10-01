
## disassembly

blink includes a disassembler,
which sadly is in the at&t syntax.
It would be pretty cool to make it work
with the js api, and to add intel syntax.

blinkenlights.c:
```
//beginning of file
static struct Dis dis[1];

//...

static void DrawDisassembly(struct Panel *p) {
  i64 i, j;
  for (i = 0; i < p->bottom - p->top; ++i) {
    j = opstart + i;
    if (0 <= j && j < dis->ops.i) {
      if (j == opline) AppendPanel(p, i, "\033[7m");
      AppendPanel(p, i, DisGetLine(dis, m, j));
      if (j == opline) AppendPanel(p, i, "\033[27m");
    }
  }
}

```

other interesting functions:
blinkenlights.c:860
```
static void ResolveBreakpoints(void) {
  long i, sym;
  for (i = 0; i < breakpoints.i; ++i) {
    if (breakpoints.p[i].symbol && !breakpoints.p[i].addr) {
      if ((sym = DisFindSymByName(dis, breakpoints.p[i].symbol)) != -1) {
        breakpoints.p[i].addr = dis->syms.p[sym].addr;
      }
    }
  }
}

```

dis.c
```
const char *DisGetLine(struct Dis *d, struct Machine *m, int i) {

```



other very important functions:
blinkenlights.c
```
void OnSymbols(struct System *s) {
  ResolveBreakpoints();
  ResolveWatchpoints();
}

void CommonSetup(void) {
  static bool once;
  if (!once) {
    if (tuimode || breakpoints.i || watchpoints.i) {
      m->system->dis = dis;
      m->system->onsymbols = OnSymbols;
      LoadDebugSymbols(m->system);
    }
    once = true;
  }
}

```

this is where dis is initialized, together with
debug symbols stuff that we'll clearly need later


### ideas on how to pass the dis. to js

var line = $(/*your highlighted line*/);
var offset = line.offset();
window.scrollTo(offset.left, offset.top);


the blink api provide a list of instructions,
and the index of the ip in the list.
they automatically handle the redraw of the list
when the ip reaches the bottom, or the execution
jumps outside of the small window we disassembled.

ideally, we could draw each line in the dis list
in an html line, in a scrollable div.
on each step, we scroll to the correct line in the html.

we cann pass the line index in our shared struct.
we only need a lightweight way to render
js strings from a byteArray


## implementing intel dialect

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




## handling exit

this is an annoying issue:
we handle all out data update on sigtrap,
but the exit syscall does not
generate that trap, so
when continue is run the ui does not update

possible solution: m->system->trapexit


syscall.c>SysExitGroup:369

    if (m->system->trapexit && !m->system->exited) {
      m->system->exited = true;
      m->system->exitcode = rc;
      HaltMachine(m, kMachineExitTrap);

blinkenlights.c
also does something interesting:
it registers an `OnHalt` listener.
since it also sets m->system->trapexit = true,

it will detect an exit call from there.


blinkenlights.c:2693
```
static bool OnHalt(int interrupt) {
  switch (interrupt) {
    ...
    case kMachineExitTrap:
      OnExitTrap();
      return true;
```

the exit code will be set in:
m->system->exitcode;



At this point we must step back, and really understand signal handling
in blinkenlights:

TerminateSignal()
  calls exit

Exec does something weird
with sigsetjmp:
blinkenlights.c:3211,3277


## Tui and Exec compared
(in blinkenlights.c)


```c

m->nofault = false;
m->system->trapexit = true; //TUI only
GetDisIndex() //TUI only

if (!(interrupt = sigsetjmp(m->onhalt, 1))) {
  m->canhalt = true;

  ... loadInstruction, then execute
  }
  else{

    if (interrupt == 1) interrupt = m->trapno;
    OnHalt(interrupt)
    
  }

```

## investigating crash when m->trapexit is true

crash happens in OpSyscall:

it's caused by the line at the beginning:
unassert(!m->nofault);

it's clear that i need to understand better how nofault is used, and
when it's set.

ok, false positive.
i was just setting nofault to the wrong value, in runLoop.







## TODO:

- understand exit and signals, fix exit

- clean files, and extra stuff that is not needed, even in blinkenlib.c

- conceptually separate load and start.
  load should only write the elf in the vfs.
  start should call loadelf.
  running status should be checked against
  the m->running flags, not our own.

- design good wasm-side api, write stuff in header file.




