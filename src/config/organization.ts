const location = {
  venue: "Nevada County Fairgrounds",
  streetAddress: "11228 McCourtney Rd",
  city: "Grass Valley",
  state: "CA",
  zip: "95949",
  poBox: "P.O. Box 2258",
  poCity: "Nevada City",
  poState: "CA",
  poZip: "95959",
};

const mapsDestination = `${location.venue}, ${location.streetAddress}, ${location.city}, ${location.state} ${location.zip}`;

export const organization = {
  name: "N.C.N.G. Historical Model Railroad",
  fullName: "Nevada County Narrow Gauge Historical Model Railroad",
  abbreviation: "N.C.N.G.",
  tagline: "Where California's Railroad Heritage Comes Alive",
  description: "An On3 scale historical model railroad display at the Nevada County Fairgrounds, preserving the memory of the Nevada County Narrow Gauge Railroad.",
  founded: 1986,
  // IRS EO BMF identity. Evidence and legal-name spelling notes are
  // recorded in docs/participation-paths.md; irsName is not a legal-name claim.
  nonprofit: {
    irsName: "Nevada County Narrow Gauge Project",
    ein: "68-0327319",
    classification: "501(c)(3)",
    schemaStatus: "https://schema.org/Nonprofit501c3",
    deductibilityStatement: "Contributions are tax-deductible to the extent permitted by law.",
    sourceUrl: "https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf",
    sourcePublishedOn: "2026-09-08",
  },
  donations: {
    path: "/donate",
    method: "email-inquiry",
    instructions: "Email us for current donation instructions. Online checkout is not available.",
    emailSubject: "Financial contribution inquiry",
    emailBody: "I'd like to support the layout. Please send the current donation instructions.",
  },
  visiting: {
    publicAccess: `We open during selected events at the ${location.venue}, only when an opening is announced on this website.`,
    eventTiming: "Fairgrounds event dates and hours are not necessarily our opening dates and hours. Check the announcement before visiting.",
  },
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
    ...location,
    mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsDestination)}`,
    mapsEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(mapsDestination)}&z=15&output=embed`,
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

export const donationEmailHref =
  `mailto:${organization.contact.email}?subject=${encodeURIComponent(organization.donations.emailSubject)}&body=${encodeURIComponent(organization.donations.emailBody)}`;
