import blinkenlib from '../assets/blinkenlib.js'

/**
* *rsp (pointer to stack mem, useful for us)
* rsp 
* every single register
* flags
*/
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
  #stateChangeHandler: (state: string, oldState: string)=>void;

  states = {
    'NOT_READY': 'NOT_READY',
    'READY': 'READY',
    'PROGRAM_LOADED': 'PROGRAM_LOADED',
    'PROGRAM_RUNNING': 'PROGRAM_RUNNING',
    'PROGRAM_STOPPED': 'PROGRAM_STOPPED'
  } as const;

  Module: any;
  memory: ArrayBuffer;
  state: typeof this.states[keyof typeof this.states] =
    this.states.NOT_READY;


  /**
  * Initialize the emscripten blink module.
  */
  constructor(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number)=>void,
    stateChangeHandler?: ()=>void
  ){
    this.setCallbacks(
      stdinHandler,
      stdoutHandler,
      stderrHandler,
      signalHandler,
      stateChangeHandler,
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
      postRun: (M: any)=>{
        this.memory = M.wasmExports.memory.buffer
        this.#setState(this.states.READY)
      }
    });
  }

  #setState(state: typeof this.states[keyof typeof this.states]){
    if(this.state == state){
      return;
    }
    this.#stateChangeHandler(state, this.state);
    this.state = state;
  }

  setCallbacks(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number)=>void,
    stateChangeHandler?: ()=>void,
  ){
    if(stdinHandler)
      this.#stdinHandler = stdinHandler
    if(stdoutHandler)
      this.#stdoutHandler = stdoutHandler
    if(stderrHandler)
      this.#stderrHandler = stderrHandler
    if(signalHandler)
      this.#signalHandler = signalHandler
    if(stateChangeHandler)
      this.#stateChangeHandler = stateChangeHandler

    if(!this.#stdinHandler)
      this.#stdinHandler = this.#default_stdinHandler
    if(!this.#stdoutHandler)
      this.#stdoutHandler = this.#default_stdoutHandler
    if(!this.#stderrHandler)
      this.#stderrHandler = this.#default_stderrHandler
    if(!this.#signalHandler)
      this.#signalHandler = this.#default_signalHandler
    if(!this.#stateChangeHandler)
      this.#stateChangeHandler = this.#default_stateChangeHandler
  }

  /**
  * Will close previous processes,
  * reset the emaulator state,
  * and load the given elf file
  */
  loadElf(elfArrayBytes:ArrayBuffer, filename, argc, argv): boolean{
    if(this.state == this.states.NOT_READY){
      return false;
    }
    let data = new Uint8Array(elfArrayBytes);
    let FS = this.Module.FS
    let stream = FS.open('/program', 'w+');
    FS.write(stream, data, 0, data.length, 0);
    FS.close(stream);
    FS.chmod('/program', 0o777);
    //TODO allocate param strings
    //
    try{
      this.Module._blinkenlib_loadProgram()
      this.#setState(this.states.PROGRAM_LOADED);
    }
    catch(e){
      this.#setState(this.states.PROGRAM_STOPPED);
    }
    //TODO free param strings
    //
  }

  /**
  * Will close previous processes,
  * reset the emaulator state,
  * and load the given asm bytes in a minimalistic elf
  */
  loadASM(asmBytes): boolean{
    if(this.state == this.states.NOT_READY){
      return false
    }
    //TODO: figure this out
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
    return null; //EOF
  }
  #default_stdoutHandler(charcode: number){
  }
  #default_stderrHandler(Charcode: number){

  }
  #default_stateChangeHandler(state: string, oldState: string){

  }


}
