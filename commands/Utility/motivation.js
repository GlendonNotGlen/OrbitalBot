module.exports = {
    name: 'motivation',
    description: 'This command generates a random motivation message to the user',
    usage: 'Input \'!motivation\' to receive a random motivational message from the bot.',
    execute(message, args) {
        //this field directly sends a randomly selected message for the user
      const randomMessage = RandomMessageGenerator();
      message.channel.send(randomMessage)  
    },
    alarmMessage () {
        //this field returns a random message for the alarm command to insert into embeds when users start a study session
        return RandomMessageGenerator(); 
    }
}
//This function stores the list of motivational quotes and returns a randomly selected 1 whenever this function is called.
function RandomMessageGenerator () {
    const replies = [
        'It always seems impossible until it’s done \n -Nelson Mandela',
        'Motivation is what sets you in motion, habit is what keeps you going \n-Jim Ryun',
        'Good fortune favors the daring \n-Virgil',
        'You can always be better \n-Tiger Woods',
        'There is no substitute for hard work \n-Thomas Edison',
        'I have failed again and again throughout my life. That’s why I’ve been successful \n-Michael Jordan',
        'If we did all the things we are capable of, we would be amazed \n-Thomas Edison',
        ' Quality is never an accident, it is always the result of an effort of intelligence \n-John Ruskin',
        'Change your thoughts and you will change your world \n-Norman Vincent Peale',
        'Your talents and abilities will improve over time, but for that you have to start \n-Martin Luther King',
        'True education is about getting the best out of oneself \n-Mahatma Gandhi',
        'If you do not go to the end, why start? \n-Joe Namath',
        'Learning without thinking is useless. Think without learning, dangerous \n-Confucius',
        'The wonderful thing about learning something is that nobody can take it from us \n-BB King',
        'Quality is not an act, but a habit \n-Aristotle',
        'The man well prepared for the struggle has achieved half a triumph \n-Miguel de Cervantes',
        'Strive for progress, not perfection.',
        'Don’t wish it were easier; wish you were better. \n–Jim Rohn',
        'There are no shortcuts to any place worth going. \n–Beverly Sills',
        'Push yourself, because no one else is going to do it for you.',
        'Some people dream of accomplishing great things. Others stay awake and make it happen.',
        'You don’t drown by falling in the water; you drown by staying there. \n–Ed Cole',
    ]

    //generates a random index from the list of replies
    const index = Math.floor(Math.random() * replies.length);
    return replies[index]
}