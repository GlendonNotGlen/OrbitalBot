const mongoose = require('mongoose')


const reqString = {
  type: String,
  required: true,
}

const quizCardSchema = mongoose.Schema({
  //guildId: reqString,
  userId: reqString,
  packageName: reqString,
  quizQuestionAmount: {
      type: Number,
      default: 0,
      required: true
  },
  quiz: [{
    quizQuestion: String,
 
    quizAnswers: [{
        type:String,
    }],

    quizRightAnswer: String,
  }],
})


module.exports = mongoose.model('quizCard', quizCardSchema)