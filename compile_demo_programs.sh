#!/bin/bash

cd demo_programs

#---------------------
# check dependencies
#---------------------
declare -A pkg_for_cmd=(
    [musl-gcc]="musl"
    [gcc]="gcc"
    [make]="base-devel"
)

for cmd in "${!pkg_for_cmd[@]}"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Required '$cmd' is not installed, install '${pkg_for_cmd[$cmd]}'. Aborting."
        exit 1
    fi
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
