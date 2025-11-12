#!/bin/bash

cd libblink

#---------------------
# check dependencies
#---------------------
declare -A pkg_for_cmd=(
    [emmake]="emscripten"
    [make]="base-devel"
)

for cmd in "${!pkg_for_cmd[@]}"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Required '$cmd' is not installed, install '${pkg_for_cmd[$cmd]}'. Aborting."
        exit 1
    fi
done

#---------------------
# compile blink wasm+js
#---------------------
emmake make o//blink/blinkenlib.js


#---------------------
# copy blink wasm+js in
# the web assets folder
#---------------------
cp ./o/blink/blinkenlib.wasm ../webapp/src/assets/
cp ./o/blink/blinkenlib.js ../webapp/src/assets/
