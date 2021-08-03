const mongodb1 = require('../../database/mongodb1') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema

module.exports = {
    name: 'leaderboard',
    description: 'Sends you the global leaderboard of people with the highest levels.',
    aliases: ['leaderboard(global)', 'globalleaderboard'], //Pseudo-name to initiate this function
    usage: 'Input \'!leaderboard\' to check the leaderboard of people with the highest levels.',
    async execute(message, args) {
        await mongodb1().then(async (mongoose) => {
            try{
                //retrieve up to 7 profiles from database
                const result = await profileSchema.find({}).sort({
                    level: -1,
                }).limit(7)
               if (result.length != 0){
                   //processing leaderboard
                var stringMessage = `These are the top ${result.length} players in the leaderboard ranking: \n`;   
                for (i=0; i<result.length; i++){
                    stringMessage += `${i+1}: <@${result[i]['userId']}>, level ${result[i]['level']} \n`;
                }
                message.channel.send(stringMessage);
                } else {
                    //no users in leaderboard
                    message.channel.send("There are no users using this bot now. Start registering today!");    
                }
            } finally {
              mongoose.connection.close();
            }
        })
    },
}