//Importing all the necessary libraries and packages
const discord = require("discord.js")
const ms = require("ms")
const moment = require("moment")
const mongodb1 = require('../../database/mongodb1') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema
const IncreaseEXP = require("../../Boilerplate_Functions/AddXP")
const hasAlarmToggle = require("../../hasAlarmToggle")
const updateUserAlarm = require("../../updateUserAlarm")
const motivation = require("../Utility/motivation")

//90minutes command
module.exports = {
    name: '90minutes',
    description: 'Studies have shown that our brain can work for 90 minutes before losing focus. Enjoy 30 minutes of rest after 90 minutes of work. \n Note that this study technique is not scalable.',
    aliases: ['90', 'blockstudying', '90minute'], //Pseudo-name to initiate this function
    guildOnly: true,
    usage: 'Input \'!90minutes\' to set a timer for 90 minutes of work then 30 minutes of break. This study technique cannot be scaled.',
    async execute(message, args) {
        const { member } = message
        //error handling for invalid commands
        if (args[0]) {
            //user input a scaling factor
            return message.reply("90 minutes block studying is not meant to be scaled. Please use !help 90minutes for more information") 
        }
        let searchResult
        //connect to database to retrieve user profile, creates new one if it doesnt exist
        await mongodb1().then(async (mongoose) => {
            try {
                console.log('Connected to MongoDB')
                searchResult = await profileSchema.findOneAndUpdate({
                    userId: member.id,
                }, {}, {
                    upsert: true,
                    new: true
                })
            } finally {
                console.log('Closing connection to MongoDB')
                mongoose.connection.close()
            }
        })
        
        //check for any currently on-going alarm for user
        if (searchResult.alarm.hasAlarm == true) {
            console.log("User already has an alarm")
            return message.reply("you already have an alarm in-progress! Use !checkalarm for more information")
        } else {
            console.log("Check done for user not having on-going alarm")
            hasAlarmToggle.execute(member.id)
            console.log("Successfully updated hasAlarm")
        }

        //Default settings for 90-minutes
        let timeStudying = ms('90min');
        let timeResting = ms('30min');
        const baseExp = 360;

        //saving information to store inside user profile for !checkalarm
        let alarmID;
        let alarmStart = moment().calendar();
        let alarmEnd = moment().add(timeStudying, 'milliseconds').calendar();

        //Conversion of time to allow for javascript to handle 
        timeStudying = ms(timeStudying, { long: true });
        timeResting = ms(timeResting, { long: true });

        //Creates an embedded message acknowledge user's 90-minutes timer, together with an encouraging message
        //Sends it in to the same channel where the user created the alarm
        const embed = new discord.MessageEmbed()
            .setAuthor(`${message.author.tag} 90-minutes Block`, message.author.displayAvatarURL())
            .setColor("0x2ECC71")
            .setDescription(`Your timer for \`${timeStudying}\` starts now. Here's a message to keep you going :\n \`${motivation.alarmMessage()}\``)
            .setTimestamp()
        message.channel.send(embed)

        //sets a scheduled embedded PM to the user when the work time has passed, while adding EXP to user's profile
        await new Promise(async (workEnd, workError) => {
            //creates study alarm for user
            console.log("Creating work alarm")
            alarmID = setTimeout(async () => {
                const embed = new discord.MessageEmbed()
                    .setAuthor(`${message.author.tag} 90-minutes block`, message.author.displayAvatarURL())
                    .setColor("0x2ECC71")
                    .setDescription(`Great job studying for \`${timeStudying}\`\n \`you earned this break of ${timeResting}!\`\n\nAlarm set in server: \`${message.guild.name}\``)
                message.author.send(embed);
                console.log("Calculating added exp...")
                IncreaseEXP.execute(member.id, baseExp, message)
                console.log("work alarm ended successfully")
                workEnd()
            }, ms(timeStudying))

            //updating user's profile with information stored earlier
            updateUserAlarm.execute(member.id, '90-minutes - Work', alarmStart, alarmEnd, alarmID)
            console.log("Updated user document for work alarm successfully")

        }).then(async () => {
                //work alarm ended successfully
                await new Promise(async (restEnd, restError) => {
                //Sets an scheduled embedded PM to the user when break time is over.
                alarmID = setTimeout(async () => {
                    const embed = new discord.MessageEmbed()
                        .setAuthor(`${message.author.tag} 90-minutes block`, message.author.displayAvatarURL())
                        .setColor("0x2ECC71")
                        .setDescription(`Your break of ${timeResting} is over. \nReady for another? Use !90minutes or try one of our other study methods to begin another session.\nAlarm set in server: \`${message.guild.name}\``)
                        .setTimestamp();
                    message.author.send(embed);
                    console.log("rest alarm ended successfully")
                    restEnd()
                }, ms(timeResting))

                //saving information to store inside user profile
                alarmStart = moment().calendar();
                alarmEnd = moment().add(ms(timeResting), 'milliseconds').calendar();

                //update user's profile with information stored earlier
                updateUserAlarm.execute(member.id, '30 minutes - Rest', alarmStart, alarmEnd, alarmID)
                console.log("Updated user document for rest alarm successfully")
            }).then(async () => {
                console.log("Updating database for alarm status")
                hasAlarmToggle.execute(member.id)
            })
        })

    },
};