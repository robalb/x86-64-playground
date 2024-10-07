<script>
import { minimalEditor, basicEditor, fullEditor, readonlyEditor } from "prism-code-editor/setups"
// Importing Prism grammars
import "prism-code-editor/prism/languages/nasm"
import {onMount} from 'svelte'
let editor_elem;

onMount(() => {

  const editors = basicEditor(
    editor_elem,
    {
      language: "nasm",
      theme: "github-dark",
      value: "; welcome\n; this editor executes intel assembly\n; by emulating it in your browser.\n; This process is completely offline! \n \n mov rax, 1337\n push rax\n mov rbx 12\n syscall\n\n\n\n\n\n\n\n\n\n"
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
