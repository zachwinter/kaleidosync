import axios from 'axios'

export async function fetchSketches () {
  try {
    const { data } = await axios.get(`${PROJECT_ROOT}/api/sketches/all-published`) // eslint-disable-line
    return data
  } catch (e) {
    console.log(e)
  }
}