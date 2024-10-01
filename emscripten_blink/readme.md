
this is temporary scaffolding
for a blinkenlights fork.

It compiles a web-friendly
library version of blinkenlights into a wasm
file, which is then imported into a
svelte web project

## compiling the wasm binary

1. install the following dependencies: [emscripten](https://emscripten.org/docs/getting_started/downloads.html)
   the version used for this project is:
    ```
    > emsdk list | grep INSTALLED
           3.1.64             INSTALLED
           3.1.64    INSTALLED
      *    sdk-releases-fd61bacaf40131f74987e649a135f1dd559aff60-64bit    INSTALLED
      (*)    releases-fd61bacaf40131f74987e649a135f1dd559aff60-64bit      INSTALLED
      (*)    node-18.20.3-64bit           INSTALLED

    ```
1. the blinkenlights fork is currently stored in `blink/`
1. run `./init.sh` to initialize the project
1. run `./compile.sh` to compile the wasm file, and copy it into the svelte project assets folder


## A tour of the project

#### the original code

So far this is just a light fork of [blinkenlights](https://github.com/jart/blink/). You can read its documentation on github.

Originally, the project entry point is in `blink/blink/blink.c` for the non-tui program `blink`,
and `blink/blink/blinkenlights.c` for the tui program `blinkenlights`

You configure and compile the project by running
```
./configure
make o//blink/blinkenlights
```

The resulting binary will be in `blink/o/blink/blinkenlights`

#### the patches

The additions I made are:
- added a new entry point: `blink/blink/blinkelib.c`
- added a new target in make for that entrypoint: `o//blink/blinkenlights` and `o//blink/blinkenlights.js` 
  you can find it in the makefile `blink/blink/blink.mk`

If you want to compile that entrypoint in a regular, non-wasm executable, run:
```
./configure --disable-all
make o//blink/blinkenlib
```

#### from patches, to wasm

In order to run the project in the browser we are using the emscripten toolchain,
that will compile everything into webassembly, and will generate both a wasm and a js file.

Emscripten provides magical wrappers around classical toolchains
like the configure+make being used in this project:

- `./configure` becomes `emconfigure ./configure`
- `make target` becomes `emmake make target`

We have some custom options that make these commands a bit longer, which is why
they are wrapped in the custom scripts:

- `init.sh`
- `compile.sh`

## inspect wasm file

```
wasm-dis blink/o/blink/blinkenlib.wasm | less
```

this is useful for inspecting import and export symbols

## ide support in the project

#### clangd lang servers / nvim / lunarvim

Tested on a stock installation of lunarvim.

By default, the language server (clangd) fails to recognize the file imports, since
the project is missing the compile_commands.json.

since this project is based on make, you can easily generate the compile commands using bear:

```
./configure --disable-all
bear -- make MODE=tiny CC=clang
```

Then, if you launched lunarvim before the compile_commands.json existed,restart the language server:

`:LspRestart`

Now you can explore the project with a fully working Language server, taking advantage of 
VIM commands like `gd`, `gD` et all.



## scaffolding todo

move the blinkenlights fork in a dedicated repo, use git submodules from here



