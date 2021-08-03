const mongoose = require('mongoose')


const reqString = {
  type: String,
  required: true,
}

const oneThreeFiveSchema = mongoose.Schema({
  //guildId: reqString,
  userId: reqString,
  bigTask: String,
  mediumTasks: [String],
  littleTasks: [String],
})

module.exports = mongoose.model('oneThreeFive', oneThreeFiveSchema)