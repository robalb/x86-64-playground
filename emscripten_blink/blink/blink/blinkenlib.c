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

void update_clstruct(struct Machine *m);

/*
 * These variables are defined by javascript;
 * the pointers are passed to main when this module starts
 */
void(*signal_callback)(int, int) = 0;
void(*exit_callback)(int) = 0;



/*
 * this buffer holds the disassembly strings
 * that will be passed to js
 */
#define DIS_MAX_LINES 200
#define DIS_MAX_LINE_LEN 200
char dis_buffer[DIS_MAX_LINES][DIS_MAX_LINE_LEN] = {0};

/*
 * These buffers hold the program execution arguments.
 * The pointers to these strings will be passed to js,
 * and the content will be dynamically set by js
 */
#define ARGC_MAX_LINE_LEN 200
#define ARGV_MAX_LINE_LEN 200
#define PROGNAME_MAX_LINE_LEN 200
char argc_string[ARGC_MAX_LINE_LEN] = {0};
char argv_string[ARGV_MAX_LINE_LEN] = {0};
char progname_string[PROGNAME_MAX_LINE_LEN] = {0};

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

void stringToArgsArray(char *argsString, char **argsArray, int maxArgs) {
    int count = 0;
    char *token = strtok(argsString, " ");
    while (token != NULL && count < maxArgs - 1) {
        argsArray[count++] = token;
        token = strtok(NULL, " ");
    }
    argsArray[count] = NULL;
}

/**
 * Set up a program using the arguments previously set
  * by javascript in the global strings:
  * - progname_string
  * - argc_string
  * - argv_string
  *
  */
void setupProgram(bool withdebugger){
  debugger_enabled = withdebugger;

  //terminal prompt
  printf("\n$ %s\n", argc_string);

  //get **argc
  char *args[ARGC_MAX_LINE_LEN];
  char argc_string_copy[ARGC_MAX_LINE_LEN];
  memcpy(argc_string_copy, argc_string, ARGC_MAX_LINE_LEN);
  stringToArgsArray(argc_string_copy, args, ARGC_MAX_LINE_LEN);

  //get **argv
  //TODO
  char *vars = 0;

  //close previous instances
  TearDown();
  SetUp();
  char *bios = 0;
  LoadProgram(m, progname_string, progname_string, args, &vars, bios);
  PostLoadSetup();
  update_clstruct(m);
}


////////////////////////
///exported api
////////////////////////



EMSCRIPTEN_KEEPALIVE
void blinkenlib_run_fast(){
  setupProgram(false);
  single_stepping = false;
  runLoop();
}


EMSCRIPTEN_KEEPALIVE
void blinkenlib_run(){
  setupProgram(true);
  //run the program to the end
  single_stepping = false;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_starti(){
  setupProgram(true);
  //don't run any instruction
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_start(){
  setupProgram(true);
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
void *blinkenlib_get_argc_string(){
  return &argc_string;
}

EMSCRIPTEN_KEEPALIVE
void *blinkenlib_get_argv_string(){
  return &argv_string;
}

EMSCRIPTEN_KEEPALIVE
void *blinkenlib_get_progname_string(){
  return &progname_string;
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
    puts("Error. main expected 3 args");
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
