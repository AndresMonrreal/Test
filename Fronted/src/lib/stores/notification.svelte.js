let current = $state(null)
let timer
 
export const notification = {
  get current() { return current },
 
  show(type, message) {
    clearTimeout(timer)
    current = { type, message }
    timer = setTimeout(() => { current = null }, 4000)
  },
 
  clear() {
    clearTimeout(timer)
    current = null
  },
}
