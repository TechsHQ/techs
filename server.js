var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors')
var Tech = require('./app/models/tech')

var port = process.env.PORT || 8080
var app = express()
app.use(cors())

mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise = global.Promise

var router = express.Router()
router.route('/techs')
  .get((req, res) => {
    console.log('[GET /techs]', req.query)
    var url = 'https://' + req.get('host') + '/api' + req.path;
    if (new Date(req.query.start) == 'Invalid Date')
      var start = { $lt: Date.now() }
    else
      var start = { $lt: new Date(req.query.start) }
    var query = {
      pub_date: start
    }

    Tech.find(query)
      .limit(30)
      .sort('-pub_date')
      .exec((err, techs) => {
        if (err)
          res.send(err)

        var start = techs.length && new Date(techs[techs.length - 1].pub_date).toJSON()

        if (start) {
          var response = {
            data: {
              next: url + '?' + 'start=' + start,
              techs: techs
            }
          }
          res.json(response)
        } else {
          var response = {
            error: {
              code: 404,
              message: 'No more tech blogs...'
            }
          }
          res.status(404).json(response)
        }
      })

  })

app.use('/api', router)
app.listen(port, () => {
  console.log('Server listening on port', port + '!')
})
