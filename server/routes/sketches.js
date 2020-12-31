const Sketch = require('../database/models/Sketch')

module.exports = async app => {
  app.get('/api/sketches/all-published', async (req, res) => {
    try {
      const sketches = await Sketch.find({ published: true })
      res.json({ success: true, sketches })
    } catch (e) {
      console.log(e)
      res.json({ success: false, error: e })
    }
  })
}