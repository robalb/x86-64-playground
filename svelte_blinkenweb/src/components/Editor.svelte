<script>
import { minimalEditor, basicEditor, fullEditor, readonlyEditor } from "prism-code-editor/setups"
// Importing Prism grammars
import "prism-code-editor/prism/languages/nasm"
import {blinkStore} from '../core/blinkSvelte'
import {onMount} from 'svelte'
import { snippets } from "../core/snippets";

let editor_elem;

onMount(() => {

  const editors = basicEditor(
    editor_elem,
    {
      language: "nasm",
      theme: "github-dark",
      value: snippets["syscall"]["fasm"],
      onUpdate: content=>{
        blinkStore.updateAsm(content)
      },
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
    display: grid;
  }
</style>
