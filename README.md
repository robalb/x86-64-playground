<div align="center" >
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/heroart_dark3.png">
    <img width="450px" height="auto" src="./docs/heroart_light.png" alt="x86-64 Playground" />
  </picture>
</div>
<br/>


<div align="center">
  <img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/robalb/x86-64-playground/deploy_github_pages.yml">
  <img alt="GitHub License" src="https://img.shields.io/github/license/robalb/x86-64-playground">
  <img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fx64.halb.it">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/robalb/x86-64-playground?style=flat">
  
</div>

---

<p >
x86-64 playground is an online assembly editor and GDB-like debugger, powered by a Wasm port of the <a href="https://github.com/jart/blink/">Blink</a> x86-64-linux emulator.</p>
<p>
  It is designed to make assembly tooling more accessible on the web. You can use it as a standalone web app at https://x64.halb.it or embed it in web pages to enhance your technical documentation with interactive elements.
</p>

---


<br/>

<img src="./docs/preview3.jpg" />


## ✨ Features

- Test and debug your assembly snippets from the browser, on an emulated x86-64-Linux environment. The web app offers a wide range of popular amd64 assemblers: GNU Binutils, Fasm, Nasm. You can fully customize the command line arguments or even provide your own assemblers.
- Run and debug your assembly snippets, or any x86-64-Linux ELF you upload. The app features an accessible interface inspired by the GDB debugger where you can step into your program, and visualize disassembly, memory and registers of the emulated process.
- Share your assembly snippets with others, or embed the app in any web page to add interactive elements to your technical articles.
- **Offline first**: All the code you write, or the excutables you debug are never sent to the server. Everything is emulated client side in your browser, and works without an internet connection.

## Project overview

The web app works as a single static page, without any server side component. It's compiled and hosted on GitHub pages.
Both the emulator and debugger run client side, in a webAssembly port of the [blink](https://github.com/jart/blink/) emulator
which has been [patched](https://github.com/robalb/blink) and modified to run as a C library.
The low-level emulator APIs are expsed to the web app presentation layer via a Typescript wrapper.

See the [Design document file](./docs/design.md) for an overview of the technical choices behind the project.

<div align="center">
<img src="./docs/webapp_architecture.drawio-1-1.png" width="500px" height="auto" />
  <img src="./docs/compilation_steps.drawio-1.png" width="400px" height="auto" />

</div>

## Build the project

This project is subdivided in two areas of development:
- The web app 
- the Blink WASM engine

### Working on the web app 

The web app is located in the `webapp` folder, 
and is a regular Typescript+Svelte+vite web app.
Check out `webapp/README.md` for instructions on how to 
build, modify and run it.

The magic that powers the webapp is the WASM bundle 
stored in `webapp/assets/blinkenlib.wasm`, which contains 
the compiled Blink engine. Since the compiled file 
is stored in git, you can work on the web app without worrying about 
extra compilation steps, GNU autotools, or other spooky tools.

If you want to understand or modify the low-level behaviour of the emulator, you will need to get your hands on the blink library, and recompile it. 
This will result in a new file that will override the existing file in
`webapp/assets/blinkenlib.wasm`.

### Working on the blink library

This section is described roughly in [docs/setup.md](./docs/setup.md).
For more context, check out the [design document](./docs/design.md) for this Project,
The commits in this [fork of blink](https://github.com/robalb/blink), and the standalone 
project [blink.js](https://github.com/robalb/x86-64-blink-js)

## Licenses

The logo for this website is based on work distributed under the Creative Commons Attribution License [CC BY 3.0](https://creativecommons.org/publicdomain/mark/1.0/)
by [Nur Achmadi Yusuf](https://thenounproject.com/icon/wizard-hat-6586306/)



