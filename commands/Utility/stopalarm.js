const mongodb1 = require('../../database/mongodb1') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema
const hasAlarmToggle = require('../../hasAlarmToggle')

module.exports = {
    name: 'stopalarm',
    description: 'Stops any on-going alarm the user has',
    //aliases: [], //Pseudo-name to initiate this function
    usage: 'Type \'!stopalarm\' to disable any on-going timer/study session',
    async execute(message, args) {
        const { member } = message
        let searchResult //declaring searchResult for reference later
        await mongodb1().then(async (mongoose) => {
            try {
            //retrieving user profile
              console.log('Connected to MongoDB')        
              searchResult = await profileSchema.findOneAndUpdate({
                userId: message.member.id,
              }, {}, { 
                  upsert : true, 
                  new: true 
                });             
            } finally {
                console.log('Closing connection to MongoDB')
                mongoose.connection.close()
            }
          })

          if (searchResult.alarm.hasAlarm == false) {
              //error handling
            console.log("User does not have an alarm")
            return message.reply("You do not have any alarm in-progress!")
        } else {
            console.log("Check done for user having an on-going alarm")
            await new Promise(async (stopSuccess, stopError) => {
                console.log("Clearing timeout")
                clearTimeout(searchResult.alarm.alarmId) //removing the alarm itself
                console.log("Cleared timeout")
                stopSuccess()
            }).then(() => {
                //cleared alarm successfully
                hasAlarmToggle.execute(member.id) //updating hasAlarm status in database
                console.log("Successfully updated hasAlarm")
                message.reply("Your alarm have been stopped") //acknowledge user's request
            })            
        }
    },
}