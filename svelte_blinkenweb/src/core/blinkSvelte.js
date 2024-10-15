import { writable, derived } from "svelte/store";
import {Blink, blink_modes} from './blink'

function portion(parentStore, name) {
  return derived(parentStore, value => value[name]);
}

function createBlinkStore(){

  const default_blink_mode = blink_modes.FASM

  const store  = writable({
    term_buffer: "",
    state: "",
    signal: "",
    asm: "",
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

  //TODO: remove renderHandler, set manual_render when state or signal are received
  //TODO: remove renderHandler from blink class
  let signalHander=(signal, code)=>{
    update((store) => ({ ...store, manual_render: store.manual_render+1}))
  }
  let stateChangeHander=(state, oldstate)=>{
    update((store) => ({ ...store, state:state, manual_render: store.manual_render+1}))
  }
  let renderHandler=(id)=>{
    // update((store) => ({ ...store, manual_render: store.manual_render+1}))
  }


  //TODO: put this in a util function
  let mode = "FASM"
  const params = new URLSearchParams(window.location.search);
  if(params.get('compiler') == "gnu"){
    mode = "GNU"
  }
  if(params.get('compiler') == "fasm"){
    mode = "FASM"
  }
    
  const blink = new Blink(
    mode,
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

