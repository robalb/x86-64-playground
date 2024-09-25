import blinkenlib from '../assets/blinkenlib.js'

//this is just a test, a proper es6 class with a good api
//should be  defined

export let Module: any;
export let incr: () => number;
export let add: (val:number) => number;

function stdin(){
  console.log("stdin")
}
function stdout(){
  console.log("stdout")
}
function stderr(){
  console.log("stderr")
}

export async function init(){
  Module = await blinkenlib({
    preRun: function(M){
      console.log("prerun!!!!!")
      // https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.init
      M.FS.init(stdin, stdout, stderr)
    }
  })
  //init native functions
  //probably not needed, we can call all these
  //functions via Module._functionName()
  incr = Module.cwrap("incr", "number", [])
  add = Module.cwrap("add", "number", ["number"])

  let data = new Uint8Array(32);
  data[0] = 1
  data[1] = 2
  data[2] = 8
  let FS = Module.FS
  let stream = FS.open('program', 'w+');
  FS.write(stream, data, 0, data.length, 0);
  FS.close(stream);

  //debug
  window["Module"] = Module 
  console.log(Module)
}



