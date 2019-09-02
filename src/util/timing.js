export function pause (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}