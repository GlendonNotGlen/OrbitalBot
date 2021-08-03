const mongodb1 = require('../../database/mongodb1') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema

const getNeededXp = (level) => level * level * 1000;

//Send you the level of the individual or of someone within the same server
module.exports = {
    name: 'level',
    description: 'Sends you the level of an account (individual / peers within the server).',
    aliases: ['rank', 'xp', 'levels', 'mylevel'], //Pseudo-name to initiate this function
    usage: 'Input \'!level <user>\' to retrieve information on a user\'s level. \nIf no user is specified, it will return information on the sender of the command',
    //Input \'!checkalarm <user>\' retrieve information on a user\'s alarm. If no user is specified, it will return information on the sender of the command.
    async execute(message, args) {
        //Variable to store id of user
        var idOfUser;

        //If no arguments are passed (user id), it will take the individual user one
        if (args.length == 0){
            idOfUser = message.author.id;
        } //If an argument passed, it take the user's one
        else if (args.length == 1){
            idOfUser = message.mentions.users.first().id;
        }else{ //Else error catching
            message.reply('Please check if you have input the right command.');
        }

        //Accessing cloud database
        await mongodb1().then(async (mongoose) => {
            try{
                //Find the data of the user
                const result = await profileSchema.findOneAndUpdate({ userId: idOfUser }, {}, {
                    upsert: true,
                    new: true
                })
                let { level, xp } = result;
                xp = getNeededXp(level + 1) - xp;

                //Send the data of the user (individual or peer's)
                if (args.length == 0){
                    message.reply(`You are level ${level}. You will need ${xp} more xp(s) to reach the next level! \nEarn xp by starting a study session or talking to your friends.`);
                }
                else if (args.length == 1){
                    message.channel.send(`<@${idOfUser}> is level ${level}. They will need ${xp} more xp to reach the next level! \nEarn xp by starting a study session or talking to your friends.`);
                }
            } finally {
              mongoose.connection.close();
            }
        })
    },
}