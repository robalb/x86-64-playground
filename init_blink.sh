#!/bin/bash

git submodule update --init --recursive
cd libblink

#---------------------
# check dependencies
#---------------------
declare -A pkg_for_cmd=(
    [emconfigure]="emscripten"
)

for cmd in "${!pkg_for_cmd[@]}"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Required '$cmd' is not installed, install '${pkg_for_cmd[$cmd]}', or (source /etc/profile.d/emscripten.sh). Aborting."
        exit 1
    fi
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
-sENVIRONMENT=web \
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
