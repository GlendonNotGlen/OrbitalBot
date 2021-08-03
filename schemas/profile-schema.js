const mongoose = require('mongoose')


const reqString = {
  type: String,
  required: true,
}

const profileSchema = mongoose.Schema({
  //guildId: reqString,
  userId: reqString,
  coins: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  }, 
  alarm: {
    hasAlarm: {
      type: Boolean,
      default: false,
    },
    alarmType: {
      type: String,
    },
    alarmStart: {
      type: String,
    },
    alarmEnd: {
      type: String,
    },
    alarmId: {
      type: Number,
    }
  },
  toDoList: [String]
})

module.exports = mongoose.model('profiles', profileSchema)