// Single source for the repo identity. Deriving the URLs below from one slug
// keeps them from diverging if the repo is ever renamed or moved again.
const repoSlug = "ncngmodelrailroad/ncngmodelrailroad.org";

export const organization = {
  name: "N.C.N.G. Historical Model Railroad",
  fullName: "Nevada County Narrow Gauge Historical Model Railroad",
  abbreviation: "N.C.N.G.",
  tagline: "Where California's Railroad Heritage Comes Alive",
  description: "An On3 scale historical model railroad display at the Nevada County Fairgrounds, preserving the memory of the Nevada County Narrow Gauge Railroad.",
  founded: 1986,
  nonprofit: "",
  location: {
    venue: "Nevada County Fairgrounds",
    streetAddress: "11228 McCourtney Rd",
    city: "Grass Valley",
    state: "CA",
    zip: "95949",
    poBox: "P.O. Box 2258",
    poCity: "Nevada City",
    poState: "CA",
    poZip: "95959",
    geo: {
      latitude: 39.2191,
      longitude: -121.0601,
    },
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Nevada+County+Fairgrounds,+11228+McCourtney+Rd,+Grass+Valley,+CA+95949",
  },
  contact: {
    phone: "(916) 871-6341",
    phoneHref: "tel:+19168716341",
    email: "ncngrr@hotmail.com",
  },
  repo: {
    url: `https://github.com/${repoSlug}`,
    // Pages CMS resolves the repo from this path, so it tracks the repo slug.
    cmsUrl: `https://app.pagescms.org/${repoSlug}`,
  },
  analytics: {
    // Cloudflare Web Analytics beacon token (cookie-free, no consent banner)
    // Get yours at: https://dash.cloudflare.com → Web Analytics → Add site
    cfBeaconToken: "8e6f7569c50c4856a2a8800970d962d6",
  },
};
