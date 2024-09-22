<script>

  import Hexdump from './Hexdump.svelte'
  import Controls from './Controls.svelte'
  import Editor from './Editor.svelte'

  export let codePanel = true;
  export let registersPanel = true;
  export let memoryPanel = true;

  export let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
  export let registers = [];
  export let strData = "";
  export let showAscii = true;
  export let startAddress = 0;
  export let colorRegions = {};


  function hex_intPreview(bytes){
      let hexBytes = bytes.map(byte => byte.toString(16).padStart(2, '0'));
      hexBytes.reverse();
      while (hexBytes[0] === '00' && hexBytes.length > 1) {
          hexBytes.shift();
      }
      let hexString = '0x' + hexBytes.join('');
      return hexString;
  }

  function preview(r){
    if(r.preview == "hex_int")
      return hex_intPreview(r.bytes)
    else
      return ""
  }

  function hexString(arr){
    return arr.map(i => ("0" + i.toString(16)).slice(-2)).join(" ")
  }


</script>


<div class="embed">
  {#if true}
  <section
      class="embed__panel embed_panel--ctrls"
      aria-labelledby="">
    <div class="embed__content">
        <Controls/>
    </div>
  </section>
  {/if}

  {#if codePanel}
  <section
      class="embed__panel embed_panel--code"
      aria-labelledby="">
    <div
        class="embed__panel_bar"
      >
      <p>code</p>
    </div>
    <div class="embed__content">
        <Editor/>
    </div>
  </section>
  {/if}

  {#if registersPanel}
  <section
      class="embed__panel embed_panel--regs"
      aria-labelledby="">
    <div class="embed__panel_bar" >
      <p>registers</p>
    </div>
    <div class="embed__content">
      <pre><code class="language-assembly embed__registers">{#each registers as r}<span class={"name " + r.color}>{r.name}</span>  : <span class="hex">[{hexString(r.bytes)}]</span><span class="int">{preview(r)}</span> 
{/each}</code></pre>
    </div>
  </section>
  {/if}

  {#if memoryPanel}
  <section
      class="embed__panel embed_panel--memory --round_bottom" aria-labelledby="">
    <div class="embed__panel_bar">
      <p>memory</p>
    </div>
    <div class="embed__content">
      <Hexdump
        bytesPerRow={16}
        centered={false}
        unstyled={true}
        {data}
        {strData}
        {showAscii}
        {startAddress}
        {colorRegions}
      />
    </div>
  </section>
  {/if}

</div>

<style>

.embed {
  --drag-line-color: transparent;
  --controls-bg-color: #1c1e24;
  --controls-fg-color: #d0d5df;
  --controls-border-color: rgba(255, 255, 255, .4); /*light*/
  --controls-border-color: rgba(255, 255, 255, .2); /*dark*/
  --panel-bg-color: #20232a;
  --panel-fg-color: white;

  --reg-blue-color: #6ab0f3;
  --reg-red-color: #fca369;
  --reg-hexdump-color: #818a9d;
  --reg-int-color: white;
}

.embed{
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  display: grid;
  height: 100vh;
  width: 100vw;

  grid-template-columns: 1fr 1fr 1fr 49rem;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 
    "ctrls  ctrls  regs   memory"
    "code   code   regs   memory";
}

.embed__panel {
  display: flex;
  flex-direction:column;
  border-left: 1px solid var(--controls-border-color);
  background-color: var(--panel-bg-color);
}

.embed_panel--header {
  grid-area: header;
}
.embed_panel--code {
  grid-area: code;
}
.embed_panel--regs {
  grid-area: regs;
}
.embed_panel--memory {
  grid-area: memory;
}
.embed_panel--ctrls {
  grid-area: ctrls;
}

.embed__panel_bar {
  background-color: var(--controls-bg-color);
  border-top: 1px solid var(--controls-border-color);
  border-bottom: 1px solid var(--controls-border-color);

  height: 2rem;
  padding-left: 1rem;

  & p{
    color: var(--controls-fg-color);

  }
  & h3 {
    font-size: 1.1rem;
    font-weight:200;
    text-decoration:none;
    border: none;

  }

  &.--round_top{
    border-top: 1px solid transparent;
    border-radius: 8px 8px 0 0;
  }
}

.embed__content {
  padding-bottom: 1rem;
  overflow-y: scroll;

  & pre{
    overflow: auto;
    color: white;
    padding: 1rem;
    padding-bottom: .5rem;
    margin: 0;
  }
}

.embed__code_controls_box {
		height:0;
    width: 100%;
    display: flex;
    justify-content:flex-end;
}

.embed__code_controls {
      position: relative;
      top: -50px;
      margin-right: 1rem;

    & button{
      background-color: #f0f0f0;
      padding: 0.5rem;
      border: 2px solid #f0f0f0;
      border-radius:8px;
      color: black;
    }
    & button:active{
      border-top: 0px;
      border-bottom: 0px;
      border-color: transparent;
    }
}

.embed__registers {
  & .name {
    color: var(--reg-blue-color);
  }
  & .blue{
    color: var(--reg-blue-color);
  }
  & .red{
    color: var(--reg-red-color);
  }
  & .hex {
    display: none;
    color: var(--reg-hexdump-color);
  }
  & .int {
    color: var(--reg-int-color);
  }
}

/* global modifiers, not following BEM rules */
.--round_top{
  border-radius: 8px 8px 0 0;
}
.--round_bottom{
  border-radius: 0 0 8px 8px;
}


</style>
