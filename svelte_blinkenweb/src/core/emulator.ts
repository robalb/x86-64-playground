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

  //debug
  window["Module"] = Module 
  console.log(Module)
}



