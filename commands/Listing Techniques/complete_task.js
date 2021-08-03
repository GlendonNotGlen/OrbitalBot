//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const onethreefiveSchema = require('../../schemas/1-3-5-schema.js');

////Boiler-plate function to add exp to users
module.exports = {
    name: 'complete135task',
    description: 'Removes a specific task off of the user\'s 1-3-5 priority list.',
	aliases: ['complete1-3-5task', 'completed1-3-5tasks', 'completed135tasks', 'complete135tasks', 'complete1-3-5tasks' ], //Psuedo-command that allows activation of code
	usage: 'Use \'!complete135task medium 2\' to remove the second medium task off of the user\'s 1-3-5 list.',
    async execute(message, args) {

        await mongodb1().then(async (mongoose) => {
            try{
                var counter = 0;
                var listOftasks = "Please specify the number corresponding to the task that you have completed. Type \'!complete135task <category: small, medium, big> <task number>\'.:smile: \n";
                const taskings = await onethreefiveSchema.findOne({
                    userId:message.member.id,
                },)
                
                var mediumTaskings = taskings['mediumTasks'];
                var littleTaskings = taskings['littleTasks'];
                var bigTasking = taskings['bigTask'];

                if(taskings['bigTask'] == "" && taskings['mediumTasks'] == [] && taskings['littleTasks'] == []){
                    listOftasks = `You have either not turn on / engaged the 1-3-5 studying technique before, or completed the previous session! Start again today by typing \'!1-3-5\'. :smile:`
                }else{
                    if (taskings['bigTask'] != ""){
                        counter += 1;
                        listOftasks = listOftasks + `\nBig tasks: \n ${counter}. ${taskings['bigTask']}\n`;
                    }else{
                        listOftasks += `Big tasks: \n`
                    }
                    listOftasks = listOftasks + `\nMedium tasks: \n `
                    for (let i=0; i<taskings['mediumTasks'].length; i++){
                        counter += 1;
                        listOftasks = listOftasks + `${i+1}: ${taskings['mediumTasks'][i]}. \n`
                    }
                    listOftasks =  listOftasks + `\nSmall tasks: \n `
                    for (let i=0; i<taskings['littleTasks'].length; i++){
                        counter+=1;
                        listOftasks = listOftasks + `${i+1}: ${taskings['littleTasks'][i]}. \n`
                    }

                    if (args[0] != "small" && args[0] != "medium" && args[0] != "big"){
                        return message.channel.send("Please specify only 'small', 'medium' or 'large' category. Type \'!complete135task <category: small, medium, big> <task number>\'.:smile: \n");
                    } 
                    if (parseInt(args[1]) > counter){
                        return message.channel.send("Please specify a number that corresponds to a task above. Type \'!complete135task <category: small, medium, big> <task number>\'.:smile: \n");
                    }

                    counter -=1;
                    if (counter != -1){
                        if (args[0] == "small"){
                            littleTaskings.splice(args[1], 1);
                        }else if (args[0] == "medium"){
                            mediumTaskings.splice(args[1],1);
                        }else if (args[0] == "big"){
                            bigTasking = "";
                        }
                    }

                    await onethreefiveSchema.findOneAndUpdate(
                        {
                            userId: message.member.id,
                        },
                        {
                            userId: message.member.id,
                            bigTask: bigTasking,
                            mediumTasks: mediumTaskings,
                            littleTasks: littleTaskings,
                        },
                        {}
                    )

                    message.channel.send(`${args[0]} task, ${args[1]}, has been successful completed!`)
                }
                message.channel.send(listOftasks);


            } finally {
                
            }
            
        })
    },
};