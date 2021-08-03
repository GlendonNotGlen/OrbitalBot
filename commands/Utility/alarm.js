//Importing of necessary packages from libraries
const discord = require("discord.js")
const ms = require("ms")

//Command to start custom alarm
module.exports = {
	name: 'alarm',
	description: 'Sets a custom alarm along with a description. Note that once an alarm has been set, it cannot be undone.',
  usage: 'Input \'!alarm 15mins Washing Machine Done\' to set an alarm for 15mins with the title \'Washing Machine Done.\'',
	async execute(message, args) {
      let time = args[0]
      if(!time) {
        //user did not specify the length of the alarm
        return message.reply("Please enter the minutes/hours of your alarm. You may use !help for more information") 
      }
      if(ms(time) > ms("1d"))return message.reply("you can't set your alarm longer than 1 day") //sets a limit on the alarm
      
      let reason = args.slice(1).join(' ')
      if(!reason) {
        //user did not give a description to the alarm
        return message.reply("Please enter a description for your alarm. You may use !help for more information")
      }
      
      //creates an embed to acknowledge user of the alarm created
      const embed = new discord.MessageEmbed()
      .setAuthor(`${message.author.tag} Alarm`,message.author.displayAvatarURL())
      .setColor("0xE74C3C")
      .setDescription(`Time: \`${time}\`\nReason: \`${reason}\``)
      .setTimestamp()
      message.channel.send(embed)
      
      //creates an embed to PM user when the given time for the alarm is over
      setTimeout(() => {
        const embed = new discord.MessageEmbed()
      .setAuthor(`${message.author.tag} Your alarm has been ended`,message.author.displayAvatarURL())
      .setColor("0xE74C3C")
      .setDescription(`Time: \`${time}\`\nDescription: \`${reason}\`\nAlarm set in server: \`${message.guild.name}\``)
      .setTimestamp()
      message.author.send(embed)
      }, ms(time))
      
  },
};
