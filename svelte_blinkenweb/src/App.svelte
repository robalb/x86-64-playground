<script>
  import {Module, incr, add, init} from './core/emulator.js'
  
  init()

  let result = 0
  let acc = 0;

  async function handleIncr(){
    if(!Module) return;
      acc = incr()
      console.log(add(acc))
  }
  

</script>

<main>
  <h1>wasm engine test</h1>
  <p>4+1 = {result}</p>
  <button on:click={handleIncr}>{acc}</button>
</main>

<style>
</style>
