const mongodb1 = require('./database/mongodb1') //link to database
const profileSchema = require('./schemas/profile-schema') //link to profile schema

//simple code to toggle hasAlarm variable in document
module.exports = {
    async execute(memberID) {
        await mongodb1().then(async (mongoose) => {
            console.log('Connected to MongoDB')
            try {
                await profileSchema.findOneAndUpdate({ userId: memberID }, [{
                        $set: { "alarm.hasAlarm" : { $not: "$alarm.hasAlarm" }}
                    }]);
            } finally {
                console.log("Closing connection to MongoDB")
                mongoose.connection.close()
            }
        })
    }
}
