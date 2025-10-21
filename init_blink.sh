#!/bin/bash

cd blink

#---------------------
# check dependencies
#---------------------
requirements=(
    "emconfigure"
)

for cmd in "${requirements[@]}"; do
  command -v "$cmd" >/dev/null 2>&1 || { echo >&2 "Required program $cmd is not installed. Aborting."; exit 1; }
done

#---------------------
# Run ./configure for a
# wasm+js build of blink
#---------------------
exported_runtime_methods=(
  '"UTF8ToString"'
  '"stringToNewUTF8"'
  '"AsciiToString"'
  '"FS"'
  '"callMain"'
  '"addFunction"'
  '"wasmExports"'
)
# Convert the array into a comma-separated string
exported_runtime_methods_str=$(IFS=,; echo "${exported_runtime_methods[*]}")
emscripten_flags="\
-sENVIRONMENT=web,node \
-sALLOW_MEMORY_GROWTH=1 \
-sALLOW_TABLE_GROWTH=1 \
-sEXIT_RUNTIME=0 \
-sEXPORT_ES6=1 \
-sMODULARIZE \
-sEXPORT_NAME=\"blinkenlib\" \
-sEXPORTED_RUNTIME_METHODS='[$exported_runtime_methods_str]' \
"
emconfigure ./configure \
  --disable-all \
  LDFLAGS="$emscripten_flags" \
  CPPFLAGS="-DHTML -D_FILE_OFFSET_BITS=64 -D_DARWIN_C_SOURCE -D_DEFAULT_SOURCE -D_BSD_SOURCE -D_GNU_SOURCE"
