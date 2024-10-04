<script lang="ts">
import './styles/style.css';
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import ThemeDebug from './components/ThemeDebug.svelte';
</script>

<PaneGroup direction="horizontal" class="pf__panegroup pf__panegroup--horizontal pf__panegroup--main">
	<Pane defaultSize={50} minSize={10} class="pf__pane">
    <div class="pane pane--h100">
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
        <ThemeDebug />
      </div>
    </div>
	</Pane>
	<PaneResizer class="pf__resizer pf__resizer--vertical" />
	<Pane defaultSize={50} class="pf__pane">
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
	<PaneResizer class="pf__resizer pf__resizer--vertical" />
	<Pane defaultSize={50} class="pf__pane">
		<div class="pane pane--h100">
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
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga quaerat eos, saepe doloribus
            facere fugiat! Magni consequatur a veniam quia. Exercitationem recusandae facilis cupiditate
            repellendus quaerat tenetur minima veniam quia! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Excepturi totam voluptates eveniet vel ab velit quas repudiandae quae
            possimus ad, eligendi commodi perspiciatis nisi tempora vitae ratione non! Praesentium,
            aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia fuga harum odit
            doloribus ea. Atque expedita repudiandae, provident suscipit dignissimos cupiditate itaque
            beatae debitis autem animi qui, quas aspernatur impedit!
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga quaerat eos, saepe doloribus
            facere fugiat! Magni consequatur a veniam quia. Exercitationem recusandae facilis cupiditate
            repellendus quaerat tenetur minima veniam quia! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Excepturi totam voluptates eveniet vel ab velit quas repudiandae quae
            possimus ad, eligendi commodi perspiciatis nisi tempora vitae ratione non! Praesentium,
            aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia fuga harum odit
            doloribus ea. Atque expedita repudiandae, provident suscipit dignissimos cupiditate itaque
            beatae debitis autem animi qui, quas aspernatur impedit!
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

<style>
  .pane{
    display: flex; 
    justify-content: center; 
    align-items: center; 
    flex-direction:column;
    height: 100%; 
    border-left: 2px solid var(--theme-panel-border);
    border: 1px solid var(--theme-panel-border);
  }
  .pane--h100{
    height: 100vh;
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

    /* height: calc(100% - 2rem);  */
    height: 100%;
    padding: 1rem; /*TODO: al temporary*/
  }

  /* TODO al: remove */
  /* .t1{ */
  /*   display: flex;  */
  /*   justify-content: center;  */
  /*   align-items: center;  */
  /*   border-radius: 0.5rem;  */
  /*   height: 100%;  */
  /* } */

  /* .t1.t1bis{ */
  /*   height: 100vh; */
  /* } */

  /* .t2{ */
  /*   overflow: auto;  */
  /*   /* padding: 1.5rem;  */ 
  /*   height: 100%;  */
  /* } */
</style>
