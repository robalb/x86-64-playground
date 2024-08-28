#!/bin/sh

# temprary shell script i'm using to test stuff.
# do not push

cp /home/al/projects/shellcode-playground/playground ./example_elf

#note: clang is not required, gcc works the same
#make MODE=tiny CC=clang
#make MODE=tiny
make
./o/blink/blinkenlib
