const Canvas = require('canvas');
var Frame = require("canvas-to-buffer")

const Discord = require("discord.js");
const fastwords = ["the","maiden","and","terminator","ocean","lava","magma","you","that","formation","tectonic","plate","for","sirius","are","liver","with","his","they","sunshine","moon","bottom","this","have","from","shrink","one","had","suave","word","but","not","what","all","were","sure","when","your","can","said","there","use","sickening","each","which","she","doing","how","their","fable","will","cable","other","about","out","many","then","them","these","princess","some","her","would","make","like","him","into","time","has","look","two","more","write","grin","see","number","thigh","way","could","people","watering","than","first","water","been","call","who","oil","blabber","now","find","long","down","day","did","get","come","made","may","part"];

//To create a fast type reactionary game 
module.exports = {
	name: 'reactiontype',
	description: 'Sets a custom alarm paired with a description',
    aliases: ['fasttype', 'speedtype', 'speedtyping', 'fasttyping'],
	async execute(message, args) {
    
    //Embedded message for discord servers (Different nature from normal message)
      let fastembed = new Discord.MessageEmbed()
        .setAuthor('Ben', 'https://www.google.com')
        .setColor('#00ffff')
        .setTimestamp()
        .setFooter('Created by ben!', "https://www.google.com.sg")
        .setDescription("In \'5 seconds\' your word will appear!")

    //Send the embedded message to the channel
    const a = await message.channel.send(fastembed);

    //Delay while the code is loading
    await delay(5000);
    let x = 20000;
    
    //Running of the game
    try{
    //Randomly fetch a word from 'fastwords' array
    let msg = fastwords[Math.floor(Math.random() * fastwords.length)];
    //Get the channel where the author initiated the game and slot them into the variable
    const channel = message.channel;
    //If no channel exists, return
    if (!channel) return;

    //Create canvas for the embedded message
    const canvas = Canvas.createCanvas(700, 250);
    
    //Get 2d canvas
    const ctx = canvas.getContext('2d');
    //Load image into canvas
    const background = await Canvas.loadImage('commands/Games/fast-image.png')
    
    //Aesthetic attributes and properties setting for the canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle='#C0C0C0';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '56px impact';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(msg, canvas.width / 2.35, canvas.height / 1.8);
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    //Load image onto canvas
    const avatar = await Canvas.loadImage('commands/Games/fast-image.jpg');
    //Canvas attribute and properties
    ctx.drawImage(avatar, 25, 25, 200, 200);
    var frame = new Frame(Canvas)
    
    //Message attachment and embedding onto Discord
    const attachment = await new Discord.MessageAttachment(canvas.toBuffer(), 'commands/Games/fast-image.png');
    let fastembed2 = await new Discord.MessageEmbed()
    .setColor('#00ffff')
        .setTimestamp()
        .setFooter('Created by ben!', "https://www.google.com.sg")
        .setDescription("In \'5 seconds\' your word will appear!")
        .addField("You have", `\'${x/1000} Seconds\'`)
        .attachFiles(attachment)
    
    //Delete the first canvas
    a.delete();
    
    //Send an embedded message into the channel
    const b = await message.reply(fastembed2);

    let i=0;
    var date = new Date();

    //Wait for user reply and check their answers against the words that will be picked
    await b.channel.awaitMessages(m=>m.author.id == message.author.id, {max: 1, time: x, errors: ['time'],}).then(async collected =>{
        x = collected.first().content;
    }).catch(()=>{return i++;});

    //If time runs out, send a reply
    if(i==1) return message.reply('Your time ran out');
    var date2 = new Date();
    //The amount of time they took to reply to the puzzle
    if(x==msg) return message.reply(`Wow you are fast! and right! You needed \'${(date2 - date)/1000} seconds\'`);
    else return message.reply('That\'s wrong!');
    console.log('hello');
    }finally{
    }
},
};

//Delay the function while it is initialising and loading up
function delay(delayInms){
    return new Promise(resolve =>{
        setTimeout(()=>{
            resolve(2);
        }, delayInms);
    })
}