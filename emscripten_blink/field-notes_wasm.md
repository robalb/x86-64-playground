
# wasm memory

### first: the javascript memory api

    views <--> arraybuffers <--> wasm memory

    view = uint8Array(buffer)

    buffer = ArrayBuffer(256)
    buffer = await fileObject.ArrayBuffer()

views are also called typed arrays, but they are just that:
views to an underlying arraybuffer
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
they all store data in the platform's default endianness.
If you want control over the endianness, you need a 
special view called [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
                                  |  |    |
                                  |  |    isLittleEndian
                                  |  value
                                  offset

the snippet above set the first byte to oxff, and the second to 0,
because it explicitly stored 0x00ff in a little endian word: `ff 00`

we want control over the endiannes, because wasm is little endian.
we don't want to break our code for the firefox-on-powerpc users
out there right?

### the wasm memory model

required read: [the mdn docs on webassembly](https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API)

web assembly memory is just a classical js arraybuffer. see [1](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory).

You can decide if you want the memory defined in the webassembly module, and export it to js
as an ArrayBuffer,
or if you want to define the memory in js, and then pass it to the module when you instantiate it.

Forget everything you know about paging, aslr, rwx...
The wasm virtual architecture will perform all its memory operations on 
a simple ArrayBuffer, so basically an uint8_t array.
address can start at 0. `42` is a valid pointer value.
All you need to know is that it's a little endian architecture, while js's endiannes is 
platform dependent

```c
EMSCRIPTEN_KEEPALIVE
int test_var = 2;
int* get_pointer(){
  return &test_var;
}
```

```js
//using emscripten pre-generated typedArray views
Module.HEAP8[Module._get_pointer()]
// 2

```

### The emscripten+libc memory

wasm is super simple, as long as you don't have a large program that uses the libc,
malloc, the file system, pipes,stdin,stdout...

That's when emscripten comes into play. by default, emscripten will generate
both the wasm file and a companion js file with 4000+ lines of code.
How does it work? can i get rid of it and just call the wasm exports?
I need pretty low level access to memory, and i don't need the fs. 
i probably don't need wrappers and converters.


TODO


### passing a file to wasm

TODO

idea: js api allow us to get an arraybuffer.
we can then get its size, and call malloc from js to allocate that memory.
then we copy the array into the allocated mem
then we call the wasm function we want from js, passing it the pointer to the
file we put in mem.
we just need to remember to free when we are done.

Why would we do this? basically blink already has code for a virtual filesystem.
we could teoretically use that, and remove completely the emscripten vfs dependencies.
for this to work tho, we would need to remove every filesystem call that blinkenlights does

read:
https://emscripten.org/docs/api_reference/Filesystem-API.html#including-file-system-support

### files  using emscripten

ok, we are temporarily going the the easy route of using
the emscripten js api.
All we need is to add FS, and some other stuff to
the exported runtime methods, then we can 
setup stdin/stdout handers in the Module.preRun method.
We can also create files from js

https://stackoverflow.com/questions/32912129/providing-stdin-to-an-emscripten-html-program


### calling js from wasm (emscripten edition)

we can only do this dynamically:
https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#calling-javascript-functions-as-function-pointers-from-c

sRESERVED_FUNCTION_POINTERS=10 <- max num of functions we will register at runtime 

and addFunction

### reading a struct from js

this part is kinda tricky.
we want to pass a struct to js when a machine is 
initialized.
since machines are initialized with a void call, we could
return a pointer to the struct.
escept js does not understand structs.

One possible hack would be to return a pointer to an array
of pointers.
I could harcode the meaning of each pointer 
both wasm-side and js-side, like a poor man's protobuff






### other stuff

https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory

wasm memory is always little endian, js interpreters are not.
js api offer a DataView for reading multi-byte values.

first, read about js typed arrays:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
you can also generate typed arrays from base64, or a local file (https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#selecting_files_using_drag_and_drop from there, you can call File.Arraybuffer)
then, read this:
https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#access-memory-from-javascript

wasm - js 

https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-direct-function-calls

call the function name prefixed with _

- integers can be passed as is
- js strings must be converted using ptr = stringToNewUTF8(someString)


