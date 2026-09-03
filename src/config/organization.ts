export const organization = {
  name: "N.C.N.G. Historical Model Railroad",
  fullName: "Nevada County Narrow Gauge Historical Model Railroad",
  abbreviation: "N.C.N.G.",
  tagline: "Where California's Railroad Heritage Comes Alive",
  description: "An On3 scale historical model railroad display at the Nevada County Fairgrounds, preserving the memory of the Nevada County Narrow Gauge Railroad.",
  founded: 1986,
  nonprofit: "",
  // The prototype railroad the layout models. Stated once so the operating era
  // cannot drift between pages: the site previously published both 1875-1942
  // and 1876-1942. Construction broke ground near Colfax on February 11, 1875,
  // but no revenue service ran that year. The first train reached Grass Valley
  // on April 11, 1876 and the last spike was driven at Nevada City on May 20,
  // 1876. The last train ran in 1942. Sources: contemporary Daily Alta
  // California and Grass Valley Union reports and the PacificNG reference data
  // at https://pacificng.com/template.php?page=roads/ca/ncng/index.htm
  prototype: {
    serviceStart: 1876,
    serviceEnd: 1942,
    era: "1876–1942",
    routeMiles: "22",
  },
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
  // Public profiles. Every entry is emitted as schema.org `sameAs`, so add only
  // official accounts the organization controls.
  social: {
    facebook: "https://www.facebook.com/NCNGHistoricalModelRailroad",
  },
  analytics: {
    // Cloudflare Web Analytics beacon token (cookie-free, no consent banner)
    // Get yours at: https://dash.cloudflare.com → Web Analytics → Add site
    cfBeaconToken: "8e6f7569c50c4856a2a8800970d962d6",
  },
};
