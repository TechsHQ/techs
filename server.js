var express = require('express')
var mongoose = require('mongoose')
var Tech = require('./app/models/tech')

var port = process.env.PORT || 8080
var app = express()

mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise = global.Promise

var router = express.Router()
router.route('/techs')
  .get((req, res) => {
    console.log('[GET /techs]', req.query)
    var fullUrl = req.protocol + '://' + req.get('host') + '/api' + req.path;
    var start =  req.query.start && { $lt: new Date(req.query.start) }
    var query = {
      pub_date: start || { $lt: Date.now() }
    }

    Tech.find(query)
      .limit(10)
      .sort('-pub_date')
      .exec((err, techs) => {
        if (err)
          res.send(err)

        var response = {
          data: {
            next: fullUrl + '?' + 'start=' + new Date(techs[techs.length - 1].pub_date).toJSON(),
            techs: techs
          }
        }
        res.json(response)
      })
  })

app.use('/api', router)
app.listen(port)
