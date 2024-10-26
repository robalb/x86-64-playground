<script lang="ts">
  import { createDropdownMenu, melt } from '@melt-ui/svelte';
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
    import ArrowForward from './icons/ArrowForward.svelte';


  const {
    elements: { trigger, menu, item, separator, },
    builders: { createSubmenu, },
    states: { open },
  } = createDropdownMenu({
    forceVisible: true,
    loop: true,
  });

  const {
    elements: { subMenu, subTrigger },
    states: { subOpen },
  } = createSubmenu();



  const personsArr = [
    'Hunter Johnston',
    'Thomas G. Lopes',
    'Adrian Gonz',
    'Franck Poingt',
  ];
</script>

<button
  type="button"
  class="trigger button"
  {...$trigger} use:trigger
  aria-label="File options"
>
  File
</button>

{#if $open}
  <div class="menu" {...$menu} use:menu >
    <div class="item" {...$item} use:item>Share</div>
    <div class="item" {...$subTrigger} use:subTrigger>
      Load example
      <div class="rightSlot">
        <ArrowForward style="fill:var(--theme-primary);" height="12px"/>
      </div>
    </div>
    {#if $subOpen}
      <div
        class="menu subMenu"
        {...$subMenu} use:subMenu
      >
        <div class="text">Examples</div>
          {#each personsArr as person}
            <div class="item" {...$item} use:item>{person}</div>
          {/each}
      </div>
    {/if}

    <div class="separator" {...$separator} use:separator />
    <div class="item" {...$item} use:item>Load executable from your files</div>

  </div>
{/if}

<style>
.menu {
  z-index: 40;
  display: flex;
  max-height: 300px;
  min-width: 220px;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 0.375rem;
  background-color: black;
  padding: 0.25rem;
}

.subMenu {
  min-width: 220px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
}

.item {
  position: relative;
  height: 1.5rem;
  min-height: 24px;
  user-select: none;
  border-radius: 0.125rem;
  padding-left: 1.5rem;
  padding-right: 0.25rem;
  z-index: 40;
  color: #1c1b1f;
  outline: none;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1;
}

.item[data-highlighted] {
  background-color: #e0e0e0;
}

.item[data-disabled] {
}


.trigger[data-highlighted] {
  border: 2px solid #d1d1ff;
  ring-offset: 2;
  outline: none;
}

.check {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(calc(-50% + 1px));
  color: #5e17eb;
}

.dot {
  height: 4.75px;
  width: 4.75px;
  border-radius: 9999px;
  background-color: #1c1b1f;
}

.separator {
  margin: 5px 0;
  height: 1px;
  background-color: #e0e0e0;
}

.rightSlot {
  margin-left: auto;
  padding-left: 1.25rem;
}

.icon {
  height: 13px;
  width: 13px;
}

.text {
  padding-left: 1.5rem;
  font-size: 0.75rem;
  line-height: 1.5rem;
  color: #6b7280;
}
</style>
