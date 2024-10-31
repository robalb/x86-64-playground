import {Assemblers_key, assemblers} from './assemblers'
import {Snippet} from './example_snippets'
import {compressStringToBase64, decompressBase64ToString} from './compression'


/**
* AppState represents a snapshot of the whole webapp.
* When you use the "share" feature from the ui, load an
* example, or load the link someone shared with you,
* you are serializing or deserializing a blob into an Appstate object.
*
* The webapp store has a methods to get or set the AppState.
* setting the AppState updates the whole webapp 
 */
export interface AppState {
  editorContent: string;
  mode: Assemblers_key;
}

const APPSTATE_VERSION = 1;

/**
* This interface cannot change between versions,
* for compatibilty reasons
*/
interface SerializedAppState {
  magic: "it.halb.x64"
  version: number;
  data: object;
}

/**
* Deserializers / Migrations
*
* AppState can change between versions.
* This is why we add a version number when serializing an AppState,
* and we define a deserializer for every SerializedAppState version.
* This allows us to retroactively support old AppStates, eventually
* migrating old states into new formats
*/
const deserializers = {
  /**
  * Deserialize a Serialized AppState V1 into the current AppState
  */
  1: function(serialized:SerializedAppState): AppState{
    let ret: AppState = null;
    let obj: any = serialized.data;
    let obj_is_valid = (
      typeof obj === 'object' &&
        obj !== null &&
        typeof obj.editorContent === 'string' &&
        typeof obj.mode === 'string' &&
        assemblers.hasOwnProperty(obj.mode)
    );
    if(obj_is_valid){
      ret = {
        editorContent: obj.editorContent,
        mode: obj.mode,
      }
    }
    return ret;
  }
}

function isSerializedAppState(obj: any): obj is SerializedAppState {
  return (
    typeof obj === 'object' &&
      obj !== null &&
      typeof obj.version === 'number' &&
      deserializers.hasOwnProperty(obj.version) &&
      typeof obj.magic === 'string' &&
      obj.magic == "it.halb.x64" &&
      typeof obj.data === 'object' &&
      obj.data != null
  );
}

function serializeAppState(state: AppState): string{
  const versionedState: SerializedAppState = {
    magic: "it.halb.x64",
    version: APPSTATE_VERSION,
    data: state
  }
  const jsonString = JSON.stringify(versionedState);
  return compressStringToBase64(jsonString)
}

function deserializeAppState(serialized: string): AppState | null{
  if (!serialized) return null;
  try {
    const jsonstring = decompressBase64ToString(serialized)
    const parsedState = JSON.parse(jsonstring);
    if (isSerializedAppState(parsedState)) {
      return deserializers[parsedState.version](parsedState);
    } else {
      console.error("Deserialized object does not match SerializedAppState shape");
      return null;
    }
  } catch (error) {
    console.error("Failed to deserialize blob:", error);
    return null;
  }

}

/**
 * TODO: use a standard serializedAppState object even for snippets.
 */
export function snippetToAppState(snippet: Snippet): AppState{
  return {
    editorContent: snippet.editorContent,
    mode: snippet.mode
  }
}


export function storage_setAppState(state: AppState){
}

export function storage_getAppState(): AppState|null{
  return null
}

export function storage_deleteAppState(){
}

export function uri_serializeAppState(state: AppState, wantFullUrl=false): string {
  let param = serializeAppState(state)
  if(wantFullUrl){
    const urlWithoutParams = window.location.origin + window.location.pathname;
    return `${urlWithoutParams}?appstate=${param}`
  }
  else{
    return param;
  }

}

export function uri_getAppState(): AppState | null {
  const params = new URLSearchParams(document.location.search);
  const str = params.get('appstate');
  return deserializeAppState(str)
}



// async function test(jsonString){
//   // let str = encodeURIComponent(jsonString);
//   let str1 = jsonString;
//   let browser = await decompressBase64ToString(
//       await compressStringToBase64(str1)
//     )
//   let fflate = decompressBase64ToString_poly(
//       compressStringToBase64_poly(str1)
//     )
//   console.log("browser")
//   console.log(browser)
//   console.log("fflate")
//   console.log(fflate)
//   console.log(browser === fflate)

//   console.log("broser length")
//   let ret = await compressStringToBase64(str1)
//   console.log(ret.length)
//   console.log("fflate length")
//   console.log(compressStringToBase64_poly(str1).length)
// }

