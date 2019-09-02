module.exports = app => {
  const auth = () => Math.random().toString(36).slice(5, 11).toUpperCase()

  app.get('/auth', (req, res) => {
    let auth_id = auth()
  
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ auth_id }))
  })
}
