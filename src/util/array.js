export function getRandomElement (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffle (arr) {
  let array = [...arr]

	let currentIndex = array.length
	let temporaryValue, randomIndex

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex -= 1
		temporaryValue = array[currentIndex]
		array[currentIndex] = array[randomIndex]
		array[randomIndex] = temporaryValue
	}

	return array
}