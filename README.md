# x86-64 playground

A browser-based x86-64 assembly playground, powered by a WebAssembly port of the Blink emulator.

Online at https://x64.halb.it

<img src="./docs/preview2.jpg" />

The project is composed of two elements:
- `emscripten_blink` a fork of the [blink](https://github.com/jart/blink/) x86-64 emulator, compiled to WebAssembly and modified to expose a typescript API
- `svelte_blinkenweb` a svelte web app implementing a mobile-friendly frontend for the blink Wasm emulator.

The assemblers provided by the app are traditional x86-64 ELFs, emulated client-side in the blink runtime.



## Licenses

The logo for this website is based on work distributed under the Creative Commons Attribution License [CC BY 3.0](https://creativecommons.org/publicdomain/mark/1.0/)
by [Nur Achmadi Yusuf](https://thenounproject.com/icon/wizard-hat-6586306/)



