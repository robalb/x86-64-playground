
# todo: import git repo from pinned commit, if not done already.
# todo: setup symlinks
# cp -rd /home/al/projects/blinkenlights/blink/ .

emscripten_flags="\
-sENVIRONMENT=web \
-sEXPORTED_RUNTIME_METHODS='[\"ccall\",\"cwrap\"]' \
-sALLOW_MEMORY_GROWTH=1 \
-sEXPORT_ES6=1 \
-sMODULARIZE \
-s EXPORT_NAME=\"blinkenlib\" \
"

cd blink && emconfigure ./configure --disable-all LDFLAGS="$emscripten_flags"
