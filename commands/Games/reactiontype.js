const Canvas = require("canvas");
var Frame = require("canvas-to-buffer");

const Discord = require("discord.js");
const { MessageEmbed, DiscordAPIError } = require("discord.js");
const fastwords = [
  "the",
  "maiden",
  "and",
  "terminator",
  "ocean",
  "lava",
  "magma",
  "you",
  "that",
  "formation",
  "tectonic",
  "plate",
  "for",
  "sirius",
  "are",
  "liver",
  "with",
  "his",
  "they",
  "sunshine",
  "moon",
  "bottom",
  "this",
  "have",
  "from",
  "shrink",
  "one",
  "had",
  "suave",
  "word",
  "but",
  "not",
  "what",
  "all",
  "were",
  "sure",
  "when",
  "your",
  "can",
  "said",
  "there",
  "use",
  "sickening",
  "each",
  "which",
  "she",
  "doing",
  "how",
  "their",
  "fable",
  "will",
  "cable",
  "other",
  "about",
  "out",
  "many",
  "then",
  "them",
  "these",
  "princess",
  "some",
  "her",
  "would",
  "make",
  "like",
  "him",
  "into",
  "time",
  "has",
  "look",
  "two",
  "more",
  "write",
  "grin",
  "see",
  "number",
  "thigh",
  "way",
  "could",
  "people",
  "watering",
  "than",
  "first",
  "water",
  "been",
  "call",
  "who",
  "oil",
  "blabber",
  "now",
  "find",
  "long",
  "down",
  "day",
  "did",
  "get",
  "come",
  "made",
  "may",
  "part",
];

//To create a fast type reactionary game
module.exports = {
  name: "reactiontype",
  description: "Sets a custom alarm paired with a description",
  aliases: ["fasttype", "speedtype", "speedtyping", "fasttyping"],
  async execute(message, args) {
    //Embedded message for discord servers (Different nature from normal message)
    let fastembed = new Discord.MessageEmbed()
      .setAuthor("StudyTogether Bot", "https://www.google.com")
      .setColor("#00ffff")
      .setTimestamp()
      .setFooter("StudyTogether Bot developers.", "https://www.google.com.sg")
      .setDescription(
        "A random word will appear in '5 seconds', type out the word displayed as fast as possible! Compete against your friend and see who has the fastest reaction time!"
      );

    //Send the embedded message to the channel
    const a = await message.channel.send(fastembed);

    //Delay while the code is loading
    await delay(5000);
    let x = 20000;

    //Running of the game
    try {
      //Randomly fetch a word from 'fastwords' array
      let msg = fastwords[Math.floor(Math.random() * fastwords.length)];
      //Get the channel where the author initiated the game and slot them into the variable
      const channel = message.channel;
      //If no channel exists, return
      if (!channel) return;

      //Create canvas for the embedded message
      const canvas = Canvas.createCanvas(500, 200);

      //Get 2d canvas
      const ctx = canvas.getContext("2d");
      //Load image into canvas
      //const background = await Canvas.loadImage('commands/Games/fast-image.png')

      //Aesthetic attributes and properties setting for the canvas
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "45px calibri";
      ctx.fillStyle = "#fa8072";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(msg, canvas.width / 2.7, canvas.height / 1.8);
      ctx.beginPath();
      ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      //Load image onto canvas
      //const avatar = await Canvas.loadImage('commands/Games/fast-image.jpg');
      //Canvas attribute and properties
      //ctx.drawImage(canvas, 25, 25, 200, 200);
      var frame = new Frame(Canvas);

      //Message attachment and embedding onto Discord
      const attachment = await new Discord.MessageAttachment(canvas.toBuffer());
      let fastembed2 = await new Discord.MessageEmbed()
        .setColor("#00ffff")
        .setDescription(
          `Type the word in the box above! You have a maximum of \'${
            x / 1000
          } seconds\' to key in the right answer.`
        )
        .attachFiles(attachment);

      //Delete the first canvas
      a.delete();

      //Send an embedded message into the channel
      const b = await message.reply(fastembed2);

      let i = 0;
      var date = new Date();

      //Wait for user reply and check their answers against the words that will be picked
      await b.channel
        .awaitMessages((m) => m.author.id == message.author.id, {
          max: 1,
          time: x,
          errors: ["time"],
        })
        .then(async (collected) => {
          x = collected.first().content;
        })
        .catch(() => {
          return i++;
        });

      //If time runs out, send a reply
      if (i == 1)
        return message.reply(
          "we are sorry, your time has ran out. Type '!reactiontype' to start another round! :books:"
        );
      var date2 = new Date();
      //The amount of time they took to reply to the puzzle
      if (x == msg)
        return message.reply(
          `wow you are fast! and right! You needed ${
            (date2 - date) / 1000
          } seconds!`
        );
      else
        return message.reply(
          "that's a wrong answer! Type '!reactiontype' to start another round! :smile:"
        );
      console.log("hello");
    } finally {
    }
  },
};

//Delay the function while it is initialising and loading up
function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}
