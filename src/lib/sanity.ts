// Sanity client wiring, placeholder, ready for activation after `sanity init`.
//
// To activate:
// 1. Run `sanity init` inside ../sanity-studio (creates a Sanity project, gives projectId)
// 2. Set PUBLIC_SANITY_PROJECT_ID + PUBLIC_SANITY_DATASET in .env (and Vercel/Netlify env)
// 3. Run `npm install @sanity/client @sanity/image-url`
// 4. Uncomment the body below
//
// Until then, the site reads content from src/data/*.ts and inline page content.

/*
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { ClientConfig } from "@sanity/client";

const config: ClientConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true, // false if you want fresh content during preview
};

export const sanityClient = createClient(config);

const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: any) {
  return builder.image(source);
}

// Example query helper:
// export async function getServices() {
//   return sanityClient.fetch(`*[_type == "service"] | order(displayOrder asc) {
//     _id, title, slug, shortBlurb, intro, eyebrow, "heroImage": heroImage.asset->url,
//     conditions, whatToExpect,
//     "practitioners": practitioners[]->{name, slug, role, "headshot": headshot.asset->url},
//     "locations": locations[]->{name, slug}
//   }`);
// }
*/

export {};
