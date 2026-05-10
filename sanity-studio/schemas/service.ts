import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortBlurb",
      title: "Short blurb (homepage card)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph (service page hero)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow (small label above hero title)",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "SEO meta description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "conditions",
      title: "Conditions we treat (grouped lists)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "heading", title: "Group heading", type: "string" },
            {
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
      ],
    }),
    defineField({
      name: "whatToExpect",
      title: "What to expect (numbered steps)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Step title", type: "string" },
            { name: "body", title: "Step body", type: "text" },
          ],
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "practitioners",
      title: "Practitioners who deliver this service",
      type: "array",
      of: [{ type: "reference", to: { type: "practitioner" } }],
    }),
    defineField({
      name: "locations",
      title: "Available at",
      type: "array",
      of: [{ type: "reference", to: { type: "location" } }],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "reference", to: { type: "faq" } }],
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      of: [{ type: "reference", to: { type: "service" } }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "displayOrder",
      title: "Homepage display order",
      type: "number",
      description:
        "Lower numbers appear first. Joe's confirmed order: 1=Physio, 2=Pelvic floor, 3=Massage, 4=Running, 5=Vertigo, 6=Paeds, 7=Pilates, 8=Home visits.",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
});
