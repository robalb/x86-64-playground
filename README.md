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
which has been patched and modified to run as a C library.
The low-level emulator APIs are expsed to the web app presentation layer via a Typescript wrapper.

<div align="center">
<img src="./docs/webapp_architecture.drawio-1-1.png" width="500px" height="auto" />
  <img src="./docs/compilation_steps.drawio-1.png" width="400px" height="auto" />

</div>

## How to build

Before building, you must have installed those dependencies:
- node
- texinfo
- emsdk
- musl-gcc
- make
- gcc
- flex
- bison

then you can run the individual scripts to build the dependencies needed for the webapp:
- `init_blink.sh`
- `compile_blink.sh`
- `compile_musl_binutils.sh`
- `compile_musl_nasm.sh`

Finally you can build the web application by going in the `webapp` folder and running:
- `npm i`
- `npm run build`


## Licenses

The logo for this website is based on work distributed under the Creative Commons Attribution License [CC BY 3.0](https://creativecommons.org/publicdomain/mark/1.0/)
by [Nur Achmadi Yusuf](https://thenounproject.com/icon/wizard-hat-6586306/)



