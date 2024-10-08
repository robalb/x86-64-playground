# x86-64 playground

a wasm-based x86-64 assembly playground, running entirely in the browser

<img src="./docs/preview.png" />

The project is composed of two elements:
- `emscripten_blink` a fork of the [blink](https://github.com/jart/blink/) x86-64 emulator, modified to run on wasm with a javascript api.
- `svelte_blinkenweb` a svelte webapp that depends on the wasm build artifacts of `emscripten_blink` to run.


## Project design

### context

In the world of ctf competitions, binary exploitation concepts like buffer overflows or stack frames are explained with abstract diagrams.<br/>

These concepts are then immediately put into practice with tools like gdb, which require basic knowledge of linux, terminals, and python.
Students approaching this world for the first time will often struggle to map the abstract concepts they learned with the visualizations provided by these tools,
and will often find themselves fighting both the concepts and the tools at the same time.

The goal of this project is to provide a middle ground between the abstract explanations and the tools used on the field,
by implementing an educational tool that looks like gdb, but runs in an user-friendly web page.



### Goals

- Implement a simple x86-64 assembly playground/ debugger. It should feature a simple assembly code editor,
  and basic gdb-like commands: stepi, continue, run.
- The project should have a user-friendly, non-cluttered interface
- The project should display data in the same way as gdb+pwngdb or gdb+gef,so that
  users will find the data visualizations familiar
- The stack visualization should be customizable to show and highlight sections like canaries,
  function frames, buffers.
- The project should be lightweight and capable to work offline, so that it will work in areas with slow internet.

Some non-goals:

- I don't want to implement an actual debugger, or the frontend for an actual debugger: Gdb is complex, and
  in a ctf context it's always used with heavyly scripted setups. It would never be practical in a browser.



### Design choices

**the code** can either run server side, like godbolt, or in wasm. 
- wasm does not require a server, works offline, and it's something I want to practice. In 2024, this is supported by all brosers.

<br/><br/>

**The wasm runtimes** for x86-64 that i know are blink and unicorn.
- blink is lightweight, and emulates a whole linux runtime. It does not have apis, but it compiles to wasm
- unicorn has a [wasm port, with js apis](https://github.com/AlexAltea/unicorn.js), but it does not simulate a linux runtime, and it's significantly heavier than blink

Forking blink will probably require more work, but it will lead to better results. I will also learn more.

<br/><br/>

**The interface** can either be a Tui running in xterm.js, or html.
- a tui interface will not require any frontend work, since emscripten autogenerates everything. but it will not be accessible, and I don't
  have experience buiding tuis.
- an html interface is more accessible, but it will require a js api and wrapper around the wasm backend.

In order to maintain visual consistency with previous work, I want to implement everything in html. Again, I will also
learn more from this choice. There could be performance implications, that must be monitored.

<br/><br/>

**The disassembler** is integrated in blink, but it only supports at&t syntax. It shoud not be too hard to add support for Intel dialect, which is usually preferred in ctfs due to
the clearer memory operands.

<br/><br/>

**The assembler**: blink does not implement an assembler. there is a wasm port of [capstone, with js api](https://alexaltea.github.io/keystone.js/) by the same author of the unicorn port that
looks promising. the wasm file is 5Mib unfortunately, which is a lot compared to the 200k of blink.

<br/><br/>

**wasm - js interface**: 
the running program is passed to wasm via the emscripten VFS api. this adds a significant weight to the emscripten js wrapper.
In the future we could pass the program bytes to wasm via a simple malloc+arraybuffer copy. and write the file to the vfs in the wasm side.
With some extra work, should be able to remobe the js wrapper completely.

<br/><br/>

**web framework**: I'm using Vite.js as the bundler. Compared to a vanilla js setup, I want the ability to organize the frontend in components, and I want
to write html-in-js, which is what I am used to. This mean that any modern framework could work.
The requirements for a framework are: 
- light runtime (it would be pretty embarassing if the javascript bundles are heavier than the whole x86-64 emulator)
- don't enforce virtual dom or reactive paradigms, since we will mostly permform manual, imperative dom updates .
- Ideally, only jsx and composability, no reactivity or runtime should be provided.

I don't know any framework like this, so i'm temporarily using svelte for its light runtime.
According to the firefox profiler, right now the main performance bottlenecks are in my imperative dom updates.



