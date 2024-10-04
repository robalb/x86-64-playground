<script lang="ts">
import './styles/style.css';
import { PaneGroup, Pane, PaneResizer } from "paneforge";
import ThemeDebug from './components/ThemeDebug.svelte';
import Hexdump from './components/Hexdump.svelte';
import Editor from './components/Editor.svelte';

let col = true;
</script>

<PaneGroup direction="horizontal" class="pf__panegroup pf__panegroup--horizontal">
	<Pane defaultSize={50} class="pf__pane">
		<PaneGroup direction="vertical" class="pf__panegroup pf__panegroup--vertical">
			<Pane defaultSize={25} class="pf__pane">
        <div class="pane">
          <div class="pane__content">
            <button on:click={()=>col = !col}>aaaa</button>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga quaerat eos, saepe doloribus
            facere fugiat! Magni consequatur a veniam quia. Exercitationem recusandae facilis cupiditate
            repellendus quaerat tenetur minima veniam quia! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Excepturi totam voluptates eveniet vel ab velit quas repudiandae quae
            possimus ad, eligendi commodi perspiciatis nisi tempora vitae ratione non! Praesentium,
            aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia fuga harum odit
            doloribus ea. Atque expedita repudiandae, provident suscipit dignissimos cupiditate itaque
            beatae debitis autem animi qui, quas aspernatur impedit!
          </div>
				</div>
			</Pane>
			<PaneResizer class="pf__resizer pf__resizer--horizontal" />
			<Pane defaultSize={75} class="pf__pane">
        <div class="pane">
          <div class="pane__bar">
            <p>Code editor</p>
          </div>
          <div class="pane__content">
            <Editor />
          </div>
        </div>
			</Pane>
		</PaneGroup>
	</Pane>
	<PaneResizer class="pf__resizer pf__resizer--vertical" />
	<Pane defaultSize={50} class="pf__pane pf__pane--h100">
		<PaneGroup direction="vertical" class="pf__panegroup pf__panegroup--vertical">
			<Pane defaultSize={25} class="pf__pane">
        <div class="pane">
          <div class="pane__bar">
            <p>Content</p>
          </div>
          <div class="pane__content">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga quaerat eos, saepe doloribus
            facere fugiat! Magni consequatur a veniam quia. Exercitationem recusandae facilis cupiditate
            repellendus quaerat tenetur minima veniam quia! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Excepturi totam voluptates eveniet vel ab velit quas repudiandae quae
            possimus ad, eligendi commodi perspiciatis nisi tempora vitae ratione non! Praesentium,
            aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia fuga harum odit
            doloribus ea. Atque expedita repudiandae, provident suscipit dignissimos cupiditate itaque
            beatae debitis autem animi qui, quas aspernatur impedit!
          </div>
				</div>
			</Pane>
			<PaneResizer class="pf__resizer pf__resizer--horizontal" />
			<Pane defaultSize={75} class="pf__pane">
        <div class="pane">
          <div class="pane__bar">
            <p>Content</p>
          </div>
          <div class="pane__content">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga quaerat eos, saepe doloribus
            facere fugiat! Magni consequatur a veniam quia. Exercitationem recusandae facilis cupiditate
            repellendus quaerat tenetur minima veniam quia! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Excepturi totam voluptates eveniet vel ab velit quas repudiandae quae
            possimus ad, eligendi commodi perspiciatis nisi tempora vitae ratione non! Praesentium,
            aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia fuga harum odit
            doloribus ea. Atque expedita repudiandae, provident suscipit dignissimos cupiditate itaque
            beatae debitis autem animi qui, quas aspernatur impedit!
          </div>
        </div>
			</Pane>
		</PaneGroup>
	</Pane>
  {#if col}
	<PaneResizer class="pf__resizer pf__resizer--vertical" />
	<Pane defaultSize={50} class="pf__pane pf__pane--h100">
		<div class="pane">
          <div class="pane__bar">
            <p>Stack memory</p>
          </div>
          <div class="pane__content">
            <Hexdump />
          </div>
		</div>
	</Pane>
{/if}
</PaneGroup>

<style>
  .pane{
    display: flex; 
    justify-content: center; 
    flex-direction:column;
    align-items: stretch;
    height: 100%; 
    border-left: 2px solid var(--theme-panel-border);
    border: 1px solid var(--theme-panel-border);
  }
  .pane__bar{
    height: 2rem;
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
  }
</style>
