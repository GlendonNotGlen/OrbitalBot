const mongodb1 = require('../../database/mongodb1') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema

//Prints your current to-do list
module.exports = {
    name: 'list',
    description: 'Prints your current to-do list.',
    aliases: ['print'], //Pseudo-name to initiate this function
    usage: 'Input \'!list\' for the bot to reply a message showing the current to-do list of the user',
    async execute(message, args) {
        let searchResult
        //find user's profile in data base
        await mongodb1().then(async (mongoose) => {
            try {
                console.log('Connected to MongoDB for printing to-do list')
                searchResult = await profileSchema.findOneAndUpdate({ userId : message.member.id }, {}, { upsert : true, new: true });
            } finally {
                console.log('Closing connection to MongoDB')
                mongoose.connection.close()
            }
        })
        let userList = searchResult.toDoList
        //error handling for empty list
        if (userList.length == 0) {
            console.log("User to-do list is empty")
            return message.reply("Your to-do list is empty! Use !todo <task> to add a task to your to-do list.")
        } else {
            //gives user index of each item on the list
            //list contains a 1-base index
            for (let i = 0; i<userList.length; i++) {
                userList[i] = i+1 + '\.' + ' ' + userList[i];
            }
            //printing user's to-do list
            let printList = userList.join('\n')
            console.log(userList)
            message.reply("Here is your to-do list : \n" + printList)
        }
    },
}