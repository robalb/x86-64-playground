
This is a guide on how to setup and compile the backend side of the x86-64 playground.

To give some more context, this crude setup is temporary scaffolding for a [blinkenlights](https://github.com/jart/blink/) fork.
It compiles a web-friendly
library version of blinkenlights into a wasm
file, which is then imported into a
svelte web project.
In the future the current setup will change, and the blinkenlights fork will move to a dedicated repository,
following more standard practices.

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
1. run `./init_blink.sh` to initialize the project
1. run `./compile_blink.sh` to compile the wasm file, and copy it into the svelte project assets folder

After executing all these steps, the web application defined in `./webapp` will include the wasm dependencies 
necessary to run an emulator in the browser. you can follow the guides in `./webapp/readme.md` to compile and launch it.
Everythin in that folder is a standard web app, no weird or magical elements.


## A tour of the project

At the core of this project, there is the [blinkenlights](https://github.com/jart/blink/) project. You can read its documentation on github.
The original code has been slighly modified to work as a library. But before we go into those details, let's have a look 
at the original, unmodified blinkenlights code:

#### the original blinkenlights code

this is how you would interact with the original blinkenlights project:

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

- `init_blink.sh`
- `compile_blink.sh`

## inspect wasm file

```
wasm-dis blink/o/blink/blinkenlib.wasm | less
```

this is useful for inspecting import and export symbols

## ide support in the project

#### clangd lang servers / nvim / vscode

Tested on a stock installation of: 
- lunarvim, 
- lazynvim, 
- vscode(with the clangd extension)
- nvchad(with the clangd lsp)

By default, the language server (clangd) fails to recognize the file imports, since
the project is missing the compile_commands.json.

since this project is based on make, you can easily generate the compile commands using bear:

```
./configure --disable-all
bear -- make MODE=tiny CC=clang
```

Then, if you launched nvim before the compile_commands.json existed,restart the language server:

`:LspRestart`

Now you can explore the project with a fully working Language server, taking advantage of 
VIM commands like `gd`, `gD` et all.

