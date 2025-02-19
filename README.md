<div align="center" >
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/heroart_dark3.png">
    <img width="450px" height="auto" src="./docs/heroart_light.png" alt="x86-64 Playground" />
  </picture>
</div>
<br/>


<div align="center">
  <img alt="GitHub License" src="https://img.shields.io/github/license/robalb/x86-64-playground">
  <img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fx64.halb.it">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/robalb/x86-64-playground?style=flat">
</div>

---

<p >
x86-64 playground is an online assembly editor and GDB-like debugger, powered by a Wasm port of the <a href="https://github.com/jart/blink/">Blink</a> x86-64-linux emulator.</p>
<p>It's part of a project to make asm tooling more accessible on the web.
It's available as a web app on https://x64.halb.it or it can be embedded in a web page, to add interactive elements to your technical documentation. </p>

---


<br/>

<img src="./docs/preview2.jpg" />


## features

- Test and debug your assembly snippets from the browser, on an emulated x86-64-Linux environment. The web app offers a wide range of popular amd64 assemblers: GNU Binutils, Fasm, Nasm. You can fully customize the command line arguments or even provide your own assemblers.
- Run and debug your assembly snippets, or any x86-64-Linux ELF you upload. The app features an accessible interface inspired by the GDB debugger where you can step into your program, and visualize disassembly, memory and registers of the emulated process.
- Share your assembly snippets with others, or embed the app in any web page to add interactive elements to your technical articles.

## Project overview

The web app works as a single static page, without any server side component. It's compiled and hosted on GitHub pages.
Both the emulator and debugger run client side, in a webAssembly port of the [blink](https://github.com/jart/blink/) emulator
which has been patched and modified to run as a C library.
The low-level emulator APIs are expsed to the web app presentation layer via a Typescript wrapper.

<img src="./docs/webapp_architecture.drawio-1-1.png" width="800px" height="auto" />



## Licenses

The logo for this website is based on work distributed under the Creative Commons Attribution License [CC BY 3.0](https://creativecommons.org/publicdomain/mark/1.0/)
by [Nur Achmadi Yusuf](https://thenounproject.com/icon/wizard-hat-6586306/)



