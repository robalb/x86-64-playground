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
- mobile layout




### backlog
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
