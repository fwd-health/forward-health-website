import { defineField, defineType } from "sanity";

export default defineType({
  name: "condition",
  title: "Condition",
  type: "document",
  description:
    "Specific patient-facing condition pages (e.g. BPPV, runner's knee, prolapse). Cross-linked to services and practitioners for SEO/E-E-A-T.",
  fields: [
    defineField({
      name: "name",
      title: "Condition name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "name", maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO meta description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "symptoms",
      title: "Common symptoms",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "howWeTreat",
      title: "How we treat it",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "primaryService",
      title: "Primary service",
      type: "reference",
      to: { type: "service" },
    }),
    defineField({
      name: "primaryPractitioners",
      title: "Practitioners with this condition as a niche",
      type: "array",
      of: [{ type: "reference", to: { type: "practitioner" } }],
    }),
    defineField({
      name: "relatedConditions",
      title: "Related conditions",
      type: "array",
      of: [{ type: "reference", to: { type: "condition" } }],
    }),
  ],
});
