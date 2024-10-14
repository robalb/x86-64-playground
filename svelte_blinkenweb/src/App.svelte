<script lang="ts">
import './styles/style.css';
import { PaneGroup, Pane, PaneResizer } from "paneforge";
// import ThemeDebug from './components/ThemeDebug.svelte';
import Hexdump from './components/Hexdump.svelte';
import Editor from './components/Editor.svelte';
import Registers from './components/Registers.svelte';
import Disassembler from './components/Disassembler.svelte';
import Terminal from './components/Terminal.svelte';
import Controls from './components/Controls.svelte';

</script>

<PaneGroup direction="horizontal" class="pf__panegroup pf__panegroup--horizontal">

	<Pane defaultSize={25} class="pf__pane pf__pane--h100">
		<div class="pane">
            <Controls/>
          <!-- <div class="pane__bar"> -->
          <!--   <p>Editor</p> -->
          <!-- </div> -->
          <div class="pane__content">
            <Editor />
          </div>
		</div>
	</Pane>

	<!-- <Pane defaultSize={25} class="pf__pane"> -->
	<!-- 	<PaneGroup direction="vertical" class="pf__panegroup pf__panegroup--vertical"> -->
	<!-- 		<Pane defaultSize={25} class="pf__pane"> -->
 <!--        <div class="pane"> -->
 <!--          <div class="pane__content"> -->
 <!--            <Controls/> -->
 <!--          </div> -->
	<!-- 			</div> -->
	<!-- 		</Pane> -->
	<!-- 		<PaneResizer class="pf__resizer pf__resizer--horizontal" /> -->
	<!-- 		<Pane defaultSize={75} class="pf__pane"> -->
 <!--        <div class="pane"> -->
 <!--          <div class="pane__bar"> -->
 <!--            <p>Code editor</p> -->
 <!--            <select> -->
 <!--          </div> -->
 <!--          <div class="pane__content"> -->
 <!--            <Editor /> -->
 <!--          </div> -->
 <!--        </div> -->
	<!-- 		</Pane> -->
	<!-- 	</PaneGroup> -->
	<!-- </Pane> -->

	<PaneResizer class="pf__resizer pf__resizer--vertical" />
	<Pane defaultSize={30} class="pf__pane pf__pane--h100">
		<div class="pane">
          <div class="pane__bar">
            <p>Disassembly</p>
          </div>
          <div class="pane__content">
            <Disassembler />
          </div>
		</div>
	</Pane>

	<PaneResizer class="pf__resizer pf__resizer--vertical" />
	<Pane defaultSize={15} class="pf__pane pf__pane--h100">
		<PaneGroup direction="vertical" class="pf__panegroup pf__panegroup--vertical">
			<Pane defaultSize={50} class="pf__pane">
        <div class="pane">
          <div class="pane__bar">
            <p>Registers</p>
          </div>
          <div class="pane__content">
            <Registers />
          </div>
				</div>
			</Pane>
			<PaneResizer class="pf__resizer pf__resizer--horizontal" />
			<Pane defaultSize={50} class="pf__pane">
        <div class="pane">
          <div class="pane__bar">
            <p>Terminal</p>
          </div>
          <div class="pane__content">
            <Terminal/>
          </div>
        </div>
			</Pane>
		</PaneGroup>
	</Pane>
  <PaneResizer class="pf__resizer pf__resizer--vertical" />
	<Pane defaultSize={25} class="pf__pane pf__pane--h100">
		<div class="pane">
          <div class="pane__bar">
            <p>Stack memory</p>
          </div>
          <div class="pane__content">
            <Hexdump />
          </div>
		</div>
	</Pane>
</PaneGroup>

<style>
  .pane{
    display: flex; 
    justify-content: center; 
    flex-direction:column;
    align-items: stretch;
    height: 100%; 
    /* border: 1px solid var(--theme-panel-border); */
  }
  .pane__bar{
    height: 2rem;
    flex-shrink: 0;

    padding-left: 1rem;
    background-color: var(--theme-panel-controls-bg);
    border-bottom: 1px solid var(--theme-panel-border);
    width: 100%;
    display: flex;
  }
  .pane__bar p{
    font-size: 1.1rem;
    margin: 0;
  }

  .pane__content{
    overflow: auto; 
    height: 100%;
    /*this is cool the first time you see it, then super annoying */
    /* scroll-behavior: smooth; */
  }

</style>
