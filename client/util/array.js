/**
 * @function randomElement – Retrieve random element from array.
 */
export function randomElement (arr) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}