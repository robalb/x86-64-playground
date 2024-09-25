#!/bin/sh

# todo: import git repo/submodule from pinned commit, if not done already.
# todo: setup symlinks
# cp -rd /home/al/projects/blinkenlights/blink/ .

exported_runtime_methods="\
\"ccall\",\
\"cwrap\",\
\"UTF8ToString\",\
\"mmapAlloc\",\
\"setValue\",\
\"getValue\",\
\"UTF8ToString\",\
\"stringToNewUTF8\",\
\"FS\",\
\"wasmExports\"\
"

emscripten_flags="\
-sENVIRONMENT=web \
-sALLOW_MEMORY_GROWTH=1 \
-sEXPORT_ES6=1 \
-sMODULARIZE \
-s EXPORT_NAME=\"blinkenlib\" \
-sEXPORTED_RUNTIME_METHODS='[$exported_runtime_methods]' \
"

cd blink && emconfigure ./configure --disable-all LDFLAGS="$emscripten_flags"
