#!/bin/bash

cd demo_programs

#---------------------
# check dependencies
#---------------------
requirements=(
    "musl-gcc"
    "gcc"
    "make"
)
for cmd in "${requirements[@]}"; do
  command -v "$cmd" >/dev/null 2>&1 || { echo >&2 "Required program $cmd is not installed. Aborting."; exit 1; }
done

#---------------------
# compile all programs
#---------------------
make all

#---------------------
# copy all programs in
# the web assets folder
#---------------------
cp ./*.elf ../webapp/src/assets/demo_programs/
