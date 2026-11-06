# X86-64 Playground frontend

This folder contains all the code required to build a run the x86-64-playground webapp.
It's a regular Svelte + Vite + Typescript webapp.

The magic that powers the webapp is the WASM bundle 
stored in `webapp/assets/blinkenlib.wasm`, which contains 
the compiled Blink engine. Since the compiled file 
is stored in git, you can work on the web app without worrying about 
extra compilation steps, GNU autotools, or other spooky tools.

If you want to understand or modify the low-level behaviour of the emulator, you will need to get your hands on the blink library, and recompile it. 
This will result in a new file that will override the existing file in
`webapp/assets/blinkenlib.wasm`.

You can read more about that in the main [README](../README.md) for this project.

## Getting started

First, make sure you have the latest version of Node and NPM installed. The recommended way to get
both of them is via [nvm](https://github.com/nvm-sh/nvm)

Install the dependencies:

`npm ci`

Then run the project in development mode:

`npm run dev`

The website will be availabe at http://localhost:5173

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

