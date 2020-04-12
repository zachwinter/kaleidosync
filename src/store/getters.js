export default {
  segment: ({ spotify }) => spotify.activeIntervals.segments,
  tatum: ({ spotify }) => spotify.activeIntervals.tatums,
  beat: ({ spotify }) => spotify.activeIntervals.beats,
  bar: ({ spotify }) => spotify.activeIntervals.bars,
  section: ({ spotify }) => spotify.activeIntervals.sections,
  beatInterval: ({ spotify }) => spotify.activeIntervals[spotify.beatInterval]
}