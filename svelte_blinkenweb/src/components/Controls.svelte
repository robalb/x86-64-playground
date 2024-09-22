<script>
  import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	function onRun() {
		dispatch('runClick', 'button1')
	}
	function onReset() {
		dispatch('resetClick', 'button2');
	}
</script>

<div class="controls">
  <div class="controls__header">
    <h1 class="logo">x86-64 playground</h1>
    <a href="#">about</a><br/>
    <a href="#">settings</a>
    <br/>
    <br/>
    <br/>
  </div>


  <div class="controls__buttonbar">
    <button>start | stop</button>
    <button>step</button>
    <button>reverse-step</button>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Neuton&display=swap');
  .controls {
    display: flex;
    flex-direction:column;
    justify-content:space-between;
    height: 100%;
  }
  .controls__header{
    margin-left: 1rem;

    & a{
      color: white;
      text-decoration:underline;
    }

    & h1{
      font-family: "Neuton", serif;
      margin: .2rem;
      font-weight: 400;
      font-style: normal;
      font-size:28px;
    }
  }
  .controls__buttonbar{
    display: flex;
    justify-content:center;
  }

  button{
    color: white;
    background-color: rgba(255,255,255,.1);
    padding: .5rem;
    border: 1px solid rgba(255,255,255, .4);
    border-radius: 5px;
  }

</style>
