<script lang="ts">
  import './styles/style.css';
  import ArrowBack from './components/icons/ArrowBack.svelte';
  import Logo from './components/Logo.svelte';
</script>

<header>
    <div class="header__logobox">
        <a class="logo logo--vis_hidden_on_small" href="https://x64.halb.it" aria-label="homepage">
            <Logo/>
        </a>
        <h1>Design system reference</h1>
    </div>
    <nav>
        <a href="https://x64.halb.it" target="_blank">About</a>
        <a href="https://github.com/robalb/x86-64-playground" target="_blank">Github</a>
    </nav>
</header>

  <main class="docs__content">
    <nav class="docs__nav">
      <h2>Components</h2>
      <ul>
        <li><a href="#buttons">Buttons</a></li>
        <li><a href="#icons">Icons</a></li>
        <li><a href="#panels">Panels</a></li>
        <li><a href="#forms">Forms</a></li>
        <li><a href="#colors">Colors</a></li>
        <li><a href="#typography">Typography</a></li>
      </ul>
    </nav>

    <div class="docs__sections">

      <section id="introduction" class="docs__section">
        <h2><a href="#introduction">Introduction</a></h2>
        <p>
                This is a quick reference for developers that want to 
                contribute to the interface of the <a href="https://x64.halb.it">x86-64 playground</a>.
                The guide on how to get started with the development is available on <a href="https://github.com/robalb/x86-64-playground/">Github</a>
        </p>
        <p>
                All the interface components are listed here.
                Lorem ipsum dolom sit amlet
                Lorem ipsum dolom sit amlet
                Lorem ipsum dolom sit amlet
                Lorem ipsum dolom sit amlet
                Lorem ipsum dolom sit amlet
            </p>
      </section>
      <!-- Buttons Section -->
      <section id="buttons" class="docs__section">
        <h2><a href="#buttons">Buttons</a></h2>
        <p>Buttons Are used for actions that do not trigger a page navigation. </p>

        <div class="docs__example">
          <h3>Default Button</h3>
          <div class="docs__preview">
            <button class="button">Default Button</button>
          </div>
          <pre class="docs__code">&lt;button class="button"&gt;Default Button&lt;/button&gt;</pre>
        </div>

        <div class="docs__example">
          <h3>Button Group</h3>
          <div class="docs__preview">
            <div class="btgroup">
              <button class="button">First</button>
              <button class="button">Second</button>
              <button class="button">Third</button>
            </div>
          </div>
          <pre class="docs__code">&lt;div class="btgroup"&gt;
  &lt;button class="button"&gt;First&lt;/button&gt;
  &lt;button class="button"&gt;Second&lt;/button&gt;
  &lt;button class="button"&gt;Third&lt;/button&gt;
&lt;/div&gt;</pre>
        </div>
      </section>

      <!-- Icons Section -->
      <section id="icons" class="docs__section">
        <h2>Icons</h2>
        <p>SVG icon components with customizable size and color.</p>

        <div class="docs__example">
          <h3>Available Icons</h3>
          <div class="docs__preview docs__preview--icons">
            <div class="docs__icon-item">
              <ArrowBack width="24px" height="24px" />
              <span>ArrowBack</span>
            </div>
          </div>
          <pre class="docs__code">&lt;script&gt;
  import ArrowBack from './components/icons/ArrowBack.svelte';
&lt;/script&gt;

&lt;ArrowBack width="24px" height="24px" /&gt;</pre>
        </div>

        <div class="docs__example">
          <h3>Icon Props</h3>
          <table class="docs__table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>width</code></td>
                <td>string</td>
                <td>"16px"</td>
                <td>Icon width</td>
              </tr>
              <tr>
                <td><code>height</code></td>
                <td>string</td>
                <td>"16px"</td>
                <td>Icon height</td>
              </tr>
              <tr>
                <td><code>style</code></td>
                <td>string</td>
                <td>""</td>
                <td>Custom CSS styles (e.g., fill color)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Panels Section -->
      <section id="panels" class="docs__section">
        <h2>Panels</h2>
        <p>Resizable panel system using PaneForge.</p>

        <div class="docs__example">
          <h3>Panel Classes</h3>
          <table class="docs__table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>.pf__pane_group</code></td>
                <td>Container for panel groups</td>
              </tr>
              <tr>
                <td><code>.pf__pane</code></td>
                <td>Individual panel</td>
              </tr>
              <tr>
                <td><code>.pf__resize_handle</code></td>
                <td>Draggable resize handle between panels</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Forms Section -->
      <section id="forms" class="docs__section">
        <h2>Forms</h2>
        <p>Form elements and input styles.</p>

        <div class="docs__example">
          <h3>Select Dropdown</h3>
          <div class="docs__preview">
            <select class="button">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <pre class="docs__code">&lt;select class="button"&gt;
  &lt;option&gt;Option 1&lt;/option&gt;
  &lt;option&gt;Option 2&lt;/option&gt;
&lt;/select&gt;</pre>
        </div>
      </section>

      <!-- Colors Section -->
      <section id="colors" class="docs__section">
        <h2>Colors</h2>
        <p>Color palette CSS variables.</p>

        <div class="docs__example">
          <h3>Gray Scale</h3>
          <div class="docs__preview docs__preview--colors">
            <div class="docs__color" style="background: var(--color-gray-0)"><span>gray-0</span></div>
            <div class="docs__color" style="background: var(--color-gray-100)"><span>gray-100</span></div>
            <div class="docs__color" style="background: var(--color-gray-200)"><span>gray-200</span></div>
            <div class="docs__color" style="background: var(--color-gray-300)"><span>gray-300</span></div>
            <div class="docs__color" style="background: var(--color-gray-400)"><span>gray-400</span></div>
            <div class="docs__color" style="background: var(--color-gray-500); color: white;"><span>gray-500</span></div>
            <div class="docs__color" style="background: var(--color-gray-600); color: white;"><span>gray-600</span></div>
            <div class="docs__color" style="background: var(--color-gray-700); color: white;"><span>gray-700</span></div>
            <div class="docs__color" style="background: var(--color-gray-800); color: white;"><span>gray-800</span></div>
            <div class="docs__color" style="background: var(--color-gray-900); color: white;"><span>gray-900</span></div>
          </div>
        </div>

        <div class="docs__example">
          <h3>Accent Colors</h3>
          <div class="docs__preview docs__preview--colors">
            <div class="docs__color" style="background: var(--color-gold-100)"><span>gold-100</span></div>
            <div class="docs__color" style="background: var(--color-yellow-100)"><span>yellow-100</span></div>
            <div class="docs__color" style="background: var(--color-green-100)"><span>green-100</span></div>
            <div class="docs__color" style="background: var(--color-blue-100)"><span>blue-100</span></div>
            <div class="docs__color" style="background: var(--color-orange-100)"><span>orange-100</span></div>
            <div class="docs__color" style="background: var(--color-violet-100); color: white;"><span>violet-100</span></div>
            <div class="docs__color" style="background: var(--color-plum-100)"><span>plum-100</span></div>
          </div>
        </div>

        <div class="docs__example">
          <h3>Theme Variables</h3>
          <table class="docs__table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--theme-bg</code></td>
                <td>Main background color</td>
              </tr>
              <tr>
                <td><code>--theme-panel-bg</code></td>
                <td>Panel background color</td>
              </tr>
              <tr>
                <td><code>--theme-text-fg</code></td>
                <td>Primary text color</td>
              </tr>
              <tr>
                <td><code>--theme-primary</code></td>
                <td>Primary accent color</td>
              </tr>
              <tr>
                <td><code>--theme-focus</code></td>
                <td>Focus ring color</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Typography Section -->
      <section id="typography" class="docs__section">
        <h2>Typography</h2>
        <p>Font families and text styles.</p>

        <div class="docs__example">
          <h3>Font Families</h3>
          <div class="docs__preview docs__preview--typography">
            <p style="font-family: var(--font-ui);">Inter - UI Font (var(--font-ui))</p>
            <p style="font-family: var(--font-mono);">Roboto Mono - Code Font (var(--font-mono))</p>
          </div>
        </div>

        <div class="docs__example">
          <h3>Font Weights</h3>
          <div class="docs__preview docs__preview--typography">
            <p style="font-weight: 400;">Regular (400)</p>
            <p style="font-weight: 600;">Semi-bold (600)</p>
          </div>
        </div>
      </section>
    </div>
  </main>

<style>

  :root {
    --ds-nav-pad-x: 1.5rem;
    --ds-nav-pad-y: .75rem;
  }

  header {
      line-height: normal !important;
      width: 100%;
      height: 4rem;
      border-bottom: 1px solid var(--color-gray-600);
      padding: var(--ds-nav-pad-y) var(--ds-nav-pad-x);
      display: flex;
      align-items: center;
      justify-content: space-between;
  }

  header .header__logobox{
      width: 100%;
      height: 4rem;
      display: flex;
      align-items: center;
  }

  header h1 {
      font-size: 1.2rem;
      font-weight: 300;
  }

  header .logo{
    height: 2.4rem;
    flex-shrink:0;
    margin-right: 1.2rem;
  }
  @media (max-width: 500px) {
      header .logo--vis_hidden_on_small{
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
      }
  }


  header nav{
    color: white;
    margin: 0 .5rem;
    flex-shrink:0;
  }
  header nav a {
    color: var(--color-gray-100);
      text-decoration: underline;
      text-decoration-color: var(--color-gray-200);
    padding: .5rem;
    border-radius: 8px;
  }
  header nav a:hover{
    color: var(--color-gray-0);
    background-color: var(--color-gray-300);
  }


  .docs__content {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem var(--ds-nav-pad-x);
    gap: 2rem;
  }

  .docs__nav {
    position: sticky;
    top: 2rem;
    flex-shrink: 0;
    width: 200px;
    height: fit-content;
  }

  .docs__nav h2 {
    margin: 0 0 1.5rem;
    font-size: 1.4rem;
    font-weight: 300;
    color: var(--color-gray-100);
  }

  .docs__nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .docs__nav li {
    margin: 0;
    padding: 0;
  }

  .docs__nav a {
    display: block;
    padding: 0.2rem 1rem 0.5rem 1rem;
    color: var(--theme-text-fg);
      text-decoration: underline;
      text-decoration-color: var(--color-gray-200);
    border-radius: 8px;
  }

  .docs__nav a:hover {
    background: var(--color-gray-500);
  }

  .docs__sections {
    flex: 1;
    min-width: 0;
  }

  .docs__section {
    margin-bottom: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--color-gray-700);
  }

  .docs__section:last-child {
    border-bottom: none;
  }

  .docs__section h2 {
    margin: 0 0 0.5rem;
    font-size: 1.4rem;
    font-weight: 300;
    border-bottom: 1px solid var(--color-gray-200);
    margin-bottom: 2rem;
  }
  .docs__section h2 a{
    color: var(--theme-text-fg);
    text-decoration: none;
  }

  .docs__section > p {
      line-height: normal;
    margin: 0 0 1.5rem;
  }
  .docs__section > p a {
      color: var(--color-gold-100);
  }

  .docs__example {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--theme-panel-bg);
    border-radius: 8px;
  }

  .docs__example h3 {
    margin: 0 0 1rem;
    font-size: 1rem;
    color: var(--color-gray-300);
  }

  .docs__preview {
    padding: 1.5rem;
    background: var(--color-gray-800);
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .docs__preview--icons {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .docs__icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-gray-400);
  }

  .docs__preview--colors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem;
  }

  .docs__color {
    width: 100px;
    height: 60px;
    border-radius: 4px;
    display: flex;
    align-items: flex-end;
    padding: 0.5rem;
    font-size: 0.625rem;
    font-family: var(--font-mono);
  }

  .docs__preview--typography p {
    margin: 0.5rem 0;
  }

  .docs__code {
    margin: 0;
    padding: 1rem;
    background: var(--color-gray-900);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    overflow-x: auto;
    white-space: pre;
  }

  .docs__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .docs__table th,
  .docs__table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-gray-700);
  }

  .docs__table th {
    font-weight: 600;
    color: var(--color-gray-300);
  }

  .docs__table code {
    padding: 0.125rem 0.375rem;
    background: var(--color-gray-800);
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
  }

  @media (max-width: 768px) {
    .docs__content {
      flex-direction: column;
    }

    .docs__nav {
      position: static;
      width: 100%;
    }

    .docs__nav ul {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .docs__color {
      width: 80px;
      height: 50px;
    }
  }
</style>
