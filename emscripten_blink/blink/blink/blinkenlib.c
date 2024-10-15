#include "blink/blinkenlib.h"

#include "blink/endian.h"
#include "blink/machine.h"
#include "blink/map.h"
#include "blink/bus.h"
#include "blink/x86.h"
#include "blink/loader.h"
#include "blink/high.h"
#include "blink/dis.h"
#include "blink/syscall.h"

#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <signal.h>

void(*signal_callback)(int, int) = 0;
void(*exit_callback)(int) = 0;

void update_clstruct(struct Machine *m);


/**
 * this buffer holds the disassembly strings
 * that will be passed to js
 */
#define DIS_MAX_LINES 200
#define DIS_MAX_LINE_LEN 200
char dis_buffer[DIS_MAX_LINES][DIS_MAX_LINE_LEN] = {0};

struct clstruct cls;
struct System *s;
struct Machine *m;
static struct Dis dis[1];
bool single_stepping = false;
bool debugger_enabled = false;

/**
 * Signals handler.
 * Signals will be passed to the javascript runtime.
 * SIGTRAP will not terminate the program
 */
void TerminateSignal(struct Machine *m, int sig, int code) {
#ifdef DEBUG
  if(sig != SIGTRAP){
    printf("Terminate signal received! %d : %d \n", sig, code);
  }
  else{
    printf("SIGTRAP received\n");
  }
#endif
  update_clstruct(m);
  if(signal_callback){
    signal_callback(sig, code);
  }
}

////////////////////////
///utility functions
////////////////////////

/**
 * Returns true if 𝑣 is a shadow memory virtual address.
 */
static bool IsShadow(i64 v) {
  return 0x7fff8000 <= v && v < 0x100080000000;
}

/**
* disassemble n lines of code, starting from the current ip.
* the disassembled lines will be stored in the dis struct.
*/
static i64 Disassemble(void) {
  i64 lines = DIS_MAX_LINES;
  if (Dis(dis, m, GetPc(m), m->ip, lines) != -1) {
    return DisFind(dis, GetPc(m));
  } else {
    return -1;
  }
}

/**
* get the index in the dis struct at which
* the current instruction is stored.
* if it's not there, the dis struct is repopulated
* by a new run of the disassembler
*/
static i64 GetDisIndex(void) {
  i64 i;
  if ((i = DisFind(dis, GetPc(m) - m->oplen)) != -1 ||
      (i = Disassemble()) != -1) {
    while (i + 1 < dis->ops.i) {
      if (!dis->ops.p[i].size) {
        ++i;
      } else {
        break;
      }
    }
  }
  return i;
}

/**
* Populate a buffer with the ascii disassembly listing updated to
* the current ip.
* The buffer is designed to be read from js, and parsed into html.
*/
u64 updateDisassembler(){
  u64 lineIndex = GetDisIndex();
  for(int i=0; i < dis->ops.i && i<DIS_MAX_LINES; i++){
    const char* curr = DisGetLine(dis, m, i);
    int len = strlen(curr)+1;
    if(len > DIS_MAX_LINE_LEN){
      len = DIS_MAX_LINE_LEN;
    }
    memcpy(dis_buffer[i], curr, len);
    dis_buffer[i][len-1] = 0;

  }
  return lineIndex;
}


void update_clstruct(struct Machine *m){
  if(!debugger_enabled)return;
  //memory regions
  u64 pc = GetPc(m);
  u64 sp = Read64(m->sp);
  cls.codemem = (u32) SpyAddress(m, pc);
  cls.stackmem = (u32) SpyAddress(m, sp);
  //read or writes
  cls.readaddr = 0;
  cls.readsize = 0;
  cls.writeaddr = 0;
  cls.writesize = 0;
  if (!IsShadow(m->readaddr) && !IsShadow(m->readaddr + m->readsize)) {
    cls.readaddr = (u32) &m->readaddr;
    cls.readsize = (u32) &m->readsize;
  }
  if (!IsShadow(m->writeaddr) &&
      !IsShadow(m->writeaddr + m->writesize)) {
    cls.writeaddr = (u32) &m->writeaddr;
    cls.writesize = (u32) &m->writesize;
  }

  //flags and other useful info
  cls.flags = (u32) &m->flags;
  cls.cs__base = (u32) &m->cs.base;

  //registers
  cls.rip = (u32) &m->ip;
  cls.rsp = (u32) &m->sp;
  cls.rbp = (u32) &m->bp;
  cls.rsi = (u32) &m->si;
  cls.rdi = (u32) &m->di;
  cls.r8 = (u32) &m->r8;
  cls.r9 = (u32) &m->r9;
  cls.r10 = (u32) &m->r10;
  cls.r11 = (u32) &m->r11;
  cls.r12 = (u32) &m->r12;
  cls.r13 = (u32) &m->r13;
  cls.r14 = (u32) &m->r14;
  cls.r15 = (u32) &m->r15;

  cls.rax = (u32) &m->ax;
  cls.rbx = (u32) &m->bx;
  cls.rcx = (u32) &m->cx;
  cls.rdx = (u32) &m->dx;

  //disassembled code buffer
  //TODO: all this data should be in a global
  //disassembler struct, this function should
  //only copy pointers.
  cls.dis__max_lines = DIS_MAX_LINES;
  cls.dis__max_line_len = DIS_MAX_LINE_LEN;
  cls.dis__current_line = updateDisassembler();
  cls.dis__buffer = (u32) &dis_buffer;


  //TODO: other useful data
  // printf("page tables:\n%s\n", FormatPml4t(m));
  // u64 entry = FindPageTableEntry(m, (GetPc(m) & -4096));
  // printf("pagetable %lx: %lx\n", GetPc(m), entry);
}


void runLoop(){
  int interrupt;
  m->nofault = false;

  //TODO: update global disassember struct with 
  //a function call. both the struct and fcall dont 
  //exist right now

  if (!(interrupt = sigsetjmp(m->onhalt, 1))) {
    m->canhalt = true;
    for(;;){
      LoadInstruction(m, GetPc(m));//not really needed like this
      ExecuteInstruction(m);

      //this check should be replaced with actual breakpoints logic
      //when breakpoints are implemented
      if(single_stepping){
        TerminateSignal(m, SIGTRAP, 0);
        break;
      }
    }
    //TODO: make the loop run a fixed num of instructions,
    //then from here use the emscripten loop features
    //to schedule a recursive call to runLoop that won't block
    //the thread
  }
  else{
    // if sigsetjmp fake-returned 1, the actual trap number might have been
    // either 1 or 0; this should have been stored in m->trapno
    if (interrupt == 1) interrupt = m->trapno;
#ifdef DEBUG
    printf("handling machine interrupt: %d \n", interrupt);
    puts("--");
#endif
    if(interrupt == kMachineExitTrap){
#ifdef DEBUG
      puts("Exit trap found! \n");
#endif
      if(signal_callback){
        update_clstruct(m);
        exit_callback(m->system->exitcode);
      }
    }
  }
  m->canhalt = false;
}

void SetUp(void) {
  InitMap();
  InitBus();
  s = NewSystem(XED_MACHINE_MODE_LONG);
  m = g_machine = NewMachine(s, 0);
  m->metal = false;
  // when true, guest exit syscalls will generate an interrupt that
  // can be handled via sigsetjmp, instead of calling the native _exit().
  // see: blinkenlib.c:runLoop()
  m->system->trapexit = true;

  //TODO: from blinkenlights. define these callbacks
  // m->system->redraw = Redraw;
  // m->system->onbinbase = OnBinbase;
  // m->system->onlongbranch = OnLongBranch;
}


//callback
void OnSymbols(struct System *s) {
  // ResolveBreakpoints();
  // ResolveWatchpoints();
}

void PostLoadSetup(){
  AddStdFd(&m->system->fds, 0);
  AddStdFd(&m->system->fds, 1);
  AddStdFd(&m->system->fds, 2);
  if(debugger_enabled){
    //initialize the disassembler
    m->system->dis = dis;
    m->system->onsymbols = OnSymbols;
    LoadDebugSymbols(m->system);
    Disassemble();
  }
}

void TearDown(void) {
  //TODO: make sure free is ok when not allocated
  DisFree(dis);
  FreeMachine(m);
  memset(dis_buffer, 0, sizeof(dis_buffer));
}


void setupProgramWithArgs(char* programpath, char **args, bool withdebugger){
  debugger_enabled = withdebugger;
  //close previous instances
  TearDown();
  char *bios = 0;
  char *vars = 0;
  SetUp();
  LoadProgram(m, programpath, programpath, args, &vars, bios);
#ifdef DEBUG
  printf("loaded: %d, exited: %d\n", s->loaded, s->exited);
#endif
  PostLoadSetup();
  update_clstruct(m);
}

void setupProgram(){
  //TODO: all this must be received as arg.
  //remember to free these strings after they are used, since
  //they will be allocated dynamically from js
  char codepath[] = "/program";
  char *args[] = {"/program", 0};
  puts("/program");
  setupProgramWithArgs(codepath, args, true);
}


////////////////////////
///exported api
////////////////////////


EMSCRIPTEN_KEEPALIVE
void blinkenlib_loadProgram(){
  //this is currently fully implemented in js.
  //the elf is fetched js-side, and put in the 
  //vfs at the path ./program
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_loadPlayground(int step){
  #define STEP_ASSEMBLE_AND_LINK 0
  #define STEP_ASSEMBLE 1
  #define STEP_LINK 2
  if(step == STEP_ASSEMBLE_AND_LINK){
    puts("\n/fasm /assembly.s /program");
    char codepath[] = "/fasm";
    char *args[] = {"/fasm", "/assembly.s", "/program", 0};
    setupProgramWithArgs(codepath, args, false);
    single_stepping = false;
    runLoop();
  }
  else if(step == STEP_ASSEMBLE){
    puts("\n/as -o /program.o /assembly.s");
    char codepath[] = "/as";
    char *args[] = {"/as", "-o", "/program.o", "/assembly.s", 0};
    setupProgramWithArgs(codepath, args, false);
    single_stepping = false;
    runLoop();
  }
  else if(step == STEP_LINK){
    puts("\n/ld -o /program /program.o");
    char codepath2[] = "/ld";
    char *args2[] = {"/ld", "--no-dynamic-linker", "-o", "/program", "/program.o", 0};
    setupProgramWithArgs(codepath2, args2, false);
    single_stepping = false;
    runLoop();
    puts("Program ready.");
  }
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_run(){
  setupProgram();
  //run the program to the end
  single_stepping = false;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_starti(){
  setupProgram();
  //don't run any instruction
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_start(){
  setupProgram();
  //TODO: set breakpoint at main
  single_stepping = false;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_stepi(){
  if(s->exited){
    unassert(!"Invalid state");
  }
  //run a single step
  single_stepping = true;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_continue(){
  if(s->exited){
    unassert(!"Invalid state");
  }
  single_stepping = false;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
void *blinkenlib_get_clstruct(){
  return &cls;
}

EMSCRIPTEN_KEEPALIVE
u8 *blinkenlib_spy_address(u64 virtual_address){
  BEGIN_NO_PAGE_FAULTS;
  return SpyAddress(m, virtual_address);
  END_NO_PAGE_FAULTS;
}

EMSCRIPTEN_KEEPALIVE
int main(int argc, char *argv[]) {
#ifndef __EMSCRIPTEN__
  puts("This program is designed to run in emscripten");
  return 1;
#endif
  puts("Initializing blink emulator...");
  if(argc != 3){
    puts("Error. main expected 2 args");
    return 1;
  }
  int signal_callback_num = atoi(argv[1]);
  int exit_callback_num = atoi(argv[2]);
  signal_callback = (void(*)(int, int))signal_callback_num;
  exit_callback = (void(*)(int))exit_callback_num;
#ifdef DEBUG
  printf("fp1: %d\n", signal_callback_num);
  printf("fp2: %d\n", exit_callback_num);
#endif
  //disable ansi colors in prints
  g_high.enabled = false; 
  //initialize the cross-language struct
  cls.version = CLSTRUCT_VERSION;
  //overlays setup goes here
  //vfs setup goes here
  puts("blink ready!");
}
