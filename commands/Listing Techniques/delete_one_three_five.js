//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const { prefix } = require('../../config.json');
const onethreefiveSchema = require('../../schemas/1-3-5-schema.js');

////Boiler-plate function to add exp to users
module.exports = {
    name: 'erase1-3-5',
    description: 'List all of my commands or info about a specific command.',
	aliases: ['stop135', 'delete135', 'erase135', 'stop1-3-5', 'delete1-3-5' ], //Psuedo-command that allows activation of code
	usage: '!help [command name]',
    async execute(message, args) {
        
        await mongodb1().then(async (mongoose) => {
            
            try{
                //Query database and search for userId and update that id
                const updated135 = await onethreefiveSchema.findOneAndUpdate(
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
                        upsert: true,
                        new: true,
                    }
                )
                let { task } = updated135;
                console.log(updated135);
                var stringToChannelMessage = "All your taskings for 1-3-5 have been refreshed and removed. You can now start a new session by typing \'!1-3-5\'. All the best for your next session! :smile:";
                message.channel.send(stringToChannelMessage);
            } finally {
                
            }
            
        })
    },
};