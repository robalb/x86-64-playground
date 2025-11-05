
This is a guide on how to setup and compile the backend side of the x86-64 playground.

The core of the playground is a fork of the [Blink](https://github.com/jart/blink/) x86-64-linux emulator, 
which has been modified to expose a WASM library since the original project is designed to work as a TUI only,
and does not expose any low-leve API.

Some extra context is provided in the [design document](./design.md) for this project.

At high level, this is the structure of the repository:
```
- libblink/ (git submodule)
- webapp/
- init_blink.sh
- compile_blink.sh
```

The fork of blink is included as a git submodule.
When you run `./init_blink.sh` and then `./compile_blink.sh`, 
the fork is cloned and compiled, resulting in a WASM file and a companion javascript file.

These two files are then automatically moved into the assets folder of the webapp, in `webapp/src/assets/`

NOTE: If you simply want to modify the web application, you don't need to compile Blink. Precompiled assets are 
already saved in git in `webapp/src/assets`. Simply follow the instructions for the webapp, in `webapp/README.md`

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
1. the blinkenlights fork is currently stored in `libblink/`
1. run `./init_blink.sh` to download/update the submodule and initialize the project
1. run `./compile_blink.sh` to compile the wasm file. The resulting files will be automatically copied into the webapp assets folder in `webapp/src/assets/`

After executing all these steps, the web application defined in `./webapp` will include the wasm dependencies 
necessary to run an emulator in the browser. you can follow the guides in `./webapp/README.md` to compile and launch it.
Everything in that folder is a standard web app, no weird or magical elements.


## A tour of the project

At the core of this project, there is the [blink](https://github.com/jart/blink/) emulator. You should read its documentation on github.
The original code has been slighly modified to work as a library. But before we go into those details, let's have a look 
at the original, unmodified blink code:

#### the original blink code

this is how you would interact with the original blink project:

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

[you can read the diff here](https://github.com/robalb/blink/commit/4671867ff9fdc68f5245b3a13f0efc253d3c15c8)

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

