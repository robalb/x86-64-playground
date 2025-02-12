<script>
import {blinkStore, state, editorContent_write, editorContent_read} from '../core/store'
import {onMount} from 'svelte'
import { createEditor } from "prism-code-editor"

// Prism grammars
import "prism-code-editor/prism/languages/nasm"

// Editor styles
import "prism-code-editor/layout.css"
import "prism-code-editor/scrollbar.css"
import "prism-code-editor/themes/github-dark.css"

// Non critical extensions (could be lazy loaded)
import { indentGuides } from "prism-code-editor/guides"
import { matchBrackets } from "prism-code-editor/match-brackets"
import { highlightSelectionMatches } from "prism-code-editor/search"
import { defaultCommands } from "prism-code-editor/commands"
import { setIgnoreTab } from "prism-code-editor/commands"


let editor_elem;
let editor;

let rendered_errors = [];

let blink = blinkStore.getInstance()

// render conditionals
let invalidElf = false;
$: $state && (
  invalidElf = blink.state == blink.states.PROGRAM_STOPPED &&
    blink.stopReason.loadFail)


function renderEditor(){
  console.log("editor: rendering everything")
  if(!editor_elem)
    return;

  editor = createEditor(
    editor_elem,
    {
      language: "nasm",
      value: $blinkStore.editorContent_read,
      onUpdate: content=>{
        removeErrors()
        blinkStore.notifyEditorContent(content)
      },
    },
    indentGuides(),
    matchBrackets(),
    highlightSelectionMatches(),
    defaultCommands(),
  )
  //annoying but required since this editor is trapping focus, causing
  //a11y issues
  setIgnoreTab(true)
}

function removeErrors(){
  for(let err of rendered_errors){
    console.log("editor: remove errors")
    err.remove()
  }
  rendered_errors = [];
}

function renderErrors(){
  if(!editor || !blink){
    return
  }
  if(blink.state != blink.states.READY){
    removeErrors()
    return;
  }
  if(rendered_errors.length > 0){
    //already rendered the errors
    return
  }
  console.log("editor: render errors")

  // lines[i] with i>0 is an overlayed html line we can edit
  const lines = editor.wrapper.children

  //render an error
  for(let err of blink.assembler_errors){
    const element = document.createElement('div');
    rendered_errors.push(element)
    element.className = "editor__lineerror"
    let lineLength = 2 + lines[err.line].textContent.length
    element.innerText = (" ".repeat(lineLength)) + err.error
    if(lines[err.line] && element.parentNode != lines[err.line]){
      lines[err.line].append(element)
    }
  }
}

function updateEditor(){
  if(!editor){
    return;
  }
  editor.setOptions({
    value: $editorContent_write
  })
  renderErrors()
}

$: $editorContent_write && updateEditor()

$: $state && renderErrors();

onMount(() => {
  renderEditor();
})
</script>

<div class="container">
  {#if $blinkStore.uploadedElf}
    <div class="files">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185 211.2"> 
        <path d="M24.8 190.2c-2.6-1.5-2.4 5.5-2.4-73V47h13.2c12.7 0 13.2 0 14.3-.6 1.9-1.2 2-1.5 2-15.8v-13h105.6l1.3.7c.7.4 1.5 1.2 1.9 2 .6 1 .6 3.2.6 84 0 81.8 0 83-.6 84.2-.5.8-1.1 1.4-2 1.9l-1.5.6H26.1zm75.2-35.7 2-5c.8-2.4 1.6-4.5 1.8-4.7.2-.2 1.8-1 3.6-1.7l3.1-1.4 1.6.7 4.5 2.1c1.6.8 3.3 1.4 3.8 1.4.9 0 1.7-.7 5.6-4.6 5.5-5.5 5.3-4.7 2.3-11l-2-4.2 1.4-3.5 1.4-3.6 2.6-.8 5-1.8c2.3-.9 2.5-1 2.8-2.1.3-.7.3-3.4.3-7-.1-5-.2-6-.7-6.4a30 30 0 0 0-5.2-2.2l-4.7-1.6-1.4-3.3-1.4-3.7c0-.3 1-2.4 2-4.7 1.2-2.4 2.2-4.6 2.2-5 0-.7-1.1-2-4.8-5.6-3-3-5-4.7-5.4-4.7-.3 0-2.6 1-5 2-2.4 1.2-4.5 2.1-4.8 2.1-.3 0-6.6-2.4-6.9-2.7l-1.7-4.7c-.9-2.5-1.8-4.8-2.1-5.1-.4-.5-1.2-.6-7.3-.6-6 0-6.8 0-7.2.6-.3.3-1.2 2.6-2.1 5.1l-1.8 4.7c-.3.3-6.5 2.7-6.8 2.7-.3 0-2.4-.9-4.8-2-2.4-1.2-4.7-2.1-5-2.1-1 0-10.2 9.2-10.2 10.2 0 .4 1 2.7 2.1 5a45 45 0 0 1 2 4.8c0 .2-.5 1.8-1.3 3.7L56.1 97l-4.7 1.6c-2.6 1-5 1.9-5.2 2.2-.5.5-.5.3-.5 9.7v4.6l1 .4c.4.3 2.8 1.2 5.1 2l4.4 1.5 1.4 3.5L59 126l-2 4.2c-3 6.3-3.2 5.5 2.3 11 3.9 4 4.7 4.6 5.5 4.6.6 0 3-.9 5.4-2l4.4-2.2L78 143c1.8.8 3.4 1.5 3.6 1.8.2.2 1 2.2 1.8 4.5 2 5.5 1.8 5.3 2.6 5.6.4.2 3.6.2 7.2.2 5.8 0 6.5-.1 6.9-.6zm-14.4-18A29.6 29.6 0 0 1 66 120.7a31.2 31.2 0 0 1-1-23.1 29.5 29.5 0 0 1 56 2.9c.5 2.3.7 3.5.7 7.7 0 4.1-.2 5.3-.8 7.4a29.4 29.4 0 0 1-35.4 20.9zM35.8 31.2a497 497 0 0 1 7.6-7.5l.1 7.5v7.5H28.3z" />
      </svg>
      <p><b>File:</b> {$blinkStore.uploadedElf}</p>

  {#if invalidElf}
      <p class="stopinfo">This file is not a valid ELF. </p>
      <p>This emulator requires Statically linked x86-64 Elf LSB Executables. It works best
      with musl or cosmopolitan libc</p>
  {/if}

      <button on:click={()=>blinkStore.setUploadedElfName("")}>back to editor</button>
    </div>
  {/if}
  <div class="editor" bind:this={editor_elem}
    class:hidden={$blinkStore.uploadedElf}> </div>
</div>

<style>
  .editor{
    padding-bottom: 1.5rem;
  }
  .editor.hidden{
    display: none;
  }
  .container{
    overflow: auto;
    max-height: 100%;
    height: 100%;
    background-color: #0d1117;
    display: grid;
  }
  .files{
    display:flex;
    height: 100%;
    align-items: center;
    flex-direction:column;
    font-size: 1rem;
    padding: 2rem;
  }

  .files svg{
    fill: var(--theme-primary);
    width: 70px;
  }
  .files button{
    border: 0;
  }
  .files p{
    margin: 0;
    text-align:center;
  }

  .files button{
    color: var(--color-gray-100);
    text-decoration: none;
    padding: .5rem;
    font-size: 1rem;
    border-radius: 8px;
    background-color:transparent;
    margin-top: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }
  .files button:hover{
    color: var(--color-gray-0);
    background-color: var(--color-gray-400);
  }

 p.stopinfo{
    /*TODO: remove hardcoded colors, find proper design */
    background-color: rgb(224, 73, 35);
    background-color: rgb(96, 48, 36);
    color: white;
    border: 1px solid rgb(245, 127, 97);

    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 1rem;
    margin-bottom: .5rem;
  }
</style>
