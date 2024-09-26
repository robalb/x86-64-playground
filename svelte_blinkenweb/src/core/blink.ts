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

let signals = {
  "SIGINT":		2,	/* Interactive attention signal.  */
  "SIGILL":	  4,	/* Illegal instruction.  */
  "SIGABRT":	6,	/* Abnormal termination.  */
  "SIGFPE":		8,	/* Erroneous arithmetic operation.  */
  "SIGSEGV":	11,	/* Invalid access to storage.  */
  "SIGTERM":	15,	/* Termination request.  */
  "SIGHUP,":	1,	/* Hangup.  */
  "SIGQUIT":	3,	/* Quit.  */
  "SIGTRAP":	5,	/* Trace/breakpoint trap.  */
  "SIGKILL":	9,	/* Killed.  */
  "SIGPIPE":	13,	/* Broken pipe.  */
  "SIGALRM":	14,	/* Alarm clock.  */
}

let signals_info = {
  /* ISO C99 signals.  */
    2: {"name": "SIGINT", "description": "Interactive attention signal."},
    4: {"name": "SIGILL", "description": "Illegal instruction."},
    6: {"name": "SIGABRT", "description": "Abnormal termination."},
    8: {"name": "SIGFPE", "description": "Erroneous arithmetic operation."},
    11: {"name": "SIGSEGV", "description": "Invalid access to storage."},
    15: {"name": "SIGTERM", "description": "Termination request."},
  /* Historical signals specified by POSIX. */
    1: {"name": "SIGHUP", "description": "Hangup."},
    3: {"name": "SIGQUIT", "description": "Quit."},
    5: {"name": "SIGTRAP", "description": "Trace/breakpoint trap."},
    9: {"name": "SIGKILL", "description": "Killed."},
    13: {"name": "SIGPIPE", "description": "Broken pipe."},
    14: {"name": "SIGALRM", "description": "Alarm clock."}
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
  #signalHandler: (signal: number, code: number)=>void;
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
    signalHandler?: (signal: number, code: number)=>void,
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
      noInitialRun: true,
      preRun: (M: any) =>{
        M.FS.init(
          this.#stdinHandler,
          this.#stdoutHandler,
          this.#stderrHandler,
        );
      }
    });

    //dynamically register the javascript callbacks for the wasm code
    let signal_callback = this.#extern_c__signal_callback.bind(this)
    let signal_callback_llvm_signature = "vii"
    let fp_1 = this.Module.addFunction(signal_callback, signal_callback_llvm_signature);

    this.Module.callMain([
      fp_1.toString(), /* signal_callback */
    ])
    this.memory = this.Module.wasmExports.memory.buffer
    this.#setState(this.states.READY)
  }

  #setState(state: typeof this.states[keyof typeof this.states]){
    if(this.state == state){
      return;
    }
    this.#stateChangeHandler(state, this.state);
    this.state = state;
  }

  #extern_c__signal_callback(sig: number, code: number){
    //all signals except sigtrap indicate that the program terminated
    if(sig != signals.SIGTRAP){
      this.#setState(this.states.PROGRAM_STOPPED);
    }
    this.#signalHandler(sig, code);
  }

  setCallbacks(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number, code: number)=>void,
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
    let single_stepping = false;
    this.Module._blinkenlib_start(single_stepping);
  }

  starti(){
    let single_stepping = true;
    this.Module._blinkenlib_start(single_stepping);
  }

  stepi(){
    this.Module._blinkenlib_stepi()
  }

  continue(){
    this.Module._blinkenlib_continue()
  }

  setBreakpoint(){

  }

  #default_signalHandler(sig: number, code: number){
    console.log(`received signal: ${sig} code: ${code}`)
  }
  #default_stdinHandler(): number{
    console.log(`stdin requested, EOF returned`)
    return null; //EOF
  }
  #default_stdoutHandler(charcode: number){
    console.log(`stdout: ${String.fromCharCode(charcode)}`)
  }
  #default_stderrHandler(charcode: number){
    console.log(`stderr: ${String.fromCharCode(charcode)}`)
  }
  #default_stateChangeHandler(state: string, oldState: string){
    console.log(`state change: ${oldState} -> ${state}`)
  }


}
