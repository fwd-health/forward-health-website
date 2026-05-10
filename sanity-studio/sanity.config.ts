import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "forward-health",
  title: "Forward Health",

  // TODO: replace these once `sanity init` creates the project
  projectId: "REPLACE_AFTER_SANITY_INIT",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Forward Health")
          .items([
            S.listItem()
              .title("Services")
              .child(S.documentTypeList("service").title("Services")),
            S.listItem()
              .title("Practitioners")
              .child(S.documentTypeList("practitioner").title("Practitioners")),
            S.listItem()
              .title("Locations")
              .child(S.documentTypeList("location").title("Locations")),
            S.listItem()
              .title("Conditions")
              .child(S.documentTypeList("condition").title("Conditions")),
            S.divider(),
            S.listItem()
              .title("Partners")
              .child(S.documentTypeList("partner").title("Partners")),
            S.listItem()
              .title("FAQs")
              .child(S.documentTypeList("faq").title("FAQs")),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
