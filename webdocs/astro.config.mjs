// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://x64.halb.it',
	integrations: [
		starlight({
			title: 'x86-64 playground',
      tableOfContents: false,
      disable404Route: true,
			social: {
				github: 'https://github.com/robalb/x86-64-playground',
			},
      logo: {
        light: './src/assets/light-logo.svg',
        dark: './src/assets/dark-logo.svg',
        replacesTitle: true,
      },
      customCss: [
        // Relative path to your custom CSS file
        './src/styles/starlight.css',
      ],
			sidebar: [
        {
          label: 'Getting started',
          link: '/getting-started'
        },
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
      head: [
        {
          tag: 'script',
          content: `window.addEventListener('load', () => document.querySelector('.site-title').href += 'getting-started/')`,
        },
      ],
		}),
	],
});
