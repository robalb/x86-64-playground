
we are using a stock installation of lunarvim.

By default, the language server (clangd) fails to recognize the file imports, since
the project is missing the compile_commands.json.

since this project is based on make, we'll generate the compile commands using bear:

```
./configure --disable-all
bear -- make MODE=tiny CC=clang
```

Then, since we launched lunarvim before the compile_commands.json existed, we need to restart the language server:

`:LspRestart`

Now we can explore the project with a fully working Language server, taking advantage of 
VIM commands like `gd`, `gD` et all.


## adding a process

we now want to modify the makefile to generate a new executable, in addition to blink and blinkenlights


we created a copy of blinkenlights.c, called blinkenlib.c,
copying the content of a test case.

then we added the file to /blink/blink/blink.mk

```diff
 o/$(MODE)/blink/blinkenlights.html: o/$(MODE)/blink/blinkenlights.o o/$(MODE)/blink/blink.a $(ZLIB)
        $(CC) $(LDFLAGS) $(TARGET_ARCH) $^ $(LOADLIBES) $(LDLIBS) -o $@
+o/$(MODE)/blink/blinkenlib: o/$(MODE)/blink/blinkenlib.o o/$(MODE)/blink/blink.a $(ZLIB)
+       $(CC) $(LDFLAGS) $(TARGET_ARCH) $^ $(LOADLIBES) $(LDLIBS) -o $@
 o/$(MODE)/blink/blinkenlights: o/$(MODE)/blink/blinkenlights.o o/$(MODE)/blink/blink.a $(ZLIB)
        $(CC) $(LDFLAGS) $(TARGET_ARCH) $^ $(LOADLIBES) $(LDLIBS) -o $@
 o/$(MODE)/i486/blink/blinkenlights: o/$(MODE)/i486/blink/blinkenlights.o o/$(MODE)/i486/blink/blink.a o/$(MODE)/i486/third_party/libz/zlib.a
@@ -156,5 +158,6 @@ o/$(MODE)/blink/oneoff.com: o/$(MODE)/blink/oneoff.o o/$(MODE)/blink/blink.a

 o/$(MODE)/blink:                               \
                o/$(MODE)/blink/blinkenlights   \
+               o/$(MODE)/blink/blinkenlib      \
                o/$(MODE)/blink/blink           \
                $(BLINK_HDRS:%=o/$(MODE)/%.ok)
```


when compiling, we get the error undefined ref. to TerminateSignal.

by looking at instances of Terminatesignal,
it's clear that both test.h and blinkenlights
implement that handler, required for a working program.

The minimal working example is this:

```
struct System *s;
struct Machine *m;
struct XedDecodedInst xedd;

void TerminateSignal(struct Machine *m, int sig, int code) {
  exit(100);
}

void SetUp(void) {
  InitMap();
  s = NewSystem(XED_MACHINE_MODE_LONG);
  unassert((m = NewMachine(s, 0)));
  m->xedd = &xedd;
  memset(&xedd, 0, sizeof(xedd));
}

void TearDown(void) {
  FreeMachine(m);
}

int main(int argc, char *argv[]) {
  puts("hello world");

  SetUp();

  uint8_t op[] = {0x8d, 0x04, 0x03}; /* lea (%rbx,%rax,1),%eax */
  Write64(m->bx, 0x2);
  Write64(m->ax, 0xffffffff);

  TearDown();
}

```

the code was taken straight from a test case.


compilation is made via this:
```
make MODE=tiny CC=clang

./o/tiny/blink/blinkenlib
hello world
```


we have a setup we can use to experiment now



## setup post-bug

after some issues, it's clear that --disable-all

will also disable threads, and when it does that stuff
breaks. code pages will result not executable, and some
emulated processes will segfault.

solution:
```
./configure --disable-all --enable-threads
make

./o/blink/blinkenlib
```

