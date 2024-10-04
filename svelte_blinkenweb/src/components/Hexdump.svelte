<script>
import {blinkStore} from '../core/blinkSvelte'

//TODO: a11y arrow keys https://svelte.dev/repl/328a064fd64843f68418e04d2db09f35?version=3.18.1
export let centered = false;
export let bytesPerRow = 16;
export let colorRegions = {}
export let showAscii = true;


let blink = blinkStore.getInstance()


let byte_count = 512
let startAddress = 0n;
let data = Array(byte_count).fill(0)
//rerender registers on machine step
$: $blinkStore.state && updateAll();

let hoveredIndex = -1;

  function updateAll(){
    if(!blink.m || !(blink.state == blink.states.PROGRAM_RUNNING || blink.state == blink.states.PROGRAM_STOPPED)){
      return
    }
    startAddress = blink.m.readU64("rsp");
    for(let i=0; i< byte_count; i++){
      //todo: check ranges
      let ptr = blink.m.getPtr("stackmem");
      data[i] = blink.m.memView.getUint8(ptr + i);
    }
    data = data;
  }


  function ascii(number) {
    if (number >= 32 && number <= 126) {
      return String.fromCharCode(number);
    } else {
      return ".";
    }
  }

  function range(number) {
    if (number == 0) return "00";
    else if (number == 0xff) return "ff";
    else if (number > 0x80) return "large";
    else return "small";
  }

  function color(index) {
    for (let key in colorRegions) {
      if (colorRegions[key].includes(index)) {
        return key;
      }
    }
    return "default";
  }

  function rounded(index) {
    for (let key in colorRegions) {
      if (!colorRegions[key].includes(index)) continue;
      let isEdgeLeft = !colorRegions[key].includes(index - 1);
      let isEdgeRigth = !colorRegions[key].includes(index + 1);
      if (isEdgeLeft && isEdgeRigth) return "all";
      else if (isEdgeLeft) return "left";
      else if (isEdgeRigth) return "right";
    }
    return "";
  }

  function handleHover(e) {
    if (e.target.localName != "span") {
      hoveredIndex = -1;
      return;
    }
    let index = e.target.getAttribute("data-index");
    hoveredIndex = index;
  }
</script>

<div>
  <div
    class="hexdump"
    class:hexdump--center={centered}
    class:hexdump--bytes-16={bytesPerRow === 16}
    class:hexdump--bytes-8={bytesPerRow === 8}
    class:hexdump--bytes-4={bytesPerRow === 4}
    class:hexdump--bytes-2={bytesPerRow === 2}
    class:hexdump--bytes-1={bytesPerRow === 1}
  >
    <div class="hexdump__address">
      {#each data as _, i}
        <div>{((BigInt(i) + startAddress).toString(16)).padStart(16, "0")}</div>
      {/each}
    </div>
    <div class="hexdump__hex hexdump__responsivecol" on:mouseover={handleHover}>
      {#key colorRegions}
      {#each data as d, i}
        <span
          data-range={range(d)}
          data-index={i}
          data-color={color(i)}
          data-rounded={rounded(i)}
          class:highlight={i == hoveredIndex}
          >{("0" + d.toString(16)).slice(-2)}</span
        >
      {/each}
      {/key}
    </div>
    {#if showAscii}
    <div
      class="hexdump__ascii hexdump__responsivecol"
      on:mouseover={handleHover}
    >
      {#key colorRegions}
      {#each data as d, i}
        <span
          data-ascii={ascii(d) != "."}
          data-index={i}
          data-color={color(i)}
          data-rounded={rounded(i)}
          class:highlight={i == hoveredIndex}>{ascii(d)}</span
        >
      {/each}
      {/key}
    </div>
    {/if}
  </div>
</div>


<style>
  .hexdump {
    --columns-padding: 0.5rem;
    --hex-spacing: 0.4rem;
    --ascii-spacing: 0rem;
    --section-border-radius: 6px;
    --section-border-color: var(--theme-hex-section-border);
  }

  .hexdump {
    box-sizing: border-box;
    display: flex;
    container-type: inline-size;

    color: var(--code-font-color);
    font-family: var(--code-font-family);
    font-size: 0.9rem;
  }
  .hexdump--center {
    justify-content: center;
  }

  .hexdump > div {
    overflow: hidden;
    white-space: nowrap;
    padding: var(--columns-padding);
  }

  /* address element*/
  .hexdump__address {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background-color: var(--theme-hexaddr-bg);
  }
  .hexdump__address div {
    display: none;
    color: var(--theme-hexaddr-fg);
  }

  /* hex element*/
  .hexdump__hex {
    background-color: var(--theme-hex-bg);
    flex-shrink: 0;
  }
  .hexdump__hex span {
    color: var(--theme-hex-fg);
  }
  .hexdump__hex span[data-range="00"] {
    color: var(--theme-hex-zero);
  }
  .hexdump__hex span[data-range="ff"] {
    color: var(--theme-hex-ff);
  }
  .hexdump__hex span[data-range="small"] {
    color: var(--theme-hex-small);
  }
  .hexdump__hex span[data-range="large"] {
    color: var(--theme-hex-large);
  }
  .hexdump__hex span {
    padding: 0 var(--hex-spacing);
  }

  /* ascii element*/
  .hexdump__ascii {
    background-color: var(--theme-hexascii-bg);
    flex-shrink: 100;
  }
  .hexdump__ascii span {
    padding: 0 var(--ascii-spacing);
    color: var(--theme-hexascii-invalid);
  }
  .hexdump__ascii span[data-ascii="true"] {
    color: var(--theme-hexascii-valid);
  }

  /*custom section colors */
  .hexdump span[data-color="blue"] {
    background-color: var(--theme-hex-section-blue);
    border-top: 1px solid var(--section-border-color);
    border-bottom: 1px solid var(--section-border-color);
  }
  .hexdump span[data-color="green"] {
    background-color: var(--theme-hex-section-green);
    border-top: 1px solid var(--section-border-color);
    border-bottom: 1px solid var(--section-border-color);
  }
  .hexdump span[data-color="red"] {
    background-color: var(--theme-hex-section-red);
    border-top: 1px solid var(--section-border-color);
    border-bottom: 1px solid var(--section-border-color);
  }
  .hexdump span[data-rounded="left"] {
    border-radius: var(--section-border-radius) 0 0 var(--section-border-radius);
    border-left: 1px solid var(--section-border-color);
  }
  .hexdump span[data-rounded="right"] {
    border-radius: 0 var(--section-border-radius) var(--section-border-radius) 0;
    border-right: 1px solid var(--section-border-color);
  }
  .hexdump span[data-rounded="all"] {
    border-radius: var(--section-border-radius);
    border-left: 1px solid var(--section-border-color);
    border-right: 1px solid var(--section-border-color);
  }

  /* hover states */
  .hexdump .highlight {
    outline: 1px solid gold;
  }

  /* responsiveness based on "\a" and media queries */
  .hexdump__responsivecol {
    contain: content;
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
  }
  .hexdump__responsivecol span {
    contain: strict;
    display: inline;
    white-space: pre;
  }

  .hexdump--bytes-1 .hexdump__responsivecol span:nth-child(1n):after {
    content: "\a";
  }
  .hexdump--bytes-1 .hexdump__address div:nth-child(1n) {
    display: block;
  }

  .hexdump--bytes-2 .hexdump__responsivecol span:nth-child(2n):after {
    content: "\a";
  }
  .hexdump--bytes-2 .hexdump__address div:nth-child(2n + 1) {
    display: block;
  }

  .hexdump--bytes-4 .hexdump__responsivecol span:nth-child(4n):after {
    content: "\a";
  }
  .hexdump--bytes-4 .hexdump__address div:nth-child(4n + 1) {
    display: block;
  }

  .hexdump--bytes-8 .hexdump__responsivecol span:nth-child(8n):after {
    content: "\a";
  }
  .hexdump--bytes-8 .hexdump__address div:nth-child(8n + 1) {
    display: block;
  }

  @container (width <= 500px) {
    /* 8 bytes on this size is disabled, behaves exaclty like 4 bytes */
    .hexdump--bytes-8 .hexdump__responsivecol span:nth-child(4n):after {
      content: "\a";
    }
    .hexdump--bytes-8 .hexdump__address div:nth-child(4n + 1) {
      display: block;
    }
    /* 16 bytes on this size is disabled, behaves exaclty like 4 bytes */
    .hexdump--bytes-16 .hexdump__responsivecol span:nth-child(4n):after {
      content: "\a";
    }
    .hexdump--bytes-16 .hexdump__address div:nth-child(4n + 1) {
      display: block;
    }
  }

  @container (500px < width < 830px) {
    /* enable 8 bytes on this size */
    .hexdump--bytes-8 .hexdump__responsivecol span:nth-child(8n):after {
      content: "\a";
    }
    .hexdump--bytes-8 .hexdump__address div:nth-child(8n + 1) {
      display: block;
    }

    /* 16 bytes on this size is disabled, behaves exaclty like 8 bytes */
    .hexdump--bytes-16 .hexdump__responsivecol span:nth-child(8n):after {
      content: "\a";
    }
    .hexdump--bytes-16 .hexdump__address div:nth-child(8n + 1) {
      display: block;
    }
  }

  @container (min-width: 830px) {
    /* enables 16 bytes on this size*/
    .hexdump--bytes-16 .hexdump__responsivecol span:nth-child(16n):after {
      content: "\a";
    }
    .hexdump--bytes-16 .hexdump__address div:nth-child(16n + 1) {
      display: block;
    }

    .hexdump--bytes-16
      .hexdump__hex
      span:nth-child(8n):not(span:nth-child(16n)) {
      margin-right: 10px;
    }
    .hexdump--bytes-16
      .hexdump__ascii
      span:nth-child(8n):not(span:nth-child(16n)) {
      margin-right: 10px;
    }
  }
</style>
