<script>
import { minimalEditor, basicEditor, fullEditor, readonlyEditor } from "prism-code-editor/setups"
// Importing Prism grammars
import "prism-code-editor/prism/languages/nasm"
import {onMount} from 'svelte'
let editor_elem;

let template_old =  "; welcome\n; this editor executes intel assembly\n; by emulating it in your browser.\n; This process is completely offline! \n \n mov rax, 1337\n push rax\n mov rbx 12\n syscall\n\n\n\n\n\n\n\n\n\n";
let template =`
.intel_syntax noprefix

.global _start
.text

_start:
  mov rrax, 0x0a21646c726f5720
  push rax
  mov rax, 0x6f6c6c6548
  push rax

  mov rax, 1
  mov rdi, 1
  mov rsi, rsp
  mov rdx, 14
  syscall

  mov rax, 60
  xor rdi, rdi
  syscall

`;

onMount(() => {

  const editors = basicEditor(
    editor_elem,
    {
      language: "nasm",
      theme: "github-dark",
      value: template,
    },
    () => console.log("ready"),
  )
})
</script>

<div class="container">
  <div class="editor" bind:this={editor_elem}> </div>
</div>

<style>
  .editor{
    padding-bottom: 1.5rem;
  }
  .container{
    overflow: auto;
    max-height: 100%;
    height: 100%;
    background-color: #0d1117;
  }
</style>
