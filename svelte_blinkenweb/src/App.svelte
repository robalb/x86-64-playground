<script>
  import main_wasm from './assets/main.wasm?url'

  let result = 0
  let acc = 0;
  let main_instance;

  async function init() {
    const { instance } = await WebAssembly.instantiateStreaming(
      fetch(main_wasm)
    );
    main_instance = instance
    window["c"] = main_instance
    console.log(instance.exports)
    result = instance.exports.add(4, 1);
  }
  init();

  async function handleIncr(){
    if(!main_instance) return;
    acc = main_instance.exports.incr();
  }
  

</script>

<main>
  <h1>Daje roma</h1>
  <p>4+1 = {result}</p>
  <button on:click={handleIncr}>{acc}</button>
</main>

<style>
</style>
