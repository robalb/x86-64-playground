import blinkenlib from '../assets/blinkenlib.js'

let protocolMap = {
  rsp: 1,
  rbp: 2,
}

/**
* A javascript wrapper for the blink x86-64 emulator.
* The goal is to provide an interface to blink that is as
* abstracted away as possible from emscripten, keeping open the
* possibility to completely remove the emscripten dependency
* 
*/
export default class Blink{
  #stdinHandler: ()=>number;
  #stdoutHandler: (charCode: number)=>void;
  #stderrHandler: (charCode: number)=>void;
  #signalHandler: (signal: number)=>void;
  #readyHandler: ()=>void;

  Module: any;
  ready: boolean;
  

  /**
  * Initialize the emscripten blink module.
  */
  constructor(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number)=>void,
    readyHandler?: ()=>void
  ){
    this.setCallbacks(
      stdinHandler,
      stdoutHandler,
      stderrHandler,
      signalHandler,
      readyHandler,
    );
    this.#initEmscripten();
  }

  async #initEmscripten(){
    this.Module = await blinkenlib({
      preRun: (M: any) =>{
        M.FS.init(
          this.#default_stdinHandler,
          this.#default_stdoutHandler,
          this.#default_stderrHandler,
        );
      },
      postRun: ()=>{
        this.ready = true;
        this.#readyHandler();
      }
    });
  }

  setCallbacks(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number)=>void,
    readyHandler?: ()=>void,
  ){
    if(stdinHandler)
      this.#stdinHandler = stdinHandler
    if(stdoutHandler)
      this.#stdoutHandler = stdoutHandler
    if(stderrHandler)
      this.#stderrHandler = stderrHandler
    if(signalHandler)
      this.#signalHandler = signalHandler
    if(readyHandler)
      this.#readyHandler = readyHandler

    if(!this.#stdinHandler)
      this.#stdinHandler = this.#default_stdinHandler
    if(!this.#stdoutHandler)
      this.#stdoutHandler = this.#default_stdoutHandler
    if(!this.#stderrHandler)
      this.#stderrHandler = this.#default_stderrHandler
    if(!this.#signalHandler)
      this.#signalHandler = this.#default_signalHandler
    if(!this.#readyHandler)
      this.#readyHandler = this.#default_readyHandler
  }

  /**
  * Will close previous processes,
  * reset the emaulator state,
  * and load the given elf file
  */
  loadElf(elfArrayBytes, filename, argc, argv): boolean{
    if(!this.ready)
      return false

      
  }

  /**
  * Will close previous processes,
  * reset the emaulator state,
  * and load the given asm bytes in a minimalistic elf
  */
  loadASM(asmBytes){

  }

  start(){

  }

  starti(){

  }

  stepi(){

  }

  continue(){

  }

  setBreakpoint(){

  }

  #default_signalHandler(){

  }
  #default_stdinHandler(): number{
    return 0;
  }
  #default_stdoutHandler(charcode: number){
  }
  #default_stderrHandler(Charcode: number){

  }
  #default_readyHandler(){

  }


}
