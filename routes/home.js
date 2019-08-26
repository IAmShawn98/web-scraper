const routeHome = (req, res) => {
  const context = {
    name: 'Nick',
    date: new Date()
  }
  res.render('home', context)
}

module.exports = routeHome