//Importing of required library, packages. Importing of prefix and bot-token for activation of the app 
const Discord = require("discord.js");
const fs = require("fs");
//const { prefix, BOT_TOKEN, PASSWORD } = require("./config.json");
const mongodb1 = require("./database/mongodb1");
const addXp = require('./Boilerplate_Functions/AddXP');

//Initialisation of Client for activation of discord
//Initialisation of commands as a map - extends js native map class and has extra utilities
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Prints "Bot is online!" when bot comes online - debugging tool to ensure bot comes online
client.on("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

// Returns an array of all the folders and files in 'command' directory, ['help.js', 'leave.js'] - Level 0 search
  const commandFolders = fs.readdirSync("./commands");
 
  // Loops through all the files within the folders that are situated in 'command' directory - Level 1 search
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js")); //Filter for files that ends with .js
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`); 
      client.commands.set(command.name, command); 
    }
  }

 // Code starts when node gets initiated and activated.
 client.on("message", async (message) => {

  //prevent bot from activating itself
    if (message.author.bot) return;

  //gives exp for every message the user sends into the chat
  if (!message.content.startsWith(process.env.prefix)){
   const randomXp = Math.floor(Math.random() * 14) + 1;
   addXp.execute(message.author.id, randomXp, message, true);
   return;
  }

   //stores the user's command in an array - args can be used for further customisation. 
   //Code below allows user to type in capital letters and even then, the commands should work.
   const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
   const commandName = args.shift().toLowerCase();

   //Get files that aligns with the command of user
    const command = client.commands.get(commandName)
 	 	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

 	if (!command) {
    return message.reply("That is not a valid command. Please use !info for more information regarding this bot.")
   }
   

   //checks for channel-only commands
   if (command.guildOnly && message.channel.type === "dm") {
     return message.reply("I can't execute that command inside DMs!");
   }

   //Try executing code else print error
   try {
     command.execute(message, args, commandName);
   } catch (error) {
     console.error(error);
     message.reply("there was an error trying to execute that command!");
   }
 });


 //Test connection into mongodb1
const connectToMongoDB = async() => {
  await mongodb1().then((mongoose)=>{
    try{
      console.log('Connection to MongoDB server successful');
    } finally{
      mongoose.connection.close();
    }}
  )
}

connectToMongoDB();
//Login and access bot using bot-token
client.login(process.env.BOT_TOKEN);
