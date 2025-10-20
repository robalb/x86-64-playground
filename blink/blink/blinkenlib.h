#ifndef BLINK_BLINKENLIB_H_
#define BLINK_BLINKENLIB_H_
#include <stdbool.h>

#include "blink/types.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

/**
 * cross-language struct.
 * This is just a list of wasm 32-bit pointers
 * that will be passed to js.
 * Since passing a struct to js is complicated, we are
 * passing an array of pointers instead. js will have an hardcoded
 * list with the meaning of each pointer.
 */
#define CLSTRUCT_VERSION 1
struct clstruct {
  u32 version;  // number

  u32 codemem;
  u32 stackmem;

  u32 readaddr;
  u32 readsize;  // number
  u32 writeaddr;
  u32 writesize;  // number

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

  // disassembly buffer
  u32 dis__max_lines;     // number
  u32 dis__max_line_len;  // number
  u32 dis__current_line;  // number
  u32 dis__buffer;
};

void blinkenlib_run_fast();
void blinkenlib_run();
void blinkenlib_start();
void blinkenlib_starti();
void blinkenlib_stepi();
void blinkenlib_continue();
void blinkenlib_preempt_resume();
void *blinkenlib_get_clstruct();
void *blinkenlib_get_argc_string();
void *blinkenlib_get_argv_string();
void *blinkenlib_get_progname_string();
u8 *blinkenlib_spy_address(u64 virtual_address);

#endif /* BLINK_BLINKENLIB_H_ */
