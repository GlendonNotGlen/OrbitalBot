//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const oneThreeFiveSchema = require('../../schemas/1-3-5-schema.js');

////Boiler-plate function to add exp to users
module.exports = {
    name: 'complete1-3-5',
    description: 'List all of my commands or info about a specific command.',
	aliases: ['clear135', 'finish135'], //Psuedo-command that allows activation of code
	usage: '!help [command name]',
    async execute(message, args) {
        
        await mongodb1().then(async (mongoose) => {
            
            try{
                //Query database and search for userId and update that id
                const updated135 = await oneThreeFiveSchema.findOneAndUpdate(
                    {
                        userId: message.member.id,
                    },
                    {
                        userId: message.member.id,
                        bigTask: "",
                        mediumTasks: [],
                        littleTasks: [],
                    },
                    {
                        upsert:true,
                        new: true,
                    }
                )
                let { task } = updated135;
                //Complete task, gain exp -> 
                var stringToChannelMessage = "Congratulations on completing your session! Start a new one again soon! :smile:";
                message.channel.send(stringToChannelMessage);
            } finally {
                
            }
            
        })
    },
};