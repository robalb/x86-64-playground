import { writable } from "svelte/store";
import Blink from './blink'

function createBlinkStore(){

  const { subscribe, update } = writable({
    term_buffer: "",
    state: "",
    signal: "",
    asm: "",
    render: 0,
  });

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

  }
  let stateChangeHander=(state, oldstate)=>{
    update((store) => ({ ...store, state:state}))
  }
  let renderHandler=(id)=>{
    update((store) => ({ ...store, render:id}))
  }

  const mode = "FASM"
  const blink = new Blink(
    mode,
    stdinHander,
    stdoutHandler,
    stderrHander,
    signalHander,
    stateChangeHander,
    renderHandler
  )

  update((store) => ({ ...store, state:blink.state}))

  return {
    subscribe,
    getInstance(){
      return blink;
    },
    updateAsm(asm){
      update((store) => ({...store, asm}))
    }
  }

}

/**
 * Singleton instance of the blink emulator,
 * wrapped in a svelte store
 */
export const blinkStore = createBlinkStore();
