//Importing of necesary libraries and packages
const { prefix } = require('../../config.json');

module.exports = {
	//Sends a private message to the user on the list of commands or info about a command, preventing server spam
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'], //Psuedo-command that allows activation of code
	usage: '!help [command name]',
	async execute(message, args) {
		//Initialisation of variables that allows for commands to be listed
		const data = []; //For collection of information for the different commands
		const { commands } = message.client;
		
		//List of all commands and guide on how to utilise the bot (usage of prefix, etc)
		if (!args.length) {
			data.push('Here\'s a list of all my commands:');	//List of all commands
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`); //Guide on how to use bot
			
			//If channel.type is direct message, DM the user and send him all the commands
			return message.author.send('Here\'s a list of all my commands: \n   Study Techniques: !Pomodoro, !52-17, !Tock, !90Minutes \n   Music: !Play <Music Title>, !Skip, !Stop, !Leave \n   Level System: !Level, !Level <@TaggedPeer>, !Leaderboard \n   Games: !Reactiontype, !Snake \n   Utility: !Alarm, !Checkalarm, !Stopalarm, !Motivation, !To-do <task>, !list, !Delete <Task-Number>')
				.then(() => {
					if (message.channel.type === 'dm') return;
					return message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => { //Error-handling
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}
		const name = args[0].toLowerCase(); //Transform all the names to lowercase
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name)); //include !help for aliases

		if (!command) {	//If there isn't such a command, let user know
			return message.reply('that\'s not a valid command!');
		}

		//Name of command
		data.push(`**Name:** ${command.name}`);

		//Let user know the alias of the command, description and how its used.
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${command.usage}`);

		//Send the message to the channel
		message.channel.send(data, { split: true });
	}
};
