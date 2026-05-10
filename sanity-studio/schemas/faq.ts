import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  description: "Reusable Q&A blocks. Reference these from service pages, conditions, locations.",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "topics",
      title: "Topics (for filtering)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Health funds & claiming", value: "health-funds" },
          { title: "NDIS", value: "ndis" },
          { title: "DVA / Workcover", value: "dva-workcover" },
          { title: "Pelvic floor", value: "pelvic-floor" },
          { title: "Paediatrics", value: "paeds" },
          { title: "Vertigo / vestibular", value: "vertigo" },
          { title: "Massage", value: "massage" },
          { title: "Pilates", value: "pilates" },
          { title: "Running", value: "running" },
          { title: "Home visits", value: "home-visits" },
          { title: "General", value: "general" },
        ],
      },
    }),
  ],
});
