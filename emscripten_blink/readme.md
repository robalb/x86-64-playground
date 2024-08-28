
this is temporary scaffolding
for a blinkenlights patch.

It compiles a web-friendly
library version of blinkenlights into a wasm
file, which is then imported into a
svelte web project

## usage

1. # clone the repo `./get_blink.sh`
2. # compile the wasm file, and copy it into the svelte project `./deploy_web.sh`

## inspect wasm file

```
wasm-dis blink/o/blink/blinkenlib.wasm | less
```

this is useful for inspecting import and export symbols

##todo

setup symlink based patches: create
init.sh that will clone blink and copy the symlinks,
then call emconfigure

