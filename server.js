var express = require('express')
var mongoose = require('mongoose')
var Tech = require('./app/models/tech')

var port = process.env.PORT || 8080
var app = express()

mongoose.connect(process.env.MONGODB_URI)

var router = express.Router()
router.route('/techs')
  .get((req, res) => {
    Tech.find((err, techs) => {
      if (err)
        res.send(err)

      var response = {
        data: {
          techs: techs
        }
      }

      res.json(response)
    })
  })

app.use('/api', router)
app.listen(port)
