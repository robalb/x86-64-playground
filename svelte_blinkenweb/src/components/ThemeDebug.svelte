<script>
  // List of theme color variables to visualize
  const themeColors = [
    { name: '--color-white', label: 'White' },
    { name: '--color-black', label: 'Black' },
    { name: '--color-gray-0', label: 'Gray 0' },
    { name: '--color-gray-50', label: 'Gray 50' },
    { name: '--color-gray-100', label: 'Gray 100' },
    { name: '--color-gray-200', label: 'Gray 200' },
    { name: '--color-gray-300', label: 'Gray 300' },
    { name: '--color-gray-400', label: 'Gray 400' },
    { name: '--color-gray-500', label: 'Gray 500' },
    { name: '--color-gray-600', label: 'Gray 600' },
    { name: '--color-gray-900', label: 'Gray 900' },
    { name: '--color-gray-t', label: 'Gray Test' },
    { name: '--color-gold-50', label: 'Gold 50' },
    { name: '--color-gold-100', label: 'Gold 100' },
    { name: '--color-yellow', label: 'Yellow' },
    { name: '--color-green', label: 'Green' },
    { name: '--color-blue', label: 'Blue' },
    { name: '--color-orange', label: 'Orange' },
    { name: '--color-violet-100', label: 'Violet 100' },
    { name: '--color-plum-100', label: 'Plum 100' }
  ];
</script>

<style>
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
  .color-item {
    padding: 16px;
    border-radius: 8px;
    color: #fff;
    text-align: center;
    font-size: 14px;
  }
  .color-name {
    font-weight: bold;
  }
  .color-value {
    font-size: 12px;
    margin-top: 4px;
  }
</style>

<div class="color-grid">
  {#each themeColors as color}
    <div class="color-item" style="background-color: var({color.name})">
      <div class="color-name">{color.label}</div>
      <div class="color-value">{color.name}</div>
      <div class="color-value">var({color.name})</div>
    </div>
  {/each}
</div>

