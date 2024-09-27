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
    "SIGHUP": 1,
    "SIGINT": 2,
    "SIGQUIT": 3,
    "SIGILL": 4,
    "SIGTRAP": 5,
    "SIGABRT": 6,
    "SIGBUS": 7,
    "SIGFPE": 8,
    "SIGKILL": 9,
    "SIGUSR1": 10,
    "SIGSEGV": 11,
    "SIGUSR2": 12,
    "SIGPIPE": 13,
    "SIGALRM": 14,
    "SIGTERM": 15,
    "SIGSTKFLT": 16,
    "SIGCHLD": 17,
    "SIGCONT": 18,
    "SIGSTOP": 19,
    "SIGTSTP": 20,
    "SIGTTIN": 21,
    "SIGTTOU": 22,
    "SIGURG": 23,
    "SIGXCPU": 24,
    "SIGXFSZ": 25,
    "SIGVTALRM": 26,
    "SIGPROF": 27,
    "SIGWINCH": 28,
    "SIGIO": 29,
    "SIGPWR": 30,
    "SIGSYS": 31
}

let signals_info = {
    1: {"name": "SIGHUP", "description": "Hang up controlling terminal or process."},
    2: {"name": "SIGINT", "description": "Interrupt from keyboard, Control-C."},
    3: {"name": "SIGQUIT", "description": "Quit from keyboard, Control-\\."},
    4: {"name": "SIGILL", "description": "Illegal instruction."},
    5: {"name": "SIGTRAP", "description": "Breakpoint for debugging."},
    6: {"name": "SIGABRT", "description": "Abnormal termination."},
    7: {"name": "SIGBUS", "description": "Bus error."},
    8: {"name": "SIGFPE", "description": "Floating-point exception."},
    9: {"name": "SIGKILL", "description": "Forced-process termination."},
    10: {"name": "SIGUSR1", "description": "Available to processes."},
    11: {"name": "SIGSEGV", "description": "Invalid memory reference."},
    12: {"name": "SIGUSR2", "description": "Available to processes."},
    13: {"name": "SIGPIPE", "description": "Write to pipe with no readers."},
    14: {"name": "SIGALRM", "description": "Real-timer clock."},
    15: {"name": "SIGTERM", "description": "Process termination."},
    16: {"name": "SIGSTKFLT", "description": "Coprocessor stack error."},
    17: {"name": "SIGCHLD", "description": "Child process stopped or terminated or got a signal if traced."},
    18: {"name": "SIGCONT", "description": "Resume execution, if stopped."},
    19: {"name": "SIGSTOP", "description": "Stop process execution, Ctrl-Z."},
    20: {"name": "SIGTSTP", "description": "Stop process issued from tty."},
    21: {"name": "SIGTTIN", "description": "Background process requires input."},
    22: {"name": "SIGTTOU", "description": "Background process requires output."},
    23: {"name": "SIGURG", "description": "Urgent condition on socket."},
    24: {"name": "SIGXCPU", "description": "CPU time limit exceeded."},
    25: {"name": "SIGXFSZ", "description": "File size limit exceeded."},
    26: {"name": "SIGVTALRM", "description": "Virtual timer clock."},
    27: {"name": "SIGPROF", "description": "Profile timer clock."},
    28: {"name": "SIGWINCH", "description": "Window resizing."},
    29: {"name": "SIGIO", "description": "I/O now possible."},
    30: {"name": "SIGPWR", "description": "Power supply failure."},
    31: {"name": "SIGSYS", "description": "Bad system call."}
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
  stopReason: null|{loadFail: boolean, exitCode: number, details: string};


  /**
  * Initialize the emscripten blink module.
  */
  constructor(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number, code: number)=>void,
    stateChangeHandler?: (state: string, oldState: string)=>void
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

  /**
  * This callback is called from the wasm code
  * whenever a terminating signal is raised
  *
  * SIGTRAP is the only signal that does not indicate
  * a program stop.
  */
  #extern_c__signal_callback(sig: number, code: number){
    if(sig != signals.SIGTRAP){
      let exitCode = 128 + sig
      let details = `Program stopped due to terminating signal ${sig}`
      if(signals_info.hasOwnProperty(sig)){
        let sigString = signals_info[sig].name
        let sigDescr = signals_info[sig].description
        details = `Program stopped due to signal ${sigString}: ${sigDescr}`;
      }
      this.stopReason = {loadFail: false, exitCode: exitCode, details: details}
      this.#setState(this.states.PROGRAM_STOPPED);
    }
    this.#signalHandler(sig, code);
  }

  setCallbacks(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number, code: number)=>void,
    stateChangeHandler?: (state: string, oldState: string)=>void
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
      this.stopReason = null;
    }
    catch(e){
      this.stopReason = {loadFail: true, exitCode: 0, details: "invalid ELF"}
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
    this.#setState(this.states.PROGRAM_RUNNING)
  }

  starti(){
    let single_stepping = true;
    this.#setState(this.states.PROGRAM_RUNNING)
    try{
      this.Module._blinkenlib_start(single_stepping);
    }
    catch(e){
      this.#handle_runException(e)
    }
  }

  stepi(){
    try{
      this.Module._blinkenlib_stepi()
    }
    catch(e){
      this.#handle_runException(e)
    }
  }

  continue(){
    try{
      this.Module._blinkenlib_continue()
    }
    catch(e){
      this.#handle_runException(e)
    }
  }

  setBreakpoint(){

  }

  #handle_runException(e){
    if(e.name == "ExitStatus"){
      this.stopReason = {
        loadFail: false,
        exitCode: e.status,
        details: `program terminated with Exit(${e.status})`}
      this.#setState(this.states.PROGRAM_STOPPED);
    }
    else{
      console.log(e)
    }
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
