<script>
  import main_wasm from './assets/main.wasm?url'

  let result = 0

  async function init() {
    const { instance } = await WebAssembly.instantiateStreaming(
      fetch(main_wasm)
    );
    result = instance.exports.add(4, 1);
    console.log(result)
  }
  init();
  

</script>

<main>
  <h1>Daje roma</h1>
  <p>4+1 = {result}</p>
</main>

<style>
</style>
