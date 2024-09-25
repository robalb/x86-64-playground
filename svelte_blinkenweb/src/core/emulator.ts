import blinkenlib from '../assets/blinkenlib.js'

//this is just a test, a proper es6 class with a good api
//should be  defined

export let Module: any;
export let incr: () => number;
export let add: (val:number) => number;

export async function init(){
  Module = await blinkenlib()
  //init native functions
  //probably not needed, we can call all these
  //functions via Module._functionName()
  incr = Module.cwrap("incr", "number", [])
  add = Module.cwrap("add", "number", ["number"])

  // var data = new Uint8Array(32);
  // var stream = FS.open('dummy', 'w+');
  // FS.write(stream, data, 0, data.length, 0);
  // FS.close(stream);

  //debug
  window["Module"] = Module 
  console.log(Module)
}



