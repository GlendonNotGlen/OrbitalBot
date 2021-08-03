//Importing of necessary packages from libraries
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

//Global music queue for the bot
const queue = new Map();

//Command to start playlist
module.exports = {
    name: 'play',
    aliases: ['skip'], //Use aliases to skip and stop the bot from playing
    description: 'This is a music bot that allows the user to enjoy music while studying. Some common commands include queueing music, skipping the music in queue and stopping the bot.',
    usage: 'Input \'!play <song title>\' to add a song from Youtube to your Queue. \n Using \'!skip\' will skip the current song in the queue. \n Using \'!stop\' will pause the current music that it is playing.',
    async execute(message, args, commandName){
        var musicChoices;

        //Checking for all necessary criteria before execution of main code - permissions & user in a channel
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        //Getting server queue from global queue
        const server_queue = queue.get(message.guild.id);

        //Execute if the user initiate a 'play' command.
        if (commandName === 'play'){
            //Check for presence of necessary argument
            if (!args.length) return message.channel.send('You need to send the second argument!');
            let song = {};

            //If the first argument is a link. Set the song object to have two keys - Title and URl.
            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                //If there was no link, we use keywords to search for a video. Set the song object to have two keys - Title and URl.
                const video_finder = async (query) =>{
                    
                    //Get youtube video query
                    const video_result = await ytSearch(query);
                    
                    //Check number of videos returned - if 0, say no streamable videos found. If less than 5, handle accordingly and dont over-input. If more than 5, limit to 5.
                    if (video_result.videos.length == 0){
                        message.channel.send('Error finding video. No streamable videos found.')
                        return null;
                    } else if (video_result.videos.length < 5){
                        musicChoices = "Input the number of the music that you would like played! We found some relevant songs on youtube! \n"
                        for (i=0; i<video_result.videos.length; i++){
                            musicChoices += `${i+1}: ${video_result.videos[i]['title']} \n`
                        }
                        message.channel.send(musicChoices);
                    } else if (video_result.videos.length >= 5){
                        musicChoices = "We have found some relevant songs on youtube! Input the number of the music that you would like played. \n"
                        for (i=0; i<5; i++){
                            musicChoices += `${i+1}: ${video_result.videos[i]['title']} \n`
                        }
                        message.channel.send(musicChoices);
                    }
                    
                    //Filter messages and listen to person to input the next video.
                    const filter = m => m.author.id === message.author.id
                    return message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
                        .then((collected) => {
                            //console.log('byelaksdlakdsmlaksmdlaksmd')
                            if (collected.first().content == '1'){
                                return video_result.videos[0];
                            }else if (collected.first().content == '2'){
                                return video_result.videos[1]
                            }else if (collected.first().content == '3'){
                                return video_result.videos[2]
                            }else if (collected.first().content == '4'){
                                return video_result.videos[3]
                            }else if (collected.first().content == '5'){
                                return video_result.videos[4]
                            }
                            message.channel.send('Error finding video. Check if you have inputted a number (range 1-5) when selecting music from the list.')
                            null;
                            
                        })
                    //return (video_result.videos.length > 1) ? video_result.videos[0] : null; //Return the first video available int he list
                }
            
                const video = await video_finder(args.join(' '));
                console.log(video)
                try {
                    if (video.title){
                        song = { title: video.title, url: video.url } //If there exists a video to be streamed
                }}
                finally{}
            }

            //If server queue doesnt exist, create a constructor for it to be added to our global queue.
            if (!server_queue){

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                
                //Add key-value pair into global queue, which will be used to get our server queue.
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                //Establish a connection and play the song with the video_player function.
                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection; //Establsh connection
                    video_player(message.guild, queue_constructor.songs[0]);
                } catch (err) { //Error-handling
                    queue.delete(message.guild.id); //Delete queue if failed
                    message.channel.send('There was an error connecting!');
                    throw err; 
                }
            } else{
                server_queue.songs.push(song); //Push song to server queue
                return message.channel.send(`👍 **${song.title}** added to queue!`); //User confirmation - song added
            }
        }
        
        //Execute if the user initiate a 'skip' command.
        else if(commandName === 'skip') {
            if (server_queue.songs.length == 1) {
                return message.reply("You do not have any songs in the queue. Use !play <song name> to add a song to the queue.")
            }
            skip_song(message, server_queue);
        }
    }
    
}

//Queueing system for the video-player. If has song in queue, continue, else bot exits voice channel and delete key-pair value
const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.voice_channel.leave(); //Leave voice channel
        queue.delete(guild.id); //Delete key-pair value from global queue
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' }); //Stream video to be audio only
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 }) //Stream at volume 0.5 and seek 0
    .on('finish', () => {
        song_queue.songs.shift();  //Shift queue and allow next song to be played
        video_player(guild, song_queue.songs[0]); //Play song
    });
    await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`) //Confirmation and inform user that next song is being played
}

//Function to skip to the next song in queue
const skip_song = (message, server_queue) => {
    //If user is not in a voice channel, he cannot execute this command
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    //Inform user if there are no songs in the queue
    if(!server_queue){
        return message.channel.send(`There are no songs in queue 😔`); 
    }
    //End server queue
    server_queue.connection.dispatcher.end();
}
