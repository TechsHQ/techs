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
    var fullUrl = 'https://' + req.get('host') + '/api' + req.path;
    var page =  req.query.page ? Number(req.query.page) : 1

    Tech.find()
      .sort('-pub_date')
      .skip((page - 1) * 10)
      .limit(10)
      .exec((err, techs) => {
        if (err)
          res.send(err)

        var response = {
          data: {
            next: fullUrl + '?' + 'page=' + (page + 1),
            prev: page === 1 ? undefined : fullUrl + '?' + 'page=' + (page - 1),
            techs: techs
          }
        }
        res.json(response)
      })
  })

app.use('/api', router)
app.listen(port)
