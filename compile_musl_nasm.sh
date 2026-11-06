#!/bin/bash

NASM_REPO="https://github.com/robalb/nasm.git"
NASM_COMMIT="97baa411775b48963826d437ce51f796263f7246" 

cd musl_nasm

#---------------------
# check dependencies
#---------------------
requirements=(
    "git"
    "musl-gcc"
    "gcc"
    "make"
    "perl"
    "autoconf"
    "automake"
)

for cmd in "${requirements[@]}"; do
  command -v "$cmd" >/dev/null 2>&1 || { echo >&2 "Required program $cmd is not installed. Aborting."; exit 1; }
done

#---------------------
# fetch the nasm repo
# at a pinned commit.
#---------------------
if [ ! -d nasm ] ; then
  git init nasm
  git -C nasm remote add origin "$NASM_REPO"
fi
git -C nasm fetch --depth 1 origin "$NASM_COMMIT"
git -C nasm checkout --force FETCH_HEAD
git -C nasm clean -fdx


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
cflags=(
    "-O2"
    "-DOF_ONLY"
    "-DOF_ELF64"
    "-DOF_ELF32"
    "-DOF_BIN"
    "-fno-asynchronous-unwind-tables"
)

./autogen.sh
CC=musl-gcc CFLAGS="${cflags[*]}" LDFLAGS="-static" ./configure "${common_configure_flags[@]}"


#---------------------
# build nasm, stripped
#---------------------
make nasm
strip --strip-unneeded nasm

#---------------------
# copy nasm in the
# web assets folder
#---------------------
cp nasm ../../webapp/src/assets/assemblers/nasm.3.00.elf
