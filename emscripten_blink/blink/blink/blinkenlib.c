#include "blink/blinkenlib.h"

#include "blink/endian.h"
#include "blink/machine.h"
#include "blink/map.h"
#include "blink/bus.h"
#include "blink/x86.h"
#include "blink/loader.h"
#include "blink/high.h"
#include "blink/dis.h"

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
 * this buffer holds the disassembly strings
 * that will be passed to js
 */
#define DIS_MAX_LINES 20
#define DIS_MAX_LINE_LEN 100
char dis_buffer[DIS_MAX_LINES][DIS_MAX_LINE_LEN] = {0};

//todo: use this struct
struct disassembler{
  u32 max_lines;
  u32 max_line_len;
  u32 current_line;
  char *buffer;
};

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
  u32 version; //number

  u32 codemem;
  u32 stackmem;

  u32 readaddr;
  u32 readsize; //number
  u32 writeaddr;
  u32 writesize; //number

  u32 flags;

  u32 cs__base;
  u32 rip;
  u32 rsp;
  u32 rbp;
  u32 rsi;
  u32 rdi;

  u32 r8;
  u32 r9;
  u32 r10;
  u32 r11;
  u32 r12;
  u32 r13;
  u32 r14;
  u32 r15;

  u32 rax;
  u32 rbx;
  u32 rcx;
  u32 rdx;

  //disassembly buffer
  u32 dis__max_lines;    //number
  u32 dis__max_line_len; //number
  u32 dis__current_line;  //number
  u32 dis__buffer;
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
struct XedDecodedInst xedd;//TODO remove, unused
static struct Dis dis[1];
bool single_stepping = false;
bool running = false;//TODO; remove, use system state instead

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

//TODO: remove
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
* Populate an buffer with the ascii disassembly listing relevant to
* the current ip.
* The buffer is designed to be read from js, and parsed into html.
*/
u64 updateDisassembler(){
  u64 lineIndex = GetDisIndex();
  for(int i=0; i < dis->ops.i && i<DIS_MAX_LINES; i++){
    const char* curr = DisGetLine(dis, m, i);
    int len = strlen(curr);
    if(len > DIS_MAX_LINE_LEN){
      len = DIS_MAX_LINE_LEN;
    }
    memcpy(dis_buffer[i], curr, strlen(curr));
  }
  return lineIndex;
}

//todo: remove this test.
void disassemble_test(){
  puts("#");
  printf("disops: %d found: %lx\n", dis->ops.i, 0);

  u64 lineIndex = GetDisIndex();
  printf("line : %ld\n", lineIndex);

  //print the dis. lines
  for(int i=0; i< dis->ops.i &&i<DIS_MAX_LINES; i++){
    if(i == lineIndex){
      printf(">> ");
    }
    const char* curr = DisGetLine(dis, m, i);
    puts(curr);
    int len = strlen(curr);
    if(len > DIS_MAX_LINE_LEN){
      memcpy(dis_buffer[i], "too long!", 10);
    }else{
      memcpy(dis_buffer[i], curr, strlen(curr));
    }
    printf("%s\n", curr);
  }
}



void update_clstruct(struct Machine *m){
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
  cls.rcx = (u32) &m->bx;
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
  m->system->trapexit = true;

  //TODO: update global disassember struct with 
  //a function call. both the struct and fcall dont 
  //exist right now

  if (!(interrupt = sigsetjmp(m->onhalt, 1))) {
    m->canhalt = true;
    for(;;){
      LoadInstruction(m, GetPc(m));//not really needed like this
      ExecuteInstruction(m);
      printf("loaded: %d, exited: %d\n", s->loaded, s->exited);

      //this check should be replaced with actual breakpoints logic
      //when breakpoints are implemented
      if(single_stepping){
        TerminateSignal(m, SIGTRAP, 0);
        puts("single stepping SIGTRAP\n");
        break;
      }
    }
    //TODO: make the loop run a fixed num of instructions,
    //then from here use the emscripten loop features
    //to schedule a recursive call to runLoop that won't block
    //the thread
  }
  else{
    printf("handling Halt.\n");
    // if sigsetjmp fake-returned 1, the actual trap number might have been
    // either 1 or 0; this should have been stored in m->trapno
    if (interrupt == 1) interrupt = m->trapno;
    if(interrupt == kMachineExitTrap){
      puts("Exit trap found! \n");
    }
  }
  m->canhalt = false;
}

//====================
//      actual code
//====================

void SetUp(void) {
  InitMap();
  InitBus();
  s = NewSystem(XED_MACHINE_MODE_LONG);
  m = g_machine = NewMachine(s, 0);
  m->metal = false;
      //TODO: from blinkenlights. define these callbacks
      // m->system->redraw = Redraw;
      // m->system->onbinbase = OnBinbase;
      // m->system->onlongbranch = OnLongBranch;
  // m->system->trapexit = true;

}


//callback
void OnSymbols(struct System *s) {
  // ResolveBreakpoints();
  // ResolveWatchpoints();
  puts("symbols ready. you can now find your breakpoints");
}

void PostLoadSetup(){
    //TODO: from blinkenlights
    // AddStdFd(&m->system->fds, 0);
    // AddStdFd(&m->system->fds, 1);
    // AddStdFd(&m->system->fds, 2);
  //initialize the disassembler
  m->system->dis = dis;
  m->system->onsymbols = OnSymbols;
  LoadDebugSymbols(m->system);
  Disassemble();
}

void TearDown(void) {
  //TODO: from blinkenlights
  // DisFree(dis);
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
  printf("loaded: %d, exited: %d\n", s->loaded, s->exited);
  LoadProgram(m, codepath, codepath, &args, &vars, bios);
  puts("@");
  printf("loaded: %d, exited: %d\n", s->loaded, s->exited);
  PostLoadSetup();
  puts("##");
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
  PostLoadSetup();
  puts("##");
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
void *blinkenlib_get_clstruct(){
  return &cls;
}

EMSCRIPTEN_KEEPALIVE
u8 *blinkenlib_spy_address(u64 virtual_address){
  return SpyAddress(m, virtual_address);
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
