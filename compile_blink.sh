#!/bin/bash

cd libblink

#---------------------
# check dependencies
#---------------------
requirements=(
    "emmake"
    "make"
)
for cmd in "${requirements[@]}"; do
  command -v "$cmd" >/dev/null 2>&1 || { echo >&2 "Required program $cmd is not installed. Aborting."; exit 1; }
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
