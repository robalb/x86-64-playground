
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
