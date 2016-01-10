var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var urlSchema = new mongoose.Schema({
  origurl: {type: String },
  seq: Number,
  miniurl: String
});

  var miniurl = mongoose.model('miniurl', urlSchema);

//export Movie database and schema
module.exports = mongoose.model('miniurl', urlSchema);
