#include "blink/blinkenlib.h"

#include "blink/endian.h"
#include "blink/machine.h"
#include "blink/map.h"
#include "blink/modrm.h"
#include "blink/bus.h"
#include "blink/x86.h"
#include "blink/loader.h"
#include "blink/high.h"

#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <signal.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

void(*signal_callback)(int, int) = 0;

void update_clstruct(struct Machine *m);

/**
 * cross-language struct.
 * This is just a list of wasm 32-bit pointers
 * that will be passed to js.
 * Since passing a struct to js is complicated, we are
 * passing an array of pointers instead. js will have an hardcoded
 * list with the meaning of each pointer.
 */
#define CLSTRUCT_VERSION 1
struct clstruct{
  uint32_t version; //number

  uint32_t codemem;
  uint32_t stackmem;

  uint32_t readaddr;
  uint32_t readsize; //number
  uint32_t writeaddr;
  uint32_t writesize; //number

  uint32_t flags;

  uint32_t cs__base;
  uint32_t rip;
  uint32_t rsp;
  uint32_t rbp;
  uint32_t rsi;
  uint32_t rdi;

  uint32_t r8;
  uint32_t r9;
  uint32_t r10;
  uint32_t r11;
  uint32_t r12;
  uint32_t r13;
  uint32_t r14;
  uint32_t r15;

  uint32_t rax;
  uint32_t rbx;
  uint32_t rcx;
  uint32_t rdx;
};
struct clstruct cls;



////////////////////////
///test functions, remove
////////////////////////
int test_accumulator = 0;
EMSCRIPTEN_KEEPALIVE 
int add(int a){
  return a + 1;
}
EMSCRIPTEN_KEEPALIVE
int incr(){
  test_accumulator++;
  return test_accumulator;
}
EMSCRIPTEN_KEEPALIVE
int* get_incr(){
  return &test_accumulator;
}
EMSCRIPTEN_KEEPALIVE
void iotest(){
  puts("@@@@@@@");
  //intentionally not checking nullptr ref
  signal_callback(1,2);
}






struct System *s;
struct Machine *m;
struct XedDecodedInst xedd;
bool single_stepping = false;
bool running = false;

/**
 * Signals handler.
 * Signals will be passed to the javascript runtime.
 * SIGTRAP will not terminate the program
 */
void TerminateSignal(struct Machine *m, int sig, int code) {
  if(sig != SIGTRAP){
    running = false;
    printf("Terminate signal received! %d : %d \n", sig, code);
  }
  else{
    printf("SIGTRAP received\n");
  }

  update_clstruct(m);
  if(signal_callback){
    signal_callback(sig, code);
  }
}


/**
 * Returns true if 𝑣 is a shadow memory virtual address.
 */
static bool IsShadow(i64 v) {
  return 0x7fff8000 <= v && v < 0x100080000000;
}

static int GetPointerWidth(void) {
  return 2 << m->mode.omode;
}

static i64 GetSp(void) {
  switch (GetPointerWidth()) {
    default:
    case 8:
      return Read64(m->sp);
    case 4:
      return m->ss.base + Read32(m->sp);
    case 2:
      return m->ss.base + Read16(m->sp);
  }
}

void DumpHex(const void* data, size_t size) {
	char ascii[17];
	size_t i, j;
	ascii[16] = '\0';
	for (i = 0; i < size; ++i) {
		printf("%02X ", ((unsigned char*)data)[i]);
		if (((unsigned char*)data)[i] >= ' ' && ((unsigned char*)data)[i] <= '~') {
			ascii[i % 16] = ((unsigned char*)data)[i];
		} else {
			ascii[i % 16] = '.';
		}
		if ((i+1) % 8 == 0 || i+1 == size) {
			printf(" ");
			if ((i+1) % 16 == 0) {
				printf("|  %s \n", ascii);
			} else if (i+1 == size) {
				ascii[(i+1) % 16] = '\0';
				if ((i+1) % 16 <= 8) {
					printf(" ");
				}
				for (j = (i+1) % 16; j < 16; ++j) {
					printf("   ");
				}
				printf("|  %s \n", ascii);
			}
		}
	}
}


void snippets(void){
  // uint8_t op[] = {0x8d, 0x04, 0x03}; /* lea (%rbx,%rax,1),%eax */
  // uint8_t op[] = {0x48, 0xff, 0xc0}; // inc rax
  // Write64(m->bx, 0x3);
  // Write64(m->ax, 0x2);
  // uint64_t out = Read64(m->ax);

  // printf("rax: %ld\n", (long) out);
  // printf("rax: %ld\n", (long) out);

  // GetPc(m);
  // GetSp(m);
  // SpyAddress(m,v); //machine m, i64 virtual_address v
  // ResetCpu(m);

  //this is how the stack mem page is allocated in loader.c>loadprogram
  // stack = HasLinearMapping() && FLAG_vabits <= 47 && !kSkew
  //             ? 0
  //             : kStackTop - kStackSize;
  // if ((stack = ReserveVirtual(
  //          m->system, stack, kStackSize,
  //          PAGE_FILE | PAGE_U | PAGE_RW | (execstack ? 0 : PAGE_XD), -1, 0, 0,
  //          0)) != -1) {
  //   unassert(AddFileMap(m->system, stack, kStackSize, "[stack]", -1));
  //   Put64(m->sp, stack + kStackSize);
  // } else {
  //   LOGF("failed to reserve stack memory");
  //   exit(127);
  // }

  //execution loop:
  // LoadInstruction(m, GetPc(m));
  //
  // APPEND(" PC %" PRIx64 " %s\n\t"
  //        " AX %016" PRIx64 " "
  //        " CX %016" PRIx64 " "
  //        " DX %016" PRIx64 " "
  //        " BX %016" PRIx64 "\n\t"
  //        " SP %016" PRIx64 " "
  //        " BP %016" PRIx64 " "
  //        " SI %016" PRIx64 " "
  //        " DI %016" PRIx64 "\n\t"
  //        " R8 %016" PRIx64 " "
  //        " R9 %016" PRIx64 " "
  //        "R10 %016" PRIx64 " "
  //        "R11 %016" PRIx64 "\n\t"
  //        "R12 %016" PRIx64 " "
  //        "R13 %016" PRIx64 " "
  //        "R14 %016" PRIx64 " "
  //        "R15 %016" PRIx64 "\n\t"
  //        " FS %016" PRIx64 " "
  //        " GS %016" PRIx64 " "
  //        "OPS %-16ld "
  //        "FLG %s\n\t"
  //        "%s\n\t",
  //        m->cs.base + MaskAddress(m->mode.omode, m->ip),
  //        DescribeOp(m, GetPc(m)), Get64(m->ax), Get64(m->cx), Get64(m->dx),
  //        Get64(m->bx), Get64(m->sp), Get64(m->bp), Get64(m->si), Get64(m->di),
  //        Get64(m->r8), Get64(m->r9), Get64(m->r10), Get64(m->r11),
  //        Get64(m->r12), Get64(m->r13), Get64(m->r14), Get64(m->r15), m->fs.base,
  //        m->gs.base, GET_COUNTER(instructions_decoded),
  //        DescribeCpuFlags(m->flags), g_progname);
}

void inspect_read_or_writes(){
  static u64 readaddr;
  static u64 readsize;
  static u64 writeaddr;
  static u64 writesize;

  if (!IsShadow(m->readaddr) && !IsShadow(m->readaddr + m->readsize)) {
    readaddr = m->readaddr;
    readsize = m->readsize;
  }
  if (!IsShadow(m->writeaddr) &&
      !IsShadow(m->writeaddr + m->writesize)) {
    writeaddr = m->writeaddr;
    writesize = m->writesize;
  }

}

void inspect(){
  int pc = GetPc(m);
  printf("pc: %x\n", pc);
  int sp = GetSp();
  printf("sp: %x\n", sp);

  u8 * codemem = SpyAddress(m, pc);
  u8 * stackmem = SpyAddress(m, sp);

  if(codemem){
    printf("code mem: %p \n", codemem);
    DumpHex(codemem, 40);
  }
  if(stackmem){
    printf("stack mem: %p \n", stackmem);
    DumpHex(stackmem, 40);
  }


}

void update_clstruct(struct Machine *m){
  //memory regions
  int pc = GetPc(m);
  int sp = GetSp();
  cls.codemem = (uint32_t) SpyAddress(m, pc);
  cls.stackmem = (uint32_t) SpyAddress(m, sp);

  //read or writes
  cls.readaddr = 0;
  cls.readsize = 0;
  cls.writeaddr = 0;
  cls.writesize = 0;
  if (!IsShadow(m->readaddr) && !IsShadow(m->readaddr + m->readsize)) {
    cls.readaddr = (uint32_t) &m->readaddr;
    cls.readsize = (uint32_t) &m->readsize;
  }
  if (!IsShadow(m->writeaddr) &&
      !IsShadow(m->writeaddr + m->writesize)) {
    cls.writeaddr = (uint32_t) &m->writeaddr;
    cls.writesize = (uint32_t) &m->writesize;
  }

  //flags and other useful info
  cls.flags = (uint32_t) &m->flags;
  cls.cs__base = (uint32_t) &m->cs.base;

  //registers
  cls.rip = (uint32_t) &m->ip;
  cls.rsp = (uint32_t) &m->sp;
  cls.rbp = (uint32_t) &m->bp;
  cls.rsi = (uint32_t) &m->si;
  cls.rdi = (uint32_t) &m->di;
  cls.r8 = (uint32_t) &m->r8;
  cls.r9 = (uint32_t) &m->r9;
  cls.r10 = (uint32_t) &m->r10;
  cls.r11 = (uint32_t) &m->r11;
  cls.r12 = (uint32_t) &m->r12;
  cls.r13 = (uint32_t) &m->r13;
  cls.r14 = (uint32_t) &m->r14;
  cls.r15 = (uint32_t) &m->r15;

  cls.rax = (uint32_t) &m->ax;
  cls.rcx = (uint32_t) &m->bx;
  cls.rcx = (uint32_t) &m->cx;
  cls.rdx = (uint32_t) &m->dx;

  //TODO: other useful data
  // printf("page tables:\n%s\n", FormatPml4t(m));
  // u64 entry = FindPageTableEntry(m, (GetPc(m) & -4096));
  // printf("pagetable %lx: %lx\n", GetPc(m), entry);
}


void runLoop(){
  for(;;){
    LoadInstruction(m, GetPc(m));
    ExecuteInstruction(m);

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

//====================
//      actual code
//====================

void SetUp(void) {
  //initialize some flags
  InitMap();
  //sets up some global variable related to locks and comms
  //TODO: check if this is really required
  InitBus();

  s = NewSystem(XED_MACHINE_MODE_LONG);
  m = g_machine = NewMachine(s, 0);
  m->metal = false;
}

void TearDown(void) {
  FreeMachine(m);
}


EMSCRIPTEN_KEEPALIVE
void blinkenlib_loadProgram(){
  //close previous instances
  running = false;
  TearDown();

  //TODO: all this must be received as arg.
  //remember to free these strings after they are used, since
  //they will be allocated dynamically from js
  char codepath[] = "./program";
  char *args = 0;
  char *vars = 0;
  char *bios = 0;

  SetUp();
  LoadProgram(m, codepath, codepath, &args, &vars, bios);
  puts("@");
  update_clstruct(m);
  puts("@@");
  //fix bug with some pages being cached incorrectly as not executable
  //this is not required with the latest patch
  // ResetTlb(m);
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_loadPlayground(){
  //close previous instances
  running = false;
  TearDown();

  //TODO: write playground program to disk here
  //The easyest way i can think of to simulate
  //a fully functional program is to actually load
  //a program, and then to modify its .text section
  //on the fly when it's in memory.

  char codepath[] = "./playground";
  char *args = 0;
  char *vars = 0;
  char *bios = 0;
  SetUp();
  LoadProgram(m, codepath, codepath, &args, &vars, bios);
  puts("@");
  update_clstruct(m);
  puts("@@");
}


EMSCRIPTEN_KEEPALIVE
void blinkenlib_start(bool step){
  if(running){
    abort();
  }
  single_stepping = step;
  running = true;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_stepi(){
  if(!running){
    abort();
  }
  single_stepping = true;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
void blinkenlib_continue(){
  if(!running){
    abort();
  }
  single_stepping = false;
  runLoop();
}

EMSCRIPTEN_KEEPALIVE
int blinkenlib_get_clstruct(){
  return (uint32_t) &cls;
}

EMSCRIPTEN_KEEPALIVE
int main(int argc, char *argv[]) {
  puts("blinkenlib main starting...\n");
  if(argc != 2){
    abort();
  }
  int signal_callback_num = atoi(argv[1]);
  signal_callback = (void(*)(int, int))signal_callback_num;
  printf("fp1: %d\n", signal_callback_num);

  //initialize the cross-language struct
  cls.version = CLSTRUCT_VERSION;

  //overlays setup goes here
  //vfs setup goes here

  //disable ansi colors in prints
  g_high.enabled = false; 

  puts("setup done!\n");
}
