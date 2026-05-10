import { defineField, defineType } from "sanity";

export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Clinic name (e.g. 'Currimundi')",
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
      name: "region",
      title: "Region (e.g. 'Sunshine Coast')",
      type: "string",
    }),
    defineField({
      name: "addressLine1",
      title: "Address line 1",
      type: "string",
    }),
    defineField({
      name: "addressLine2",
      title: "Suburb, state and postcode",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      initialValue: "0420 522 558",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      initialValue: "hello@fwdhealth.com.au",
    }),
    defineField({
      name: "googleMapsEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
    }),
    defineField({
      name: "googleBusinessProfileUrl",
      title: "Google Business Profile URL",
      type: "url",
    }),
    defineField({
      name: "blurb",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "exteriorPhoto",
      title: "Clinic exterior",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "additionalPhotos",
      title: "Additional photos (interior, treatment rooms, studio)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "parking",
      title: "Parking note",
      type: "string",
    }),
    defineField({
      name: "accessNote",
      title: "Accessibility / access note",
      type: "string",
    }),
  ],
});
