
# understanding the blink VFS api

the idea is that since blink already has a VFS, 
I could modify it to run on wasm, without the need
for the wasm vfs. it's pretty silly to have multiple vfs,
with the huge js bunle it includes.

an overview:
every single file operation such as `open` in blink uses the
wrapper `VFSopen`.

when overlays and VFS are disabled, the VFS functions are just
a macro rename of the libc functions.

otherwise, everything will read from a virtual fs, which emulates
in part an unix fs. 

There are two apis:
- overlays.c
- vfs.c

I believe the only time blink calls the libc is in overlays.
I also beleve that overlays is what allows us to include files
from the host, in the virtual file system. that's why we have open, and everything.

This probably means that if we disable overlays, but we keep the vfs,
we will have file operations that work on wasm.
we'll just need some custom function that writes the files we need
into the vfs. no need to mount overlays.


Entrypoints:
blink.c:386
```
InitMap()

#ifndef DISABLE_OVERLAYS
  if (SetOverlays(FLAG_overlays, true)) {
    WriteErrorString("bad blink overlays spec; see log for details\n");
    exit(1);
  }
#endif
#ifndef DISABLE_VFS
  if (VfsInit(FLAG_prefix)) {
    WriteErrorString("error: vfs initialization failed\n");
    exit(1);
  }
#endif

InitBus()
```


overlays are explained here
https://github.com/jart/blink/?tab=readme-ov-file#environment-variables
