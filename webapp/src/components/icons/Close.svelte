
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
  height="24px"
  width="24px"
  viewBox="0 -960 960 960"
  class="default-fill"
  {...$$props}
><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
<style>
.default-fill{
  fill: var(--theme-text-fg-contrasting);
}
</style>

