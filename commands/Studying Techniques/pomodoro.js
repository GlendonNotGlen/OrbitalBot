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

//Pomodoro command
module.exports = {
    name: 'pomodoro',
    description: 'A pomodoro is by-default 25 minutes of focused work followed by 5 minutes of break. \nThe ratio of 25:5 is scalable by entering a number after pomodoro',
    aliases: ['pom'], //Pseudo-name to initiate this function
    guildOnly: true,
    usage: 'Input \'!pomodoro 2\' to set a timer for 50 minutes of work then 10 minutes of break.',
    async execute(message, args) {
        const { member } = message
        //error handling for invalid commands
        if (!args[0]) {
            //user did not input an scaling factor
            return message.reply("please input a factor of scale. You may use !help pomodoro for more information") 
        } else if (isNaN(args[0])) {
            //user input an invalid scale factor
            return message.reply("please input a valid number after the command")
        } else if (args[0] < 1 || args[0] > 5) {
            //limits scaling between 1 and 5
            return message.reply("please enter a scaling factor between 1 and 5 (inclusive)")
        }
        
        let searchResult
        //connect to database to retrieve user profile, creates new one if it doesnt exist
        await mongodb1().then(async (mongoose) => {
            try {
                console.log('Connected to MongoDB to retrieve user profile')
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

        //Default settings for pomodoro
        const defaultWorkTime = ms('25min');
        const defaultRestTime = ms('5min');
        const baseExp = 100;

        //Scaling the alarm
        let timeStudying = defaultWorkTime * Math.floor(args[0]);
        let timeResting = defaultRestTime * Math.floor(args[0]);

        //saving information to store inside user profile for !checkalarm
        let alarmID;
        let alarmStart = moment().calendar();
        let alarmEnd = moment().add(timeStudying, 'milliseconds').calendar();

        //Conversion of time to allow for javascript to handle 
        timeStudying = ms(timeStudying, { long: true });
        timeResting = ms(timeResting, { long: true });

        //Creates an embedded message acknowledge user's pomodoro timer, together with an encouraging message
        //Sends it in to the same channel where the user created the alarm
        const embed = new discord.MessageEmbed()
            .setAuthor(`${message.author.tag} Pomodoro Alarm`, message.author.displayAvatarURL())
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
                    .setAuthor(`${message.author.tag} Pomodoro timer`, message.author.displayAvatarURL())
                    .setColor("0x2ECC71")
                    .setDescription(`Great job studying for \`${timeStudying}\`\n \`you earned this break of ${timeResting}!\`\n\nAlarm set in server: \`${message.guild.name}\``)
                message.author.send(embed);
                console.log("Calculating added exp...")
                IncreaseEXP.execute(member.id, baseExp * Math.floor(args[0]), message, false)
                console.log("work alarm ended successfully")
                workEnd()
            }, ms(timeStudying))

            //updating user's profile with information stored earlier
            updateUserAlarm.execute(member.id, 'Pomodoro - Work', alarmStart, alarmEnd, alarmID)
            console.log("Updated user document for work alarm successfully")

        }).then(async () => {
                //work alarm ended successfully
                await new Promise(async (restEnd, restError) => {
                //Sets an scheduled embedded PM to the user when break time is over.
                alarmID = setTimeout(async () => {
                    const embed = new discord.MessageEmbed()
                        .setAuthor(`${message.author.tag} Pomodoro timer`, message.author.displayAvatarURL())
                        .setColor("0x2ECC71")
                        .setDescription(`Your break of ${timeResting} is over. \nReady for another? Use !pomodoro or try one of our other study methods to begin another session.\nAlarm set in server: \`${message.guild.name}\``)
                        .setTimestamp();
                    message.author.send(embed);
                    console.log("rest alarm ended successfully")
                    restEnd()
                }, ms(timeResting))

                //saving information to store inside user profile
                alarmStart = moment().calendar();
                alarmEnd = moment().add(ms(timeResting), 'milliseconds').calendar();

                //update user's profile with information stored earlier
                updateUserAlarm.execute(member.id, 'Pomodoro - Rest', alarmStart, alarmEnd, alarmID)
                console.log("Updated user document for rest alarm successfully")
            }).then(async () => {
                console.log("Updating database for alarm status")
                hasAlarmToggle.execute(member.id)
            })
        })

    },
};
