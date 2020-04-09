export function getRandomElement (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function average (arr) {
	return arr.reduce((a, b) => (a + b)) / arr.length
}