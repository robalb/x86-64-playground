import { writable } from "svelte/store";
import Blink from './blink'

function createBlinkStore(){

  const { subscribe, update } = writable({
    term_buffer: "",
    state: "",
    signal: "",
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

  const blink = new Blink(
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
    }
  }

}

/**
 * Singleton instance of the blink emulator,
 * wrapped in a svelte store
 */
export const blinkStore = createBlinkStore();
