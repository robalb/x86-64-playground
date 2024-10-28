import { writable, derived } from "svelte/store";
import {Blink, blink_modes} from './blink'
import { snippets } from "../core/snippets";
import {assemblers, Assemblers_key} from './assemblers'

//TODO: a complete refactor of the mode key.
//mode should be set via a specific setter, and should be an Assemblers_key.
//it should be used to render the assembler dropdown menu, together with the assemblers object.
//changes to mode should not trigger changes to the Editor content.
//
//We then need a way to reactively set the Editor content.
//
//We then need a function to set the webapp state (for now, assembler mode and editor content, but in the future
//there could be more options).
//When a demo is selected this function is called.
//we also need several serializers and deserializers compatible with this webappState.
//when you click "share", the current webappState is serialized into an url.
//when the page loads, or the url changes, some url param is deserialized and passed to
//setWebAppstate.
//
//we should refactor snippets.js into example_scripts.ts.
//every example should be the combo codestring,Assemblers_key.
//we can then create a custom webappstate serializer that takes this combo and 
//generates a webappstate, that is passed to setWebAppState

function portion(parentStore, name) {
  return derived(parentStore, value => value[name]);
}

function createBlinkStore(){

  let default_asm = ""
  let default_mode: Assemblers_key = 'FASM_trunk';

  const store  = writable({
    term_buffer: "",
    state: "",
    signal: "",
    asm: default_asm,
    manual_render: 0,
    mode: default_mode,
    uploadedElf: ""
  });
  const { subscribe, update } = store

  let stdinHander=()=>{
    return null;
  }
  let stdoutHandler=(charcode)=>{
    update((store) =>{
      let char = String.fromCharCode(charcode);
      store.term_buffer += char;
      return store;
    })
  }
  let stderrHander=(charcode)=>{
    update((store) =>{
      let char = String.fromCharCode(charcode);
      store.term_buffer += char;
      return store;
    })
  }

  let signalHander=(signal, code)=>{
    update((store) => ({ ...store, manual_render: store.manual_render+1}))
  }
  let stateChangeHander=(state, oldstate)=>{
    update((store) => ({ ...store, state:state, manual_render: store.manual_render+1}))
  }


  const blink = new Blink(
    assemblers[default_mode],
    stdinHander,
    stdoutHandler,
    stderrHander,
    signalHander,
    stateChangeHander
  )

  update((store) => ({ ...store, state:blink.state}))

  return {
    subscribe,
    getInstance(){
      return blink;
    },
    updateAsm(asm:string){
      console.log("update")
      update((store) => ({...store, asm}))
    },
    setUploadedElfName(uploadedElf: string|null){
      update((store) => ({...store, uploadedElf}))
    },
    setMode(mode: Assemblers_key){
      update((store) => ({...store, mode}))
      blink.setMode(assemblers[mode])
    }
  }

}

/**
 * Singleton instance of the blink emulator,
 * wrapped in a svelte store
 */
export const blinkStore = createBlinkStore();


/**
 * individual store access to the elements in the store object.
  * Use with caution. svelte is already good at updating the dom only
  * when real changes happen.
  * Subscribe to manual_render if you want to manually render
  * the blink state only when it's required.
 */
export const manual_render = portion(blinkStore, "manual_render");
export const term_buffer = portion(blinkStore, "term_buffer");
export const state = portion(blinkStore, "state");
export const signal = portion(blinkStore, "signal");
export const asm = portion(blinkStore, "asm");
export const mode = portion(blinkStore, "mode");
export const uploadedElf = portion(blinkStore, "uploadedElf");

