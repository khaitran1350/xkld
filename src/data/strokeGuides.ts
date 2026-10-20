export interface StrokeGuideInfo {
  strokeCount: number;
  steps: string[];
  tips?: string;
}

export const STROKE_GUIDES: Record<string, StrokeGuideInfo> = {
  a: {
    strokeCount: 3,
    steps: [
      '1. Draw a horizontal line from left to right.',
      '2. Draw a vertical stroke down through the center, curving slightly left.',
      '3. Start a continuous loop from upper right, looping down and around to bottom-right.',
    ],
    tips: 'The third stroke should loop smoothly without sharp corners.',
  },
  i: {
    strokeCount: 2,
    steps: [
      '1. Draw the left vertical stroke curving downward, ending with an upward hook (hane).',
      '2. Draw the shorter right stroke curving gently inward to mirror the left.',
    ],
    tips: 'Leave ample open space between the two strokes.',
  },
  u: {
    strokeCount: 2,
    steps: [
      '1. Short diagonal downward tick at top center.',
      '2. Large curved arc curving out to the right and sweeping down like a sideways "C".',
    ],
    tips: 'Stroke 2 should sit nicely balanced below stroke 1.',
  },
  e: {
    strokeCount: 2,
    steps: [
      '1. Short diagonal stroke at top center.',
      '2. Continuous zigzag: down-left, sharp diagonal up-right, down-left, and a flat wave right.',
    ],
    tips: 'Keep the bottom wave flat and stable.',
  },
  o: {
    strokeCount: 3,
    steps: [
      '1. Short horizontal line left to right.',
      '2. Vertical stroke down, looping at bottom-left, crossing across to the right.',
      '3. Small diagonal accent mark placed on upper right.',
    ],
    tips: 'Stroke 2 must loop on the left before sweeping to the right.',
  },
  ka: {
    strokeCount: 3,
    steps: [
      '1. Horizontal stroke turning down into a curved hook.',
      '2. Slanted vertical stroke cutting straight down through the first stroke.',
      '3. Diagonal accent dot placed on upper right.',
    ],
    tips: 'Make sure stroke 1 has a distinct upward hook at the bottom.',
  },
  ki: {
    strokeCount: 4,
    steps: [
      '1. First horizontal bar slanting slightly upward.',
      '2. Second parallel horizontal bar below it.',
      '3. Diagonal stroke cutting down through both bars, ending with a small hook.',
      '4. Separate curved stroke at the bottom (detached in modern handwriting).',
    ],
    tips: 'In modern handwriting, stroke 4 is disconnected from stroke 3.',
  },
  ku: {
    strokeCount: 1,
    steps: [
      '1. Single continuous stroke forming a "<" shape: diagonal down-left, then diagonal down-right.',
    ],
    tips: 'Keep the vertex sharp at roughly a 70-degree angle.',
  },
  ke: {
    strokeCount: 3,
    steps: [
      '1. Left vertical stroke curving gently with an upward hook.',
      '2. Short horizontal bar on the upper right.',
      '3. Right vertical stroke cutting down through the horizontal bar with a gentle curve.',
    ],
    tips: 'The right stroke extends below the horizontal crossbar.',
  },
  ko: {
    strokeCount: 2,
    steps: [
      '1. Top horizontal bar left to right, ending with a tiny inward hook.',
      '2. Bottom curved horizontal stroke mirroring the top bar.',
    ],
    tips: 'Think of them as two parallel arcs cupping empty space.',
  },
  sa: {
    strokeCount: 3,
    steps: [
      '1. Horizontal bar slanting slightly upward.',
      '2. Diagonal stroke down-right through the bar with a leftward hook.',
      '3. Separate curved stroke at the bottom (detached in modern handwriting).',
    ],
    tips: 'Unlike calligraphy fonts, stroke 2 and stroke 3 are separated in modern writing.',
  },
  shi: {
    strokeCount: 1,
    steps: [
      '1. Single vertical stroke going straight down, then sweeping smoothly up-right like a fishhook.',
    ],
    tips: 'Start straight and vertical before curling up.',
  },
  su: {
    strokeCount: 2,
    steps: [
      '1. Long horizontal bar left to right.',
      '2. Vertical stroke down through the middle, making a tight loop, then curving down-left.',
    ],
    tips: 'The loop should sit just below the horizontal bar.',
  },
  se: {
    strokeCount: 3,
    steps: [
      '1. Long horizontal bar left to right.',
      '2. Right vertical stroke going down and hooking to the left.',
      '3. Left vertical stroke curving down and sweeping right along the bottom.',
    ],
    tips: 'Stroke 1 is the widest part of the character.',
  },
  so: {
    strokeCount: 1,
    steps: [
      '1. Single continuous stroke: horizontal right, diagonal down-left, horizontal right, then large open curve.',
    ],
    tips: 'Keep the top zigzag compact and the bottom curve wide.',
  },
  ta: {
    strokeCount: 4,
    steps: [
      '1. Horizontal stroke left to right.',
      '2. Slanted vertical stroke down.',
      '3. Small horizontal line on the right.',
      '4. Lower horizontal line curving gently (like a mini "こ").',
    ],
    tips: 'Looks like the letters "t" and "a" combined.',
  },
  chi: {
    strokeCount: 2,
    steps: [
      '1. Slightly slanted horizontal stroke left to right.',
      '2. Vertical stroke cutting down through the middle, then curving into a wide loop like a numeral "5".',
    ],
    tips: 'Stroke 2 curves wide and rounded.',
  },
  tsu: {
    strokeCount: 1,
    steps: [
      '1. Single smooth arching curve starting upper-left and sweeping down to lower-right like an ocean wave.',
    ],
    tips: 'Start high on the left and descend smoothly.',
  },
  te: {
    strokeCount: 1,
    steps: [
      '1. Single stroke: horizontal bar left to right, then bending into a wide semicircular curve down-left.',
    ],
    tips: 'The curve sweeps underneath the horizontal bar.',
  },
  to: {
    strokeCount: 2,
    steps: [
      '1. Short diagonal stroke slanting down-right.',
      '2. Large curved stroke starting high and curving around to touch the base of stroke 1.',
    ],
    tips: 'Looks like a thorn touching a curve.',
  },
  na: {
    strokeCount: 4,
    steps: [
      '1. Horizontal bar left to right.',
      '2. Slanted diagonal stroke down through the bar.',
      '3. Small accent dot on upper right.',
      '4. Vertical stroke with a tight loop at the bottom.',
    ],
    tips: 'The right side (strokes 3 & 4) sits slightly lower than the cross.',
  },
  ni: {
    strokeCount: 3,
    steps: [
      '1. Left vertical stroke with a slight upward release hook.',
      '2. Top horizontal line on the right.',
      '3. Bottom horizontal line on the right.',
    ],
    tips: 'The two right strokes form the kanji for "two" (二).',
  },
  nu: {
    strokeCount: 2,
    steps: [
      '1. Slanted stroke from top-left to bottom-right.',
      '2. Arc curving over stroke 1, sweeping down and looping, ending with a small knot on the right.',
    ],
    tips: 'Similar to め (me), but has a small knot at the end.',
  },
  ne: {
    strokeCount: 2,
    steps: [
      '1. Straight vertical line on the left.',
      '2. Zigzag stroke crossing the vertical line, looping up and around, ending with a small knot.',
    ],
    tips: 'The knot at the bottom-right matches the knot in ぬ.',
  },
  no: {
    strokeCount: 1,
    steps: [
      '1. Single smooth stroke: start center-right, curve down-left, then sweep up and around in a large circle.',
    ],
    tips: 'Flow in one continuous circular motion.',
  },
  ha: {
    strokeCount: 3,
    steps: [
      '1. Left vertical stroke with an upward hook at bottom.',
      '2. Short horizontal bar on the upper right.',
      '3. Vertical stroke cutting down through the bar and looping at the bottom.',
    ],
    tips: 'The loop on stroke 3 should stay to the right of the vertical stem.',
  },
  hi: {
    strokeCount: 1,
    steps: [
      '1. Horizontal start, dipping down into a deep "U" curve, and rising back up before a short diagonal finish.',
    ],
    tips: 'Resembles a big smiling mouth.',
  },
  fu: {
    strokeCount: 4,
    steps: [
      '1. Small curved dot at top center.',
      '2. Main central body stroke curving down.',
      '3. Left sweeping accent dot.',
      '4. Right sweeping accent dot.',
    ],
    tips: 'Keep the 4 components balanced symmetrically like Mt. Fuji.',
  },
  he: {
    strokeCount: 1,
    steps: [
      '1. Single chevron stroke: short ascent up-right, then a longer gradual slope down-right.',
    ],
    tips: 'The right slope is longer than the left ascent.',
  },
  ho: {
    strokeCount: 4,
    steps: [
      '1. Left vertical stroke with a bottom hook.',
      '2. Top horizontal bar on the right.',
      '3. Second parallel horizontal bar below it.',
      '4. Vertical stroke cutting through (does NOT pierce top bar) and looping at the bottom.',
    ],
    tips: 'Stroke 4 must NOT poke out above the top horizontal bar.',
  },
  ma: {
    strokeCount: 3,
    steps: [
      '1. Top horizontal line.',
      '2. Second parallel horizontal line below it.',
      '3. Vertical stroke cutting down through both bars and ending in a loop.',
    ],
    tips: 'Unlike ほ, stroke 3 pierces all the way through the top bar.',
  },
  mi: {
    strokeCount: 2,
    steps: [
      '1. Horizontal start, slanting down-left, making a loop, and crossing to the right.',
      '2. Slanted vertical curve cutting through the tail of stroke 1.',
    ],
    tips: 'Looks like a stylized number "21".',
  },
  mu: {
    strokeCount: 3,
    steps: [
      '1. Short horizontal line left to right.',
      '2. Vertical stroke down, making a loop, curving up-right.',
      '3. Accent dot placed at the upper right.',
    ],
    tips: 'The hook on stroke 2 curves high before placing the dot.',
  },
  me: {
    strokeCount: 2,
    steps: [
      '1. Slanted diagonal stroke from top-left to bottom-right.',
      '2. Sweeping curve from top-right, crossing stroke 1, looping around to bottom-right.',
    ],
    tips: 'Looks like ぬ (nu) but without the little tail knot.',
  },
  mo: {
    strokeCount: 3,
    steps: [
      '1. Main vertical stroke curving up into a bottom hook.',
      '2. Upper horizontal crossbar.',
      '3. Lower horizontal crossbar.',
    ],
    tips: 'Write the central vertical hook FIRST, then cross with the two bars.',
  },
  ya: {
    strokeCount: 3,
    steps: [
      '1. Main curved stroke with a hook to the left.',
      '2. Small tick mark at upper left.',
      '3. Slanted vertical stroke cutting down on the right.',
    ],
    tips: 'Leave good balance between the three elements.',
  },
  yu: {
    strokeCount: 2,
    steps: [
      '1. Downward stroke curving up into a wide loop.',
      '2. Long vertical stroke cutting down through the middle.',
    ],
    tips: 'Stroke 2 cuts cleanly through the open loop.',
  },
  yo: {
    strokeCount: 2,
    steps: [
      '1. Short horizontal bar left to right.',
      '2. Vertical stroke down, looping left, and finishing with a flat baseline right.',
    ],
    tips: 'Stroke 2 loops cleanly to the left.',
  },
  ra: {
    strokeCount: 2,
    steps: [
      '1. Small horizontal/diagonal tick at top.',
      '2. Large open curved stroke like a rounded numeral "5" underneath.',
    ],
    tips: 'Do not connect stroke 1 and stroke 2.',
  },
  ri: {
    strokeCount: 2,
    steps: [
      '1. Left downward stroke ending with a small hook.',
      '2. Longer right downward stroke curving gently left.',
    ],
    tips: 'The right stroke extends lower than the left stroke.',
  },
  ru: {
    strokeCount: 1,
    steps: [
      '1. Horizontal bar, diagonal down-left, curving around in a big arc, ending with a small tight loop at bottom.',
    ],
    tips: 'Keep the bottom loop tight and closed.',
  },
  re: {
    strokeCount: 2,
    steps: [
      '1. Straight vertical line on the left.',
      '2. Zigzag stroke crossing the line, then flicking out to the right like a gentle wave.',
    ],
    tips: 'The right tail curls outward like a flick.',
  },
  ro: {
    strokeCount: 1,
    steps: [
      '1. Same as る (ru): horizontal bar, diagonal down-left, and a wide open arc, but with NO loop at bottom.',
    ],
    tips: 'Ends cleanly like the numeral 3.',
  },
  wa: {
    strokeCount: 2,
    steps: [
      '1. Straight vertical line on the left.',
      '2. Zigzag stroke crossing the line and curving into a wide open arc (no knot).',
    ],
    tips: 'Compare with ね (has a knot) and れ (flicks out). わ curves open.',
  },
  wo: {
    strokeCount: 3,
    steps: [
      '1. Horizontal bar left to right.',
      '2. Slanted vertical stroke down-left, then curving horizontally right.',
      '3. Open "C" shaped stroke crossing underneath.',
    ],
    tips: 'Used only as the grammatical object particle.',
  },
  n: {
    strokeCount: 1,
    steps: [
      '1. Single continuous cursive stroke: down-left, sharp diagonal up-right, then sweeping down-right with a rounded tail.',
    ],
    tips: 'Resembles a lowercase cursive "n".',
  },
};

export function getStrokeGuide(kanaId: string): StrokeGuideInfo | undefined {
  return STROKE_GUIDES[kanaId];
}
