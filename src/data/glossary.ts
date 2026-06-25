export const glossaryCategories = [
  'Scale & Gauge',
  'Trains & Equipment',
  'Building & Detailing',
  'Track & Operating',
] as const;

export type GlossaryCategory = (typeof glossaryCategories)[number];

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: GlossaryCategory;
}

export const glossary: GlossaryTerm[] = [
  // Scale & Gauge
  {
    term: 'Scale',
    definition:
      'How much smaller a model is than the real thing. Our layout is O scale, or 1:48, so one foot on the model stands in for 48 real feet.',
    category: 'Scale & Gauge',
  },
  {
    term: 'Gauge',
    definition:
      'The distance between the two running rails. It comes from the real railroad being modeled and is separate from scale.',
    category: 'Scale & Gauge',
  },
  {
    term: 'Narrow gauge',
    definition:
      'Track laid closer together than the standard width. The Nevada County Narrow Gauge used rails 3 feet apart, which was cheaper to build and could bend around tight curves in the Sierra foothills.',
    category: 'Scale & Gauge',
  },
  {
    term: 'Standard gauge',
    definition:
      'The most common track width in North America, 4 feet 8.5 inches between the rails.',
    category: 'Scale & Gauge',
  },
  {
    term: 'On3',
    definition:
      'Our scale. The "O" is O scale (1:48), and "n3" means narrow gauge at 3 scale feet. So On3 is an O-scale model of a 3-foot narrow gauge railroad like the N.C.N.G.',
    category: 'Scale & Gauge',
  },
  {
    term: 'O scale',
    definition:
      'A model scale of 1:48. Larger and heavier than the popular HO and N scales, with room for fine detail.',
    category: 'Scale & Gauge',
  },
  {
    term: 'HO scale and N scale',
    definition:
      'Two of the most common starter scales. HO is 1:87 and N is 1:160, both smaller than the O scale we use, so a whole railroad fits in less space.',
    category: 'Scale & Gauge',
  },

  // Trains & Equipment
  {
    term: 'Locomotive',
    definition:
      'The powered engine that pulls or pushes a train. It may be steam, diesel, or, on small narrow gauge lines, a gas engine.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Motive power',
    definition: 'A railroad term for its locomotives taken as a group.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Rolling stock',
    definition:
      'The cars that get pulled along the line: boxcars, flatcars, gondolas, passenger coaches, and the caboose.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Prototype',
    definition:
      'The real-life railroad, locomotive, or scene that a model is based on. The Nevada County Narrow Gauge is our prototype.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Roster',
    definition:
      'The list of locomotives a railroad owned. You can see our engine roster on the Trains page.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Wheel arrangement (Whyte notation)',
    definition:
      'A shorthand for a steam locomotive\u2019s wheels, such as 2-6-0: the leading wheels, the large driving wheels, then the trailing wheels.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Geared locomotive (Shay, Heisler, Climax)',
    definition:
      'A slow, powerful steam engine geared for steep, rough mining and logging track. Engines like the Heisler and Climax worked in the Nevada County area.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Caboose',
    definition: 'The crew car at the tail end of a freight train.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Truck',
    definition:
      'The swiveling frame that holds a set of wheels under each end of a car or locomotive.',
    category: 'Trains & Equipment',
  },
  {
    term: 'Coupler',
    definition: 'The mechanism that links one car to the next.',
    category: 'Trains & Equipment',
  },

  // Building & Detailing
  {
    term: 'Layout',
    definition:
      'The model railroad itself: the benchwork, track, scenery, and structures where the trains run.',
    category: 'Building & Detailing',
  },
  {
    term: 'Benchwork',
    definition: 'The wood or metal framework that holds up a layout.',
    category: 'Building & Detailing',
  },
  {
    term: 'Scratchbuilding',
    definition:
      'Building a model from raw materials such as wood, brass, or styrene instead of from a kit.',
    category: 'Building & Detailing',
  },
  {
    term: 'Kitbashing',
    definition:
      'Combining or modifying kits to make something new or more accurate to the prototype.',
    category: 'Building & Detailing',
  },
  {
    term: 'Weathering',
    definition:
      'Adding paint, chalk, and washes so a clean model looks realistically used, with rust, soot, dust, and fading.',
    category: 'Building & Detailing',
  },

  // Track & Operating
  {
    term: 'DCC (Digital Command Control)',
    definition:
      'A control system that sends digital signals through the rails so each locomotive can be driven on its own, with working lights and sound, even when several share the same track. Our layout runs on DCC.',
    category: 'Track & Operating',
  },
  {
    term: 'Turnout (switch)',
    definition:
      'The movable section of track that lets a train change from one route to another.',
    category: 'Track & Operating',
  },
  {
    term: 'Ballast',
    definition:
      'The crushed rock packed around and between the ties to hold the track in place and help it drain.',
    category: 'Track & Operating',
  },
  {
    term: 'Grade',
    definition: 'How steeply the track climbs or descends, given as a percent.',
    category: 'Track & Operating',
  },
  {
    term: 'Staging',
    definition:
      'Hidden tracks at the edge of a layout that stand in for the rest of the world, where trains wait their turn to come on stage.',
    category: 'Track & Operating',
  },
  {
    term: 'Consist',
    definition:
      'The makeup of a train: the particular locomotives and cars coupled together for a run.',
    category: 'Track & Operating',
  },
];
