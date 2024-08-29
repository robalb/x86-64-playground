<script>
  //TODO: a11y arrow keys https://svelte.dev/repl/328a064fd64843f68418e04d2db09f35?version=3.18.1
  export let centered = true;
  export let bytesPerRow = 8;
  export let data = [0, 0, 0, 0, 0xca, 0xfe, 0xba, 0xbe];
  export let strData = "";
  export let showAscii = true;
  export let startAddress = 0;
  export let colorRegions = {};
  export let unstyled = false;

  let hoveredIndex = -1;

  function parseHexdump(hexdump) {
    const lines = hexdump.trim().split("\n");
    const parsedArray = [];
    for (const line of lines) {
      const hexBytes = line.trim().split(" ");
      for (const hexByte of hexBytes) {
        const intValue = parseInt(hexByte, 16);
        parsedArray.push(intValue);
      }
    }
    return parsedArray;
  }

  $: if (strData.length > 0) {
    data = parseHexdump(strData);
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
    class:hexdump--unstyled={unstyled}
    class:hexdump--bytes-16={bytesPerRow === 16}
    class:hexdump--bytes-8={bytesPerRow === 8}
    class:hexdump--bytes-4={bytesPerRow === 4}
    class:hexdump--bytes-2={bytesPerRow === 2}
    class:hexdump--bytes-1={bytesPerRow === 1}
  >
    <div class="hexdump__address">
      {#each data as _, i}
        <div>{("0000000" + (i + startAddress).toString(16)).slice(-8)}</div>
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
    --default-bg-color: #1c1e24;

    --addr-text-color: white;
    --addr-bg-color: var(--default-bg-color);

    --section-blue-color: #3e296c;
    --section-red-color: #640054;
    --section-green-color: green;
    --section-border-radius: 6px;
    --section-border-color: gray;

    --hex-text-color: #b3b9c5;
    --hex-zero-color: #818a9d;
    --hex-ff-color: #92d192;
    --hex-small-color: white;
    --hex-large-color: #ffeead;
    --hex-bg-color: var(--default-bg-color);

    --ascii-valid-color: #6ab0f3;
    --ascii-valid-color: white;
    --ascii-invalid-color: #b3b9c5;
    --ascii-bg-color: var(--default-bg-color);

    --divider-bar-color: #818a9d;
    --border-color: var(--light-border-color);
  }
  .hexdump--unstyled {
    --addr-bg-color: transparent;
    --hex-bg-color: transparent;
    --ascii-bg-color: transparent;
    --border-color: transparent;
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
    background-color: var(--addr-bg-color);
  }
  .hexdump__address div {
    display: none;
    color: var(--addr-text-color);
  }

  /* hex element*/
  .hexdump__hex {
    background-color: var(--hex-bg-color);
  }
  .hexdump__hex span {
    color: var(--hex-text-color);
  }
  .hexdump__hex span[data-range="00"] {
    color: var(--hex-zero-color);
  }
  .hexdump__hex span[data-range="ff"] {
    color: var(--hex-ff-color);
  }
  .hexdump__hex span[data-range="small"] {
    color: var(--hex-small-color);
  }
  .hexdump__hex span[data-range="large"] {
    color: var(--hex-large-color);
  }
  .hexdump__hex span {
    padding: 0 var(--hex-spacing);
  }

  /* ascii element*/
  .hexdump__ascii {
    background-color: var(--ascii-bg-color);
  }
  .hexdump__ascii span {
    padding: 0 var(--ascii-spacing);
    color: var(--ascii-invalid-color);
  }
  .hexdump__ascii span[data-ascii="true"] {
    color: var(--ascii-valid-color);
  }

  /*border*/
  .hexdump__address {
    border-radius: 8px 0 0 8px;
    border-left: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
  .hexdump__hex {
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
  .hexdump__ascii {
    border-radius: 0 8px 8px 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }

  /*custom section colors */
  .hexdump span[data-color="blue"] {
    background-color: var(--section-blue-color);
    border-top: 1px solid var(--section-border-color);
    border-bottom: 1px solid var(--section-border-color);
  }
  .hexdump span[data-color="green"] {
    background-color: var(--section-green-color);
    border-top: 1px solid var(--section-border-color);
    border-bottom: 1px solid var(--section-border-color);
  }
  .hexdump span[data-color="red"] {
    background-color: var(--section-red-color);
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
  .hexdump__hex span:hover {
    outline: 1px solid gold;
  }
  .hexdump__ascii span:hover {
    outline: 1px solid gold;
  }
  .hexdump__address div:hover {
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

  @container (width <= 430px) {
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

  @container (430px < width < 760px) {
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

  @container (min-width: 760px) {
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
