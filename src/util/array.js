/**
 * @function randomElement – Retrieve random element from array.
 */
export function randomElement (arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}