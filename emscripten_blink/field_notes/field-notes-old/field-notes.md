
## hunting for entry points i can understand

blinkelinghts.c:3633
```
    do {
      if (!tuimode) {
        Exec();
      } else {
        Tui();
      }
    } while (!(action & (RESTART | EXIT)));

```

this is part of VirtualMachine:
    int VirtualMachine(int argc, char *argv[]) {

which is then called my main


reconstructing what main does:

```
//global vars
struct Machine *m;
struct Pty *pty;

//non-global vars, defined in main
struct System *s;
static struct sigaction sa;

//initialize flags that contain info
//on the system memory
InitMap();

//will parse argv, and set some flags.
//we are interested in the breakpoints,
//ignor ethis whole block for now
GetOpts(argc,argv)
    //these global vars can be set:
    ++FLAG_strace //log every syscall
    //set breakpoints:
    static void HandleBreakpointFlag(const char *s) {
      struct Breakpoint b;
      memset(&b, 0, sizeof(b));
      if (isdigit(*s)) {
        b.addr = ParseHexValue(s);
      } else {
        b.symbol = optarg_;
      }
      PushBreakpoint(&breakpoints, &b);
    }

//sets up some global variable related to locks and comms
InitBus();
  

unassert((pty = NewPty()));
unassert((s = NewSystem(wantmetal ? XED_MACHINE_MODE_REAL
                                  : XED_MACHINE_MODE_LONG)));

//note g_machine : its a thread local var. defined in machine.c
unassert((m = g_machine = NewMachine(s, 0)));

DisableJit(&m->system->jit);

m->metal = false;

//register system callbacks
m->system->redraw = Redraw;
m->system->onbinbase = OnBinbase;
m->system->onlongbranch = OnLongBranch;

//register sighandler for SIGSYS
sa.sa_flags = 0;
sa.sa_handler = OnSigSys; //a function that does nothing
unassert(!sigaction(SIGSYS, &sa, 0));

//register sighandler for SIGINT
sa.sa_flags = SA_SIGINFO;
sa.sa_sigaction = OnSigInt; //this function changes the state machine state: action |= INT
unassert(!sigaction(SIGINT, &sa, 0));


//other sighandlers are registered. all they do is change 
static int action; //a global var that defines the state of the tui state machine

//main is just setting the scene
//this is the actual execution of the machine.
rc = VirtualMachine(argc, argv);

//after its execution, memory is cleared and main returns

  FreeBig(ophits, m->system->codesize * sizeof(unsigned long)); //not important
  FreeMachine(m);
  ClearHistory(); //it's just the ansi output to the whole screen that gets saved. pretty cool
  return rc;





//printing memory is done by setting some struct settings,
//and then actually drawing mem. based on those settings.
getPc(m)
getSp(m)
//passed into custom struct:
ScrollMemoryView(&pan.code, &codeview, GetPc(m));
ScrollMemoryView(&pan.stack, &stackview, GetSp());
//which then gets used from the actual printer function,
//called somewhere in the UI loop:

static void DrawMemoryUnzoomed(struct Panel *p, struct MemoryView *view,

which basically ends up calling:
static int VirtualShadow(i64 v) {
/**
 * Returns glyph representing byte at virtual address 𝑣.
 */
static int VirtualBing(i64 v) {
which internally, both do:
  SpyAddress(m,v) //machine m, i64 virtual_address v

so basically we can get all the informations we want from the machine
by using the functions in machine.h like:
getPc(m)
getSp(m)
SpyAddress(m,v)


this is also pretty useful:
static void CopyMachineState(struct MachineState *ms) {
  ms->ip = m->ip;
  ms->cs = m->cs;
  ms->ss = m->ss;
  ms->es = m->es;
  ms->ds = m->ds;
  ms->fs = m->fs;
  ms->gs = m->gs;
  memcpy(ms->weg, m->weg, sizeof(m->weg));
  memcpy(ms->xmm, m->xmm, sizeof(m->xmm));
  memcpy(&ms->fpu, &m->fpu, sizeof(m->fpu));
  memcpy(&ms->mxcsr, &m->mxcsr, sizeof(m->mxcsr));
}



let's look at the code that starts the machine: VirtualMachine()
since this function loads the process from an elf, I suspect
that it will be too complex compared to what we need, but let's see:


//this parses the elf file, and sets up the process memory (i think)
LoadProgram(m, codepath, codepath, argv + optind_ - 1 + FLAG_zero, environ,
                FLAG_bios);
//this allocation is misterious, i noticed it gets freed in main.
//it is not important
ophits = (unsigned long *)AllocateBig(
    m->system->codesize * sizeof(unsigned long), PROT_READ | PROT_WRITE,
    MAP_ANONYMOUS_ | MAP_PRIVATE, -1, 0);

//this is the TUI state machine loop! the core of the system
do {
  if (!tuimode) {
    Exec();
  } else {
    Tui();
  }
} while (!(action & (RESTART | EXIT)));
} while (action & RESTART);



what does Exec do? read line 3206 onwards, its all interesting
//it does this only the first time:
      m->system->dis = dis;
      m->system->onsymbols = OnSymbols;
      LoadDebugSymbols(m->system);

//some other highlights:
m->nofault = false;

for (;;) {
  LoadInstruction(m, GetPc(m));
  if ((bp = IsAtBreakpoint(&breakpoints, m->ip)) != -1) {
    ...
    }
  if (verbose) LogInstruction();
  Execute();

static void BreakAtNextInstruction(void) {
  struct Breakpoint b;
  memset(&b, 0, sizeof(b));
  b.addr = GetPc(m) + m->xedd->length;
  b.oneshot = true;
  PushBreakpoint(&breakpoints, &b);
}

static void Execute(void) {
  u64 c;
  if (g_history.viewing) {
    g_history.viewing = 0;
  }
  c = cycle;
  ExecuteInstruction(m);
  if (c == cycle) {
    ++cycle;
    ProfileOp(m, GetPc(m) - m->oplen);
  }
  if (atomic_load_explicit(&m->attention, memory_order_acquire)) {
    CheckForSignals(m);
  }
}


```



the stuff we look at so far gives us a pretty good idea of how to
control the machine: it's clear that everyting that matters live
inside machine.h, and every advancement in the state of the machine
is controlled by some function exposed my machine.h.
That should give us all the instruments required for running and
inspecting memory and registers one step at the time.



let's see how an elf is turned into a process inside the machine.

```
void LoadProgram(struct Machine *m, char *execfn, char *prog, char **args,


  struct Elf *elf;
  elf = &m->system->elf;
  ResetCpu(m);
  m->system->codesize = 0;
  m->system->codestart = 0;
  m->system->brk = FLAG_imagestart;
  m->system->automap = FLAG_automapstart;

  loader.c:775:
    
    } else if (READ32(map) == READ32("\177ELF")) {
      execstack = LoadElf(m, elf, (Elf64_Ehdr_ *)map, mapsize, fd);
    } else if (READ64(map) == READ64("MZqFpD='") ||
               READ64(map) == READ64("jartsr='")) {

  the file magic bytes are checked, and the proper file parsed
  is called. let's see loadElf:
```



handlekeyboard is also interesting to learn about the
TUI state machine.



## unit tests:

unit tests are always useful for insights into 
how stuff works.

mordrm_test.c includes a reproducible, isolated
example of machine usage.

```
struct System *s;
struct Machine *m;
struct XedDecodedInst xedd;

void SetUp(void) {
  InitMap();
  unassert((s = NewSystem(XED_MACHINE_MODE_LONG)));
  unassert((m = NewMachine(s, 0)));
  m->xedd = &xedd;
  memset(&xedd, 0, sizeof(xedd));
}

void TearDown(void) {
  FreeMachine(m);
}


```


disinst_test.c

shows how the disassembler works.
good entrypoint if we want to include intel dialect
```
  u8 op[] = {0xcc};
  ILD(op, XED_MODE_LONG); //just some assert_eq
  DisInst(d, b1, DisSpec(d->xedd, b2));
  EXPECT_STREQ("int3 ", b1);

```


the mmap syscall shows how memory is instantiated:
syscall.c>SysMmapImpl
The key part is this:
```
  virt = ReserveVirtual(m->system, virt, size, key, fildes, offset,
                        !!(flags & MAP_SHARED_LINUX), fixedmap);
  if (virt != -1 && newautomap != -1) {
    m->system->automap = newautomap;
  }

```

similarly, this is how the stack is allocated in loader.c>loadprogram
```
  stack = HasLinearMapping() && FLAG_vabits <= 47 && !kSkew
              ? 0
              : kStackTop - kStackSize;
  if ((stack = ReserveVirtual(
           m->system, stack, kStackSize,
           PAGE_FILE | PAGE_U | PAGE_RW | (execstack ? 0 : PAGE_XD), -1, 0, 0,
           0)) != -1) {
    unassert(AddFileMap(m->system, stack, kStackSize, "[stack]", -1));
    Put64(m->sp, stack + kStackSize);
  } else {
    LOGF("failed to reserve stack memory");
    exit(127);
  }

```




xed encoder:
https://stackoverflow.com/a/44229044/9169799

