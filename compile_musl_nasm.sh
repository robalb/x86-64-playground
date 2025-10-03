#!/bin/bash

cd musl_nasm

#---------------------
# check dependencies
#---------------------
requirements=(
    "wget"
    "musl-gcc"
    "gcc"
    "make"
)

for cmd in "${requirements[@]}"; do
  command -v "$cmd" >/dev/null 2>&1 || { echo >&2 "Required program $cmd is not installed. Aborting."; exit 1; }
done

#---------------------
# clone nasm v3.00
#---------------------
if [ ! -d nasm ] ; then
  wget https://www.nasm.us/pub/nasm/releasebuilds/3.00/nasm-3.00.tar.gz
  tar -xf nasm-3.00.tar.gz
  mv nasm-3.00 nasm
fi


# nasm does not support out-of-tree builds,
# so we simply move into the source dir in
# order to perform our build
cd nasm


#---------------------
# Run ./configure for a
# musl-only static build
#---------------------
common_configure_flags=(
    "--disable-gdb"
    "--disable-werror"
    "--disable-largefile"
    "--disable-gc"
)

CC=musl-gcc LDFLAGS="-static" ./configure "${common_configure_flags[@]}"


#---------------------
# build nasm, stripped
#---------------------
make
make strip

#---------------------
# copy nasm in the
# web assets folder
#---------------------
cp nasm ../../webapp/src/assets/assemblers/nasm.elf

