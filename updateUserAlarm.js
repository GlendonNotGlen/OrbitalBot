const mongodb1 = require('./database/mongodb1.js') //link to database
const profileSchema = require('./schemas/profile-schema') //link to profile schema

//simple file to update alarm object of user in database
module.exports = {
    async execute(memberID, newAlarmType, newAlarmStart, newAlarmEnd, newAlarmID) {
        await mongodb1().then(async (mongoose) => {
            console.log('Connected to MongoDB')
            try {
                await profileSchema.findOneAndUpdate({ userId: memberID }, 
                    { $set: {
                            "alarm.alarmType": newAlarmType,
                            "alarm.alarmStart": newAlarmStart,
                            "alarm.alarmEnd": newAlarmEnd,
                            "alarm.alarmId": newAlarmID}
                });
            } finally {
                console.log("Closing connection to MongoDB")
                mongoose.connection.close()
            }
        })
    }
}