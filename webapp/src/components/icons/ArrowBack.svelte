
<!--@component
  Svg Icon
  By default this icon will have a fill of the default foreground color.

  To override a color, use the style attribute with a theme css variable:
  ```tsx
    <Icon style="fill:var(--theme-primary);" />
  ```
  
  By default, this icon will have a height and width of 24px.
  To override:
  ```tsx
    <Icon width="12px" height="12px" />
  ```
-->
<svg xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 -960 960 960" 
  height="24px" 
  width="24px"
  class="default-fill"
  {...$$props}
><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

<style>
.default-fill{
  fill: var(--theme-text-fg-contrasting);
}
</style>
