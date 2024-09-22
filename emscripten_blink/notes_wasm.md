
# wasm memory

the javascript memory model:

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



https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory

wasm memory is always little endian, js interpreters are not.
js api offer a DataView for reading multi-byte values.

first, read about js typed arrays:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
you can also generate typed arrays from base64, or a local file (https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#selecting_files_using_drag_and_drop from there, you can call File.Arraybuffer)
then, read this:
https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#access-memory-from-javascript

# wasm - js 

https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-direct-function-calls

call the function name prefixed with _

- integers can be passed as is
- js strings must be converted using ptr = stringToNewUTF8(someString)


