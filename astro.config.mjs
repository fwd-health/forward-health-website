// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.fwdhealth.com.au',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      // Draft pages — exclude from sitemap until Joe approves
      // (pages still build & are reachable directly, just hidden from search engines)
      filter: (page) =>
        !page.includes("/dry-needling") &&
        !page.includes("/sports-injury-physio") &&
        !page.includes("/post-surgical-rehab"),
    }),
  ],
});
