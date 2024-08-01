
the wasm (emscriptend) runtime:

by default, wasm programs do not quit.
I assume that this also means that we can initialize
structs and data, such as the blink runtime,
and keep calling the step function from async js without fear of 
loosing data.

https://emscripten.org/docs/getting_started/FAQ.html?highlight=exported_runtime_methods#what-does-exiting-the-runtime-mean-why-don-t-atexit-s-run


## exporting functions to js in emscripten

https://emscripten.org/docs/getting_started/FAQ.html?highlight=exported_runtime_methods#why-do-functions-in-my-c-c-source-code-vanish-when-i-compile-to-webassembly

from the code, this requires the macro
EMSCRIPTEN_KEEPALIVE



## compiling the test

```
make
```

