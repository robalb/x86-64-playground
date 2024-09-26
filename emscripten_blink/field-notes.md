
what additions I made to the blink codebase:
```
added file blink/blink/blinkenlib.c

modified makefile in blink/blink/blink.mk:
added the targets: (around line 119, close to the other blinkenlights.html target)

o/$(MODE)/blink/blinkenlib.html: o/$(MODE)/blink/blinkenlib.o o/$(MODE)/blink/blink.a $(ZLIB)
	$(CC) $(LDFLAGS) $(TARGET_ARCH) $^ $(LOADLIBES) $(LDLIBS) -o $@
o/$(MODE)/blink/blinkenlib: o/$(MODE)/blink/blinkenlib.o o/$(MODE)/blink/blink.a $(ZLIB)
	$(CC) $(LDFLAGS) $(TARGET_ARCH) $^ $(LOADLIBES) $(LDLIBS) -o $@
```

note: in a successive iteration, i replaced the .html target into .js, since i have my own
html, and i only need the js part


classic compilation steps:

```
./configure --disable-all
make o//blink/blinkenlib
```


emscripten compilation steps

```
emconfigure ./configure --disable-all LDFLAGS="-sENVIRONMENT=web"
emmake make o//blink/blinkenlib.html
```

note how all the flags that we want to pass to the emcc linker,
can be easily set via `./configure LDFLAGS=""`.
They will be appended to other flags, in `config.mk`.
To save time during experimentation they can be set directly in the config.mk

## file upload

https://stackoverflow.com/questions/69935188/open-a-file-in-emscripten-using-browser-file-selector-dialogue


emscripten alternative:
https://depth-first.com/articles/2019/10/16/compiling-c-to-webassembly-and-running-it-without-emscripten/


## assembler

https://github.com/AlexAltea/keystone.js






## issues running blink in wasm


#### initmap

when running InitMap(),

an unexpected code path is reached:
in 
map.c:115
```
GetBitsInAddressSpace()
```

something is not compatible, and
Abort is called.

The fact that blink has been already succesffuly run on wasm could indicate that this is
specific to the flags i'm using.
with a quick glance, these flags affect the code:
DISABLE_OVERLAYS,
HAVE_MAP_ANONYMOUS,
MAP_FIXED_NOREPLACE

solved with:
```
#ifdef __EMSCRIPTEN__
  return 32;
#else

```

moving on

#### loadprogram exits with err 127

This is weird, the elf fails to be parsed.
a quick view of the code seems to be just very portable
parsing of the file into a struct.

turns out, the way i'm importing the example elfs via 
vite static assets is wrong, and the elfs are somehow passing
via the typescript pipeline before ending up in the
arraybuffer.

explicitly defining any .elf as a static asset solved the problem
https://vitejs.dev/config/shared-options.html#assetsinclude

now files are working






