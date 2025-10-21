#!/bin/bash

cd musl_binutils

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
# clone latest binutils
#---------------------
if [ ! -d binutils-gdb ] ; then
  git clone --depth 1 git://sourceware.org/git/binutils-gdb.git binutils-gdb
fi


#---------------------
# create build directory
#---------------------
mkdir -p build
cd build


#---------------------
# Run ./configure for a
# musl-only static build
#---------------------
common_configure_flags=(
    "--enable-default-execstack=no"
    "--enable-deterministic-archives"
    "--enable-new-dtags"
    "--disable-doc"
    "--disable-gprof"
    "--disable-nls"
    "--disable-binutils"
    "--disable-gdb"
    "--disable-gdbserver"
    "--disable-libdecnumber"
    "--disable-readline"
    "--disable-sim"

    "--disable-werror"
    "--enable-static"
    "--enable-plugins=no"
    "--enable-targets=x86_64-linux-musl"
    "--target=x86_64-linux-musl"
    "--disable-shared" 
)
# "--host=wasm32"

CC=musl-gcc CFLAGS="-O3 -static --static -static-libgcc -static-libstdc++" CXXFLAGS="-O3 -static --static" ../binutils-gdb/configure "${common_configure_flags[@]}"


#---------------------
# build as and ld
#---------------------
make all
strip --strip-unneeded gas/as-new
strip --strip-unneeded ld/ld-new

#---------------------
# copy as and ld in
# the web assets folder
#---------------------
cp gas/as-new ../../webapp/src/assets/assemblers/gnu-as.elf
cp ld/ld-new ../../webapp/src/assets/assemblers/gnu-ld.elf
