//Function that stops the music bot. The music bot will leave the channel.
module.exports = {
    name: 'leave',
    description: 'This command stops the music bot, before leaving the voice channel channel.',
    usage:'Use \'!leave\' to stop the bot from playing music. Any songs in the queue will be removed as well.',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        
        //If user is not in a voice channel, returns print message
        if(!voiceChannel) return message.channel.send("You can only stop the music in a voice channel!");
        await voiceChannel.leave(); //Force bot to leave the voice channel
        await message.channel.send('Leaving channel now :smiling_face_with_tear:') //Send discord message
    }
}