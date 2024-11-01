import blinkenlib from '../assets/blinkenlib.js'
import {assemblers, AssemblerMode, fasm_diagnostics} from '../core/assemblers'

/**
* Machine Cross-language struct.
* offsers access to some of the blink Machine struct elements,
* such as registers and virtual memory.
*
* Javascript DataView  <-----> Struct of uint32_t pointers to
*                              important elements of Machine m
*
*
*/
class M_CLStruct{
  readonly version = 1
  readonly sizeof_key = 4;
  readonly keys = {
    version: {index: 0, pointer: false}, /*number*/
    codemem: {index: 1, pointer: true},
    stackmem: {index: 2, pointer: true},
    readaddr: {index: 3, pointer: true},
    readsize: {index: 4, pointer: false}, /*number*/
    writeaddr: {index: 5, pointer: true},
    writesize: {index: 6, pointer: false}, /*number*/

    flags: {index: 7, pointer: false},
    cs__base: {index: 8, pointer: true},

    rip: {index: 9, pointer: true},
    rsp: {index: 10, pointer: true},
    rbp: {index: 11, pointer: true},
    rsi: {index: 12, pointer: true},
    rdi: {index: 13, pointer: true},

    r8: {index: 14, pointer: true},
    r9: {index: 15, pointer: true},
    r10: {index: 16, pointer: true},
    r11: {index: 17, pointer: true},
    r12: {index: 18, pointer: true},
    r13: {index: 19, pointer: true},
    r14: {index: 20, pointer: true},
    r15: {index: 21, pointer: true},

    rax: {index: 22, pointer: true},
    rbx: {index: 23, pointer: true},
    rcx: {index: 24, pointer: true},
    rdx: {index: 25, pointer: true},

    //disassembly buffer
    dis__max_lines: {index: 26, pointer: false},
    dis__max_line_len: {index: 27, pointer: false},
    dis__current_line: {index: 28, pointer: false},
    dis__buffer: {index: 29, pointer: true},
  }
  memory: WebAssembly.Memory
  memView: DataView;
  structView: DataView;
  struct_pointer: number;

  constructor(memory: WebAssembly.Memory, struct_pointer: number){
    this.memory = memory;
    this.struct_pointer = struct_pointer;
    this.growMemory();
    //check shared struct version
    let js_version =this.version;
    let wasm_version = this.getPtr("version");
    if (js_version != wasm_version){
      throw new Error("shared struct version mismatch")
    }

  }

  growMemory(){
    let struct_size = Object.keys(this.keys).length *this.sizeof_key;
    this.memView = new DataView(this.memory.buffer);
    this.structView = new DataView(
      this.memory.buffer,
      this.struct_pointer,
      struct_size
    );
  }

  stringReadBytes(key: keyof typeof this.keys, num: number): string{
    let ptr = this.getPtr(key);
    let retStr = ""
    for(let i=0; i<num; i++){
      retStr += this.memView.getUint8(ptr + i).toString(16).padStart(2, "0")
      retStr += " "
    }
    return retStr;
  }

  stringReadU64(key: keyof typeof this.keys): string{
    let ptr = this.getPtr(key);
    let hexStr = ""
    for(let i=7; i>=0; i--){
      let byte = this.memView.getUint8(ptr + i);
      if(hexStr || byte || i==0) hexStr += byte.toString(16).padStart(2, "0")
    }
    return "0x"+hexStr;
  }

  readU64(key: keyof typeof this.keys): BigInt{
    let ptr = this.getPtr(key);
    let little_endian = true;
    return this.memView.getBigUint64(ptr, little_endian);
  }

  getPtr(key: keyof typeof this.keys): number{
    if(!this.structView.buffer.byteLength){
      console.log("blink: memory grew")
      this.growMemory()
    }
    let index = this.keys[key].index * this.sizeof_key;
    let little_endian = true;
    return this.structView.getUint32(index, little_endian);
  }

  writeStringToHeap(offset: number, str: string, maxLength: number){
    if(!this.structView.buffer.byteLength){
      console.log("blink: memory grew")
      this.growMemory()
    }
    if(offset == 0){
      console.log("blink: write to null ptr")
      return
    }
    let writeLen = Math.min(str.length, maxLength-1)
    for (var i = 0; i < writeLen; ++i) {
      let u = str.charCodeAt(i);
      if(u >= 0x20 && u <= 0x7E){
        this.memView.setUint8(offset+i, u)
      }else{
        //replace non-ascii characters with a space
        this.memView.setUint8(offset+i, 0x20)
      }
    }
    // Null-terminate the pointer to the buffer.
    this.memView.setUint8(offset+writeLen, 0)
  }

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
export class Blink{
  #stdinHandler: ()=>number;
  #stdoutHandler: (charCode: number)=>void;
  #stderrHandler: (charCode: number)=>void;
  #signalHandler: (signal: number, code: number)=>void;
  #stateChangeHandler: (state: string, oldState: string)=>void;

  m: M_CLStruct;

  states = {
    'NOT_READY': 'NOT_READY',
    'READY': 'READY',
    'ASSEMBLING': 'ASSEMBLING',
    'LINKING': 'LINKING',
    'PROGRAM_LOADED': 'PROGRAM_LOADED',
    'PROGRAM_RUNNING': 'PROGRAM_RUNNING',
    'PROGRAM_STOPPED': 'PROGRAM_STOPPED'
  } as const;

  mode: AssemblerMode;

  Module: any;/*Emscripten Module object*/
  memory: WebAssembly.Memory;
  state: typeof this.states[keyof typeof this.states] =
    this.states.NOT_READY;
  stopReason: null|{loadFail: boolean, exitCode: number, details: string};

  //program emulation arguments
  max_argc_len = 200;
  max_argv_len = 200;
  max_progname_len = 200;
  argc_ptr = 0;
  argv_ptr = 0;
  progname_ptr = 0;

  default_argc = "/program"
  default_argv = ""

  //assembler stdout and stderr
  assembler_logs = ""
  //assembler diagnostic errors
  assembler_errors = []

  /**
  * Initialize the emscripten blink module.
  */
  constructor(
    mode: AssemblerMode,
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number, code: number)=>void,
    stateChangeHandler?: (state: string, oldState: string)=>void,
  ){
    this.setCallbacks(
      stdinHandler,
      stdoutHandler,
      stderrHandler,
      signalHandler,
      stateChangeHandler,
    );
    this.#initEmscripten(mode);
  }

  async #initEmscripten(mode?: AssemblerMode){
    this.mode = mode;
    this.Module = await blinkenlib({
      noInitialRun: true,
      preRun: (M: any) =>{
        M.FS.init(
          this.#stdinHandler,
          (charcode:number)=>{
            this.#assembler_logcollector(charcode)
            this.#stdoutHandler(charcode)
          },
          (charcode:number)=>{
            this.#assembler_logcollector(charcode)
            this.#stderrHandler(charcode)
          }
        );
        M.FS.createPreloadedFile("/", "assembler", mode.binaries.assembler.fileurl, true, true);
        if(mode.binaries.linker){
          M.FS.createPreloadedFile("/", "linker", mode.binaries.linker.fileurl, true, true);
        }
      }
    });

    //dynamically register the javascript callbacks for the wasm code
    let signal_callback = this.#extern_c__signal_callback.bind(this)
    let signal_callback_llvm_signature = "vii"
    let fp_1 = this.Module.addFunction(signal_callback, signal_callback_llvm_signature);

    let exit_callback = this.#extern_c__exit_callback.bind(this)
    let exit_callback_llvm_signature = "vi"
    let fp_2 = this.Module.addFunction(exit_callback, exit_callback_llvm_signature);

    this.Module.callMain([
      fp_1.toString(),    /* signal_callback */
      fp_2.toString(),    /* exit_callback */
    ])

    //init memory
    this.memory = this.Module.wasmExports.memory;
    //initialize the cross language struct
    let cls_pointer = this.Module._blinkenlib_get_clstruct();
    this.m = new M_CLStruct(this.memory, cls_pointer);
    //initialize the program emulation arguments
    this.argc_ptr = this.Module._blinkenlib_get_argc_string();
    this.argv_ptr = this.Module._blinkenlib_get_argv_string();
    this.progname_ptr = this.Module._blinkenlib_get_progname_string();

  
    this.#setState(this.states.READY)
  }

  /**
  * This callback receives the stdout and stderr of the blink emulator.
  * When An assembler is being emulated, the stream received is logged
  * in a buffer, in order to catch eventual diagnostic errors
  */
  #assembler_logcollector(charcode:number){
    if(this.state == this.states.ASSEMBLING){
      this.assembler_logs += String.fromCharCode(charcode)
    }
  }

  #setState(state: typeof this.states[keyof typeof this.states]){
    if(this.state == state){
      return;
    }
    console.log("blink: "+state)
    this.#stateChangeHandler(state, this.state);
    this.state = state;
  }

  /**
  * This callback is called from the wasm code
  * when the guest process is stopped by a terminating signal
  *
  * SIGTRAP is the only signal that does not indicate
  * a program stop.
  */
  #extern_c__signal_callback(sig: number, code: number){
    if(sig != signals.SIGTRAP){
      let exitCode = 128 + sig
      let details = `Program terminated with Exit(${exitCode}) Due to signal ${sig}`
      if(signals_info.hasOwnProperty(sig)){
        let sigString = signals_info[sig].name
        let sigDescr = signals_info[sig].description
        details = `Program terminated with Exit(${exitCode}) due to signal ${sigString}: ${sigDescr}`;
      }
      this.stopReason = {loadFail: false, exitCode: exitCode, details: details}
      this.#setState(this.states.PROGRAM_STOPPED);
    }
    this.#signalHandler(sig, code);
  }

  /**
  * This callback is called from the wasm code
  * when the guest process calls the exit syscall
  */
  #extern_c__exit_callback(code: number){
    //Handle separately the return codes tha are generated from the
    //assembler or linker running in the emulator, and not
    //from a regular program
    if(this.state == this.states.ASSEMBLING){
      this.loadASM_assembler_exit_callback(code);
      return
    }
    if(this.state == this.states.LINKING){
      this.loadASM_linker_exit_callback(code);
      return
    }
    
    this.stopReason = {
      loadFail: false,
      exitCode: code,
      details: `program terminated with Exit(${code})`
    }
    this.#setState(this.states.PROGRAM_STOPPED);
    console.log("exit callback called")
  }

  #setEmulationArgs(progname, argc,argv){
    this.m.writeStringToHeap(this.progname_ptr, progname, this.max_progname_len)
    this.m.writeStringToHeap(this.argc_ptr, argc, this.max_argc_len)
    this.m.writeStringToHeap(this.argv_ptr, argv, this.max_argv_len)
  }

  setCallbacks(
    stdinHandler?: ()=>number,
    stdoutHandler?: (charCode: number)=>void,
    stderrHandler?: (charCode: number)=>void,
    signalHandler?: (signal: number, code: number)=>void,
    stateChangeHandler?: (state: string, oldState: string)=>void,
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

  async #fetchBinaryFile(url: string): Promise<ArrayBuffer>{
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } catch (error) {
      console.error('Failed to fetch binary file:', error);
    }
  }

  /** 
  * Update the assembler mode of this blink instance.
  * The state will be set to NOT_READY, and
  * a new set of compilers will be downloaded.
  */
  async setMode(mode: AssemblerMode){
    this.mode = mode;
    this.#setState(this.states.NOT_READY);

    //download assembler
    let downloadedElf = await this.#fetchBinaryFile(mode.binaries.assembler.fileurl)
    let data = new Uint8Array(downloadedElf);
    let FS = this.Module.FS
    let stream = FS.open('/assembler', 'w+');
    FS.write(stream, data, 0, data.length, 0);
    FS.close(stream);
    FS.chmod('/assembler', 0o777);

    //download linker, if required by this mode
    if(mode.binaries.linker){
      let downloadedElf = await this.#fetchBinaryFile(this.mode.binaries.linker.fileurl)
      let data = new Uint8Array(downloadedElf);
      let FS = this.Module.FS
      let stream = FS.open('/linker', 'w+');
      FS.write(stream, data, 0, data.length, 0);
      FS.close(stream);
      FS.chmod('/linker', 0o777);
    }
    this.#setState(this.states.READY);
  }

  /**
  * save the program to the Virtual File System
  * set the emulation arguments
  * optionally start the program
  */
  loadElf(elfArrayBytes:ArrayBuffer): boolean{
    if(this.state == this.states.NOT_READY){
      return false;
    }
    let data = new Uint8Array(elfArrayBytes);
    let FS = this.Module.FS
    let stream = FS.open('/program', 'w+');
    FS.write(stream, data, 0, data.length, 0);
    FS.close(stream);
    FS.chmod('/program', 0o777);

    this.starti()
  }

  /**
  * Launch a multi stage process where:
  * - the assembly asmString is written to a file in the virtual FS.
  * - an assembler is emulated in blink
  * - a linker is emulated in blink
  * The state of this operation is kept via this.state.
  * If successful, it will be possible to launch the compiled program
  * via this.starti(), or this.run()
  */
  loadASM(asmString: string): boolean{
    if(this.state == this.states.NOT_READY){
      return false
    }
    this.assembler_logs = ""
    this.assembler_errors = []
    this.#setState(this.states.ASSEMBLING);
    let FS = this.Module.FS
    FS.writeFile("/assembly.s", asmString);
    //this hack ensures that the function is called after a browser render pass
    requestAnimationFrame(()=>{
      this.#setEmulationArgs("/assembler", this.mode.binaries.assembler.commands, "")
      this.Module._blinkenlib_run_fast()
    })
  }

  loadASM_assembler_exit_callback(code: number){
    if(code != 0){
      console.log("blink: assembler failed");
      if(this.mode.diagnosticsParser){
        console.log("blink: assembler diagnostics parsed")
        this.assembler_errors = this.mode.diagnosticsParser(this.assembler_logs);
        console.log(this.assembler_logs)
        console.log(this.assembler_errors)
      }
      this.#setState(this.states.READY);
      return
    }
    if(!this.mode.binaries.linker){
      //the current assembler directly generates an ELF without a linker
      let FS = this.Module.FS
      FS.chmod('/program', 0o777);
      this.#setState(this.states.PROGRAM_LOADED);
      this.starti()
    }else{
      //we need a separate linking step
      this.#setState(this.states.LINKING);
      //this hack ensures that the function is called after a browser render pass
      requestAnimationFrame(()=>{
        this.#setEmulationArgs("/linker", this.mode.binaries.linker.commands, "")
        this.Module._blinkenlib_run_fast()
      })

    }
  }

  loadASM_linker_exit_callback(code: number){
    if(code != 0){
      console.log("linker failed");
      this.#setState(this.states.READY);
      return
    }
    let FS = this.Module.FS
    FS.chmod('/program', 0o777);
    this.#setState(this.states.PROGRAM_LOADED);
    this.starti()
  }

  /**
  * start the program normally and execute it until
  * a breakpoint or end.
  */
  run(){
    try{
      this.#setState(this.states.PROGRAM_RUNNING)
      this.#setEmulationArgs("/program", this.default_argc, this.default_argv)
      this.Module._blinkenlib_run();
    }catch(e){
      this.stopReason = {loadFail: true, exitCode: 0, details: "invalid ELF"}
      this.#setState(this.states.PROGRAM_STOPPED);
    }
  }

  /**
  * start the program and stop at the beginning of the
  * main function.
  */
  start(){
    try{
      this.#setEmulationArgs("/program", this.default_argc, this.default_argv)
      this.Module._blinkenlib_start();
      this.#setState(this.states.PROGRAM_RUNNING)
    }catch(e){
      this.stopReason = {loadFail: true, exitCode: 0, details: "invalid ELF"}
      this.#setState(this.states.PROGRAM_STOPPED);
    }
  }
  /**
  * start the program and stop at the very first 
  * instruction (before main)
  */
  starti(){
    try{
      this.#setEmulationArgs("/program", this.default_argc, this.default_argv)
      this.Module._blinkenlib_starti();
      this.#setState(this.states.PROGRAM_RUNNING)
    }catch(e){
      this.stopReason = {loadFail: true, exitCode: 0, details: "invalid ELF"}
      this.#setState(this.states.PROGRAM_STOPPED);
    }
  }

  stepi(){
    this.Module._blinkenlib_stepi()
  }

  continue(){
    this.Module._blinkenlib_continue()
  }

  setready(){
    this.#setState(this.states.READY);
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
