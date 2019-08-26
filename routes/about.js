const routeAbout = (req, res) => {
  const context = {
    name: 'Nick',
    date: new Date()
  }
  res.render('about', context)
}

module.exports = routeAbout