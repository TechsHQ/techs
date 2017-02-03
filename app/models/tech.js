var mongoose = require('mongoose')

var TechSchema = new mongoose.Schema({
  publisher: String,
  title: String,
  url: String,
  pub_date: Date
})

module.exports = mongoose.model('Tech', TechSchema, 'techs')
