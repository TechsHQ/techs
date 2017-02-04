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

        var start = new Date(techs[techs.length - 1].pub_date).toJSON()

        var response = {
          data: {
            next: url + '?' + 'start=' + start,
            techs: techs
          }
        }
        res.json(response)
      })
  })

app.use('/api', router)
app.listen(port)
