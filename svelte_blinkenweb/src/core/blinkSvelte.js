import { writable, derived } from "svelte/store";
import {Blink, blink_modes} from './blink'
import { snippets } from "../core/snippets";

function portion(parentStore, name) {
  return derived(parentStore, value => value[name]);
}

function createBlinkStore(){

  let default_blink_mode = blink_modes.FASM
  let default_asm = snippets.syscall[default_blink_mode];
  //Read the uri params to set the initial state
  //TODO: this is absolutely temporary
  const params = new URLSearchParams(window.location.search);
  if(params.get("compiler") == "fasm"){
    default_blink_mode = blink_modes.FASM
  }
  if(params.get("compiler") == "gnu"){
    default_blink_mode = blink_modes.GNU
  }
  if(params.get("demo") == "hello_world"){
    default_asm = snippets.syscall[default_blink_mode];
  }
  if(params.get("demo") == "functions"){
    default_asm = snippets.functions[default_blink_mode];
  }


  const store  = writable({
    term_buffer: "",
    state: "",
    signal: "",
    asm: default_asm,
    manual_render: 0,
    mode: default_blink_mode,
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
    default_blink_mode,
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
    updateAsm(asm){
      console.log("update")
      update((store) => ({...store, asm}))
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

