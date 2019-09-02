export function randomNumber(min, max, round = false) {
  const num = (Math.random() * max) + min
  if (round === true) return Math.round(num)
  return num
}