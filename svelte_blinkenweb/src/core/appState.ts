import {Assemblers_key} from './assemblers'
import {Snippet} from './example_snippets'


export const APPSTATE_VERSION = 1

/*
 * AppState represents a snapshot of the whole webapp.
* When you use the "share" feature from the ui, you load an
* example or load the link someone shared with you,
* you are serializing or deserializing a blob into an Appstate object.
*
* The webapp store has a methods to get or set the AppState.
* setting the AppState updates the whole webapp 
 */
export interface AppState {
  editorContent: string;
  mode: Assemblers_key;
}

export function isAppState(obj: any): obj is AppState {
  console.log(obj)
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.editorContent === 'string' &&
    typeof obj.mode === 'string' // or replace with an appropriate validation for Assemblers_key
  );
}


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
  const jsonString = JSON.stringify(state);
  let param = encodeURIComponent(jsonString);
  if(wantFullUrl){
    const urlWithoutParams = window.location.origin + window.location.pathname;
    return `${urlWithoutParams}?appstate=${param}`
  }
  else{
    return param;
  }

}

// Deserializer function: Converts URI-friendly "appstate" string back to AppState
export function uri_getAppState(): AppState | null {
  const params = new URLSearchParams(document.location.search);
  const encodedState = params.get('appstate');
  console.log(encodedState)
  if(encodedState)
  if (!encodedState) return null;
  try {
    const decodedState = decodeURIComponent(encodedState);
    const parsedState = JSON.parse(decodedState);

    if (isAppState(parsedState)) {
      return parsedState;
    } else {
      console.error("Deserialized object does not match AppState shape");
      return null;
    }
  } catch (error) {
    console.error("Failed to deserialize AppState:", error);
    return null;
  }
}

