import { defineField, defineType } from "sanity";

export default defineType({
  name: "practitioner",
  title: "Practitioner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name (as displayed)",
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
      name: "role",
      title: "Role / title (e.g. 'Physiotherapist', 'Remedial Massage Therapist')",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Physiotherapist", value: "physio" },
          { title: "Massage / Myotherapist", value: "massage" },
          { title: "Care team", value: "care-team" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locations",
      title: "Works at",
      type: "array",
      of: [{ type: "reference", to: { type: "location" } }],
    }),
    defineField({
      name: "shortBlurb",
      title: "Short blurb (card preview)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "fullBio",
      title: "Full bio (lightbox)",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "specialties",
      title: "Clinical interests / specialties",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "headshot",
      title: "Professional headshot",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "personalPhotos",
      title: "Personal / lifestyle photos (lightbox gallery)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "isOnLeave",
      title: "Currently on leave?",
      type: "boolean",
      description: "Tick this if the practitioner is on parental leave, study leave, etc.",
      initialValue: false,
    }),
    defineField({
      name: "leaveNote",
      title: "Leave note (e.g. 'Currently on maternity leave')",
      type: "string",
      hidden: ({ document }) => !document?.isOnLeave,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order within category",
      type: "number",
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
