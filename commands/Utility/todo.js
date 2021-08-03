const mongodb1 = require('../../database/mongodb1.js') //link to database
const profileSchema = require('../../schemas/profile-schema') //link to profile schema

module.exports = {
    name: 'todo',
    description: 'Adds to the list of to-do. Use !list to view current list.',
    usage: 'Input \'!todo <task>\' to add task to the list. This command adds from the bottom of the list up. You can only add in 1 task per command',
    async execute(message, args) {
        if (!args[0]) {
            //invalid input by user
            console.log("User did not specify task")
            return message.reply("Please state the task you would like to add to your to-do list")
        } else {
            let task = args.join(' ') //join given task into 1 string
            console.log("Updating list")
            await mongodb1().then(async (mongoose) => {
                try {
                    console.log('Connected to MongoDB for to-do list')
                    //adding given task to the bottom of to-do list via $push
                    await profileSchema.findOneAndUpdate({userId : message.member.id }, { $push : { toDoList : task } }, { upsert : true })
                    console.log("List is updated successfully")
                } finally {
                    console.log('Closing connection to MongoDB')
                    mongoose.connection.close()
                }
            })
            message.reply("Successfully added task to your to-do list")
        }
    },
}