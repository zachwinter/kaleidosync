export default {
  segment: s => s.activeIntervals.segments,
  tatum: s => s.activeIntervals.tatums,
  beat: s => s.activeIntervals.beats,
  bar: s => s.activeIntervals.bars,
  section: s => s.activeIntervals.sections,
  beatInterval: s => s.activeIntervals[s.beatInterval]
}