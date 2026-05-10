import { defineField, defineType } from "sanity";

export default defineType({
  name: "partner",
  title: "Partner / referral practice",
  type: "document",
  description: "External clinics and practices we refer to and are referred from.",
  fields: [
    defineField({
      name: "name",
      title: "Practice name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "GP", value: "gp" },
          { title: "Podiatry", value: "podiatry" },
          { title: "Massage / wellness", value: "wellness" },
          { title: "Acupuncture", value: "acupuncture" },
          { title: "Other allied health", value: "other" },
        ],
      },
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "blurb",
      title: "Short description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "isOnsite",
      title: "Located on-site at one of our clinics?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "onsiteLocation",
      title: "Which clinic (if on-site)",
      type: "reference",
      to: { type: "location" },
      hidden: ({ document }) => !document?.isOnsite,
    }),
  ],
});
