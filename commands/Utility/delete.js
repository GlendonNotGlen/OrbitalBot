const mongodb1 = require('../../database/mongodb1') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema

module.exports = {
    name: 'delete',
    description: 'Removes the given task number on the user\'s to-do list.',
    aliases: ['remove'], //Pseudo-name to initiate this function
    usage: 'Input \'!delete 2\' to remove task 2 on your to-do list. You may only remove 1 task at a time',
    async execute(message, args) {
        //error handling for invalid commands
        if (!args[0]) {
            console.log("User did not input a number")
            return message.reply("Please state the task number you would like to remove")
        } else if (args[1]) {
            console.log("User input more than 1 number")
            return message.reply("Please remove only 1 task at a time")
        } else if (isNaN(args[0])) {
            //isNaN checks the argument if it is a number, returns true if it isn't a number, false if it is a number
            console.log("User did not input a valid number")
            return message.reply("Please state a number after !delete. Use !help delete for more information")
        }

        //retrieving user profile from database
        let searchResult
        await mongodb1().then(async (mongoose) => {
            try {
                console.log('Connected to MongoDB for printing to-do list')
                searchResult = await profileSchema.findOne({ userId: message.member.id })              
            } finally {
                console.log('Closing connection to MongoDB')
                mongoose.connection.close()
            }
        })
        //error handling for empty list or invalid number
        if (searchResult.toDoList.length == 0) {
            console.log("User's to-do list is empty!")
            return message.reply("Your to-do list is already empty! Use !todo <task> to add tasks to your to-do list")
        } else if (args[0] > searchResult.toDoList.length) {
            console.log("User input an invalid task number")
            return message.reply(`Please input a number between 1 and ${searchResult.toDoList.length}`)
        }
        let index = args[0] - 1 //the index to be removed
        let userList = searchResult.toDoList
        userList.splice(index, 1) //removing specified task from list
        //reinserting edited list back to database
        await mongodb1().then(async (mongoose) => {
            try {
                console.log('Connected to MongoDB to remove from to-do list')
                await profileSchema.findOneAndUpdate({ userId: message.member.id }, {
                    $set: { toDoList : userList },
                }) 
                console.log(`Index of ${index} successfully removed from User's to-do list`)
            } finally {
                console.log('Closing connection to MongoDB')
                mongoose.connection.close()
            }
        })
        return message.reply(`Task ${args[0]} have been successfully removed from your list`)
    }
}