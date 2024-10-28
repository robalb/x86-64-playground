import {Assemblers_key} from './assemblers'



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
