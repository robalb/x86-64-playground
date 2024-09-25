import blinkenlib from '../assets/blinkenlib.js'

import example_elf_url from '../assets/example_elf?url'

//this is just a test, a proper es6 class with a good api
//should be  defined

export let Module: any;
export let incr: () => number;
export let add: (val:number) => number;

function stdin(){
  console.log("stdin")
}
function stdout(charcode: number){
  let char = String.fromCharCode(charcode);
  console.log(char)
  console.log("stdout")
}
function stderr(charcode: number){
  let char = String.fromCharCode(charcode);
  console.log(char)
  console.log("stderr")
}

async function fetchBinaryFile(url) {
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

export async function init(){
  Module = await blinkenlib({
    preRun: async function(M){
      console.log("prerun!!!!!")
      // https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.init
      // https://github.com/emscripten-core/emscripten/issues/6935
      // https://stackoverflow.com/questions/32912129/providing-stdin-to-an-emscripten-html-program
      M.FS.init(stdin, stdout, stderr)
    }
  })


  //init native functions
  //probably not needed, we can call all these
  //functions via Module._functionName()
  incr = Module.cwrap("incr", "number", [])
  add = Module.cwrap("add", "number", ["number"])


      let filedata = await fetchBinaryFile(example_elf_url)
      window["filedata"] = filedata
      let data = new Uint8Array(filedata);
      // data[0] = 1
      // data[1] = 2
      // data[2] = 8
      let FS = Module.FS
      let stream = FS.open('/program', 'w+');
      FS.write(stream, data, 0, data.length, 0);
      FS.close(stream);

  //debug
  window["Module"] = Module 
  console.log(Module)
}

