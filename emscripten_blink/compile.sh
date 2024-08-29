
cd blink && emmake make o//blink/blinkenlib.js

cp ./o/blink/blinkenlib.wasm ../../svelte_blinkenweb/src/assets/
cp ./o/blink/blinkenlib.js ../../svelte_blinkenweb/src/assets/
cp ./o/blink/blinkenlib.html ../../svelte_blinkenweb/src/assets/
