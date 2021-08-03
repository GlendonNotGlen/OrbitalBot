const discord = require("discord.js")
const mongodb1 = require('../../database/mongodb1') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema

module.exports = {
    name: 'checkalarm',
    description: 'Sends an embedded message with information on the user\'s alarm',
    aliases: ['check'], //Pseudo-name to initiate this function
    usage: 'Input \'!checkalarm <user>\' to retrieve information on a user\'s alarm. If no user is specified, it will return information on the sender of the command.',
    async execute(message, args) {
        let taggedUser
        let searchResult
        if (!message.mentions.users.size) {
            //no mentions are given in the message (i.e. command given is just `!checkalarm`)
            await mongodb1().then(async (mongoose) => {
                try {
                    console.log('Connected to MongoDB for tagged user')
                    taggedUser = message.member.id
                    searchResult = await profileSchema.findOne({ userId: taggedUser }, {}, {
                        upsert: true,
                        new: true
                    })
                    console.log("Found tagged user in data base")
                } finally {
                    console.log('Closing connection to MongoDB')
                    mongoose.connection.close()
                }
            })

            if (searchResult.alarm.hasAlarm == false) {
                //for when user does not have an alarm
                console.log("Tagged user does not have an on-going alarm")
                return message.reply("ypu do not have any on-going alarm")
            }

            console.log("Creating embed...")
            const embed = new discord.MessageEmbed()
                .setAuthor(`${message.author.tag} Alarm information`, message.author.displayAvatarURL())
                .setColor("0x00FF72")
                .setDescription(`Alarm Type : \`${searchResult.alarm.alarmType}\``)
                .addFields(
                    { name: 'Timer started at :', value: `\`${searchResult.alarm.alarmStart}\``, inline: true },
                    { name: 'Timer ends at :', value: `\`${searchResult.alarm.alarmEnd}\``, inline: true },
                )
            message.reply(embed);
            console.log("Embed sent")
        } else if (message.mentions.users.size > 1) {
            //user tagged more than 1 other user
            console.log("User tagged more than 1 other user")
            return message.reply("Please tag at most 1 user")
        } else {
            taggedUser = message.mentions.users.first();
            await mongodb1().then(async (mongoose) => {
                try {
                    console.log('Connected to MongoDB for tagged user')
                    searchResult = await profileSchema.findOneAndUpdate({ userId: taggedUser.id }, {}, {
                        upsert: true,
                        new: true
                    })
                    console.log("Found tagged user in data base")
                } finally {
                    console.log('Closing connection to MongoDB')
                    mongoose.connection.close()
                }
            })

            if (searchResult.alarm.hasAlarm == false) {
                //for when user does not have an alarm
                console.log("Tagged user does not have an on-going alarm")
                return message.reply("That user does not have any on-going alarm")
            }

            console.log("Creating embed...")
            const embed = new discord.MessageEmbed()
                .setAuthor(`${taggedUser.tag} Alarm information`, taggedUser.displayAvatarURL())
                .setColor("0x00FF72")
                .setDescription(`Alarm Type : \`${searchResult.alarm.alarmType}\``)
                .addFields(
                    { name: 'Timer started at :', value: `\`${searchResult.alarm.alarmStart}\``, inline: true },
                    { name: 'Timer ends at :', value: `\`${searchResult.alarm.alarmEnd}\``, inline: true },
                )
            message.reply(embed);
            console.log("Embed sent")
        }
    }
}