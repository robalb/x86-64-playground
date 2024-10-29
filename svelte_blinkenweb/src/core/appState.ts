import {Assemblers_key} from './assemblers'
import {Snippet} from './example_snippets'



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

