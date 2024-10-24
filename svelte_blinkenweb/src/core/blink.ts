import blinkenlib from '../assets/blinkenlib.js'
import fasm_elf_url from '../assets/fasm.elf?url'
import as_elf_url from '../assets/gnu-as.elf?url'
import ld_elf_url from '../assets/gnu-ld.elf?url'
import assembly_url from '../assets/helloworld.s?url'


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
      console.log("memory grew")
      this.growMemory()
    }
    let index = this.keys[key].index * this.sizeof_key;
    let little_endian = true;
    return this.structView.getUint32(index, little_endian);
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

export let blink_modes = {
  'GNU': 'GNU',
  'FASM': 'FASM'
} as const;


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

  mode: typeof blink_modes[keyof typeof blink_modes];

  Module: any;/*Emscripten Module object*/
  memory: WebAssembly.Memory;
  state: typeof this.states[keyof typeof this.states] =
    this.states.NOT_READY;
  stopReason: null|{loadFail: boolean, exitCode: number, details: string};

  /**
  * Initialize the emscripten blink module.
  */
  constructor(
    mode: typeof blink_modes[keyof typeof blink_modes],
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

  async #initEmscripten(mode?: typeof blink_modes[keyof typeof blink_modes]){
    this.mode = mode;
    this.Module = await blinkenlib({
      noInitialRun: true,
      preRun: (M: any) =>{
        M.FS.init(
          this.#stdinHandler,
          this.#stdoutHandler,
          this.#stderrHandler,
        );
        if(mode == blink_modes.GNU){
          M.FS.createPreloadedFile("/", "as", as_elf_url, true, true);
          M.FS.createPreloadedFile("/", "ld", ld_elf_url, true, true);
        }
        else if(mode == blink_modes.FASM){
          M.FS.createPreloadedFile("/", "fasm", fasm_elf_url, true, true);
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
      fp_1.toString(), /* signal_callback */
      fp_2.toString(), /* exit_callback */
    ])

    //init memory
    this.memory = this.Module.wasmExports.memory;
    //initialize the cross language struct
    let cls_pointer = this.Module._blinkenlib_get_clstruct();
    this.m = new M_CLStruct(this.memory, cls_pointer);

    this.#setState(this.states.READY)
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

  /**
  * close previous processes,
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
    //
    //
    try{
      this.Module._blinkenlib_loadProgram()
      this.#setState(this.states.PROGRAM_LOADED);
      this.stopReason = null;
    }
    catch(e){
      this.stopReason = {loadFail: true, exitCode: 0, details: "invalid ELF"}
      this.#setState(this.states.PROGRAM_STOPPED);
      return
    }
    //TODO free param strings
    //
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
    this.#setState(this.states.ASSEMBLING);
    let FS = this.Module.FS
    FS.writeFile("/assembly.s", asmString);
    let STEP_ASSEMBLE_AND_LINK = 0;
    let STEP_ASSEMBLE = 1;
    let STEP_LINK = 2;
    let step: number;
    if(this.mode == blink_modes.FASM){step = STEP_ASSEMBLE_AND_LINK;}
    if(this.mode == blink_modes.GNU){step = STEP_ASSEMBLE;}
    //this hack ensures that the function is called after a browser render pass
    requestAnimationFrame(()=>{
      this.Module._blinkenlib_loadPlayground(step);
    })
  }

  loadASM_assembler_exit_callback(code: number){
    if(code != 0){
      console.log("assembler failed");
      this.#setState(this.states.READY);
      return
    }
    if(this.mode == blink_modes.FASM){
      let FS = this.Module.FS
      FS.chmod('/program', 0o777);
      this.#setState(this.states.PROGRAM_LOADED);
      this.starti()
    }else{
      //the gnu mode requires a separate linking step
      this.#setState(this.states.LINKING);
      //this hack ensures that the function is called after a browser render pass
      requestAnimationFrame(()=>{
      this.Module._blinkenlib_loadPlayground(2);
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
