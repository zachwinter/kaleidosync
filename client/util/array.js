/**
 * @function getRandomElement – Retrieve random element from array.
 */
export function getRandomElement (arr) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}