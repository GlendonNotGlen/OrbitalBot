//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const onethreefiveSchema = require('../../schemas/1-3-5-schema.js');

////Boiler-plate function to add exp to users
module.exports = {
    name: 'show135',
    description: 'Prints out the user\'s current 1-3-5 list.',
	aliases: ['list1-3-5', 'list135', 'show1-3-5'], //Psuedo-command that allows activation of code
    async execute(message, args) {
        
        await mongodb1().then(async (mongoose) => {
            try{
                var listOftasks = "These are your ongoing tasks! All the best, you can do it! :smile: \n";
                const taskings = await onethreefiveSchema.findOneAndUpdate({
                    userId:message.member.id,
                },
                {
                    userId: message.member.id
                },
                {
                    upsert: true,
                    new: true,
                }
                )
                console.log(taskings + "hi");
                if(taskings['bigTask'] == "" && taskings['mediumTasks'] == [] && taskings['littleTasks'] == []){
                    listOftasks = `You have not turned on and engaged the 1-3-5 studying technique! Start today by typing \'!1-3-5\'. :smile:`
                }else{
                    if (taskings['bigTask']){
                        listOftasks = listOftasks + `Big tasks: \n 1. ${taskings['bigTask']} \n`;
                    }else{
                        listOftasks = listOftasks + `Big tasks: \n`;
                    }
                    listOftasks = listOftasks + `\n Medium tasks: \n `
                    for (let i=0; i<taskings['mediumTasks'].length; i++){
                        listOftasks = listOftasks + `${i+1}: ${taskings['mediumTasks'][i]}. \n`
                    }
                    listOftasks =  listOftasks + `\n Small tasks: \n `;
                    for (let i=0; i<taskings['littleTasks'].length; i++){
                        listOftasks = listOftasks + `${i+1}: ${taskings['littleTasks'][i]}. \n`
                    }
                }
                message.channel.send(listOftasks);
                
            } finally {
    
            }
            
        })
    },
};