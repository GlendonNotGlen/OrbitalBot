const mongodb1 = require('../../database/mongodb1') //link to database
const quizcardSchema = require('../../schemas/quizcard-schema.js');

module.exports = {
    name: 'listquizpackage',
    async execute(message, args) {
        await mongodb1().then(async (mongoose) => {
            try{
                const result = await quizcardSchema.find({
                    userId: message.member.id,
                });
                //console.log(result[0]['userId']);
               if (result.length != 0 && result.length != 'undefined'){
                var stringMessage = `You have ${result.length} quiz packages! :smile: \n`;   
                for (i=0; i<result.length; i++){
                    stringMessage += `${i+1}. ${result[i]['packageName']} \n`;
                }
               message.channel.send(stringMessage);
                } else {
                    message.channel.send("You do not have any quiz packages! Start creating one now! :books:");    
                }
            } finally {
              mongoose.connection.close();
            }
        })
    },
}