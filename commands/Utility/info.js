const Discord = require('discord.js');

//Embedding a message (a type of message) to give user information about this bot
module.exports = {
    name: 'info',
    description: 'Provides information on this bot.',
    async execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor(0x99AAB5)
            .setTitle('Welcome to StudyTogether Bot. Click on the title to view our project\'s README.')
            .setURL('https://docs.google.com/document/d/1foBbcVx_IZst5X2jQ0U0BBOnYArvvGjuTO0eLra8bzI/edit')
            .setDescription('The StudyTogether Bot was created by Glendon and Ming Huang as their Orbital 2021 project.')
            .addFields(
                { name: 'Study Techniques', value : 'These are the current available studying techniques of this bot :'},
                { name: 'Pomodoro', value: 'Type \'!pomodoro 1\' to start a 25 minutes session of studying, followed by 5 minutes of break', inline: true },
                { name: '52-17', value: 'Type \'!52-17 1\' to start a 52 minutes session of studying, followed by 17 minutes of break', inline: true },
                { name: 'Tock', value: 'Type \'!tock 1\' to start a 45 minutes session of studying, followed by 15 minutes of break', inline: true },
                { name: '90minutes', value: 'Type \'!90minutes\' to start a 90 minutes session of studying, followed by 30 minutes of break. Note that this command is not scalable', inline: true },
                { name: '1-3-5', value : 'Type \'!start135\' to begin increasing your productivity by choosing 1 Big Task, 3 Medium Tasks and 5 Small Tasks you would like to accomplish today.', inline: true},
                { name: 'Quiz Cards', value : 'Create digital flash cards for yourself and master your contents through active recall. Create your first quiz card by using \'!createQuizPackage\' or \'!addQuiz\''},
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Music', value : 'Please join a voice channel before using the Music commands.'},
                { name: 'Play', value : 'Type \'!Play <Music Title>\' to generate a list of streamable music from youtube to study to. Music will be automatically queued when additional ones are added.', inline:true},
                { name: 'Stop', value: 'Type \'!Stop\' to stop all current playlists', inline: true },
                { name: 'Skip', value: 'Type \'!Skip\' to skip the current song that is playing in the queue and listen to the next one.', inline: true },
                { name: 'Leave', value: 'Type \'!Leave\' to command the bot to leave the current voice channel.', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Level System', value : 'The following are some commands to access the level-system :'},
                { name: 'Level', value : 'Type \'!Level\' to check your level and standing within the community.', inline:true},
                { name: 'Level <@user>', value: 'Type \'!Level <@Username>\' to check the level of your peer within the bot community.', inline: true },
                { name: 'Leaderboard', value: 'Type \'!Leaderboard\' to generate the highest levels of the few users within the community.', inline: true },
            )
            .addField('\u200b', '\u200b')

            const embed2 = new Discord.MessageEmbed()
            .setColor(0x99AAB5)
            
            .addFields(
                { name:'Games', value: 'The following are some games for the users :'},
                { name: 'Reaction-typing', value: 'Type \'!Reactiontype\' to play a game that tests your reaction and typing speed', inline: true },
                { name: 'Snake', value: 'Type \'!Snake\' to play a snake game using Discord reactions.', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name:'Utility', value: 'The following are some utility functions for users :'},
                { name: 'Alarm', value: 'Users can also create custom alarms with description by typing \'!alarm <duration> <description>\'', inline: true },
                { name: 'To-do', value: 'In need of a checklist? Type \'!to-do <task>\' to add a task to your very own to-do list. Type \'!list\' to view your current to-do list and \'!delete <task-number>\' to remove a specific task off your to-do list', inline: true },
                { name: 'Check Alarm', value: 'Forgot what time your study session ends? Type \'!checkalarm\' to view more information on your on-going study session. Do note that this does not work for the !alarm command.', inline: true },
                { name: 'Stop Alarm', value: 'Type \'!stopalarm\' to quit your current study session.', inline: true },
                { name: 'Motivation', value: 'Feeling unmotivated? Type \'!motivation\' to receive a randomly selected motivational message.', inline: true },
            )
            .addField('\u200b', '\u200b')
            
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'All the best studying!', value: 'For more information or reporting of any errors on the bot, please contact Glendon or Ming Huang.', inline: true },
                { name: 'Additional Information :', value : 'For a full list of available commands, you may use the \'!help\' command.'},
            )
        message.author.send(embed);
        message.author.send(embed2);
        if (message.channel.type === 'dm') return;
		message.reply('I\'ve sent you a DM with more information on me.');
    }
}