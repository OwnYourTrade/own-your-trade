// Backwards-compatible `site` object, now sourced entirely from the brand config.
// Prefer importing from "@/config/demos/takeaway" directly in new code.

import {
  identity,
  contact,
  hours,
  delivery,
  ratings,
} from "@/config/demos/takeaway";

export const site = {
  name: identity.name,
  fullName: identity.legalName,
  tagline: identity.tagline,
  address: {
    line1: contact.line1,
    city: contact.city,
    postcode: contact.postcode,
  },
  phone: contact.phone,
  phoneHref: contact.phoneHref,
  email: contact.email,
  hours,
  rating: ratings.rating,
  reviewCount: ratings.count,
  delivery,
  googleMapsUrl: contact.googleMapsUrl,
  mapsEmbed: contact.mapsEmbed,
};

export type OrderType = "collection" | "delivery";
