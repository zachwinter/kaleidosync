module.exports = app => {
  app.get('/api/authentication/auth', (req, res) => {
    res.json({
      success: true,
      auth_id: Math.random().toString(36).slice(5, 11).toUpperCase()
    })
  })
}