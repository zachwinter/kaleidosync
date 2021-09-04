const Sketch = require('../database/models/Sketch')

let SKETCHES

async function fetchSketches () {
  try {
    SKETCHES = await Sketch.find({ published: true })
  } catch (e) {
    console.log(e)
  }  
}

setInterval(fetchSketches, 1000 * 60 * 5)

module.exports = async app => {
  await fetchSketches()

  app.get('/api/sketches/all-published', async (req, res) => {
    try {
      res.json({ success: true, sketches: SKETCHES })
    } catch (e) {
      console.log(e)
      res.json({ success: false, error: e })
    }
  })
}