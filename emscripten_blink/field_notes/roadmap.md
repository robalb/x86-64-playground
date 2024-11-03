## TODO:

-[x] understand exit and signals, fix exit

-[x] clean files, and extra stuff that is not needed, even in blinkenlib.c

-[x] conceptually separate load and start.
  load should only write the elf in the vfs.
  start should call loadelf.
  running status should be checked against
  the m->running flags, not our own.

- [x] design good wasm-side api, write stuff in header file.

-[x] clean notes, paste design doc

### todo week 2

- [x] integrate assembler
- test proper design for code editor and disassembler sharing the same panel
- first release with github pages

### todo week 3

-[x] complete disassembler integration: avoid full rerender, add window scroll
  when rsp changes.
-[x] complete the disassembler todos: proper BEM, proper c defines (#ifdef HTML)
-[x] add a good ui for the controls
-[x] first release with github pages
-[x] CI/CD pipeline. pushes to master should trigger a merge and then a checkout into github_pages. then trigger a build. the contents of /build should be copied into /docs, and pushed.
- test CI/CD pipeline that directly publishes to github pages without storing the artifacts in a branch. -> https://github.com/actions/upload-pages-artifact
-[x] mobile layout

-[x] Figure out design system:
     - what about MELT ui, styling every melt ui element via the data-attributes the library sets? 
    overrides should be easy via custom styles.
      - what about elements that are not controlled by melt ui? such as basic buttons? https://www.w3.org/WAI/ARIA/apg/patterns/menubar/



## todo week 4

Story:

TODO: a complete refactor of the mode key.
mode should be set via a specific setter, and should be an Assemblers_key.
it should be used to render the assembler dropdown menu, together with the assemblers object.
changes to mode should not trigger changes to the Editor content.

We then need a way to reactively set the Editor content.

We then need a function to set the webapp state (for now, assembler mode and editor content, but in the future
there could be more options).
When a demo is selected this function is called.
we also need several serializers and deserializers compatible with this webappState.
when you click "share", the current webappState is serialized into an url.
when the page loads, or the url changes, some url param is deserialized and passed to
setWebAppstate.

we should refactor snippets.js into example_scripts.ts.
every example should be the combo codestring,Assemblers_key.
we can then create a custom webappstate serializer that takes this combo and 
generates a webappstate, that is passed to setWebAppState

Open Source code:
- Blink: ISC https://github.com/jart/blink/blob/master/LICENSE
- Svelte: MIT https://github.com/sveltejs/svelte?tab=MIT-1-ov-file#readme
- vitejs: MIT https://github.com/vitejs/vite?tab=MIT-1-ov-file#readme
- Melt UI: MIT https://github.com/melt-ui/melt-ui?tab=MIT-1-ov-file#readme
Binaries:
- binutils: GNU V2 https://github.com/bminor/binutils-gdb?tab=License-1-ov-file#readme
- Fasm: https://github.com/tgrysztar/fasm?tab=License-1-ov-file#readme

actual Todo list:

- [x] uri manager and uri appstate serializers
- [x] define diagnosticparser interface, associated to an assemblerMode.
  a diagnosticParse should parse the stout of a compiler when assembly fails,
  generating a standardized diagnostic output that is used by the editor to render error lines
- [x] add line error support to the editor. 
  this snippet shows how to tap in the editor renderer to add line highlights
    https://stackblitz.com/edit/vitejs-vite-y5pwon?file=src%2Fmain.ts,readme.md
  In the editor component, we'll need to listen to store.diagnostics, and when
  they are not null, render them.
  in store.notifyEditorContent we should add a line that resets the diagnostics



### backlog
- editor tooltip for asm guide, like in compiler explorer
  https://github.com/compiler-explorer/compiler-explorer/blob/main/lib/asm-docs/generated/asm-docs-amd64.ts
  https://stackblitz.com/edit/vitejs-vite-z2fgpu?file=src%2Fmain.ts
- invert taborder in the control rows. on desktop the current order is bad
- service worker. Understand: is github pages good enough for caching?
  can i solve eventual caching issues with service workers?
  https://web.dev/articles/service-worker-lifecycle
- adaptive favicon https://web.dev/articles/building/an-adaptive-favicon
  even better:
        <link rel="icon" href="" media="(prefers-color-scheme: dark)" type="image/png">
        <link rel="icon" href="" media="(prefers-color-scheme: dark)" type="image/svg+xml">
- completely remove the concept of snippets. make every state reachable by
  url. snippets will just be url that set the asm and the correct compiler
- add html syntax highlight to c disass.
- add intel syntax to c disass.




https://flatassembler.net/docs.php?article=manual#2.4
