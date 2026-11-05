#!/bin/bash

set -e

cd musl_binutils

#---------------------
# check dependencies
#---------------------
requirements=(
    "musl-gcc"
    "gcc"
    "make"
    "bison"
    "flex"
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
rm -rf build
mkdir build
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
    "--disable-libctf"

    "--disable-werror"
    "--enable-static"
    "--enable-plugins=no"
    "--enable-targets=x86_64-linux-musl"
    "--target=x86_64-linux-musl"
    "--disable-shared" 
)
cflags=(
    "-Os"
    "-ffunction-sections"
    "-fdata-sections"
    "-fno-asynchronous-unwind-tables"
    "-fno-unwind-tables"
    "-static"
    "--static"
    "-static-libgcc"
    "-static-libstdc++"
)

CC=musl-gcc CFLAGS="${cflags[*]}" CXXFLAGS="-O3 -static --static" LDFLAGS="-Wl,--gc-sections" ../binutils-gdb/configure "${common_configure_flags[@]}"


#---------------------
# build as and ld
#---------------------
make MAKEINFO=true all
strip --strip-unneeded gas/as-new
strip --strip-unneeded ld/ld-new

#---------------------
# copy as and ld in
# the web assets folder
#---------------------
cp gas/as-new ../../webapp/src/assets/assemblers/gnu-as.elf
cp ld/ld-new ../../webapp/src/assets/assemblers/gnu-ld.elf

