//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const { prefix } = require('../../config.json');
const oneThreeFiveSchema = require('../../schemas/1-3-5-schema.js');

////Boiler-plate function to add exp to users
module.exports = {
    name: '1-3-5',
    description: 'List all of my commands or info about a specific command.',
	aliases: ['135', 'start1-3-5', 'start135' ], //Psuedo-command that allows activation of code
	usage: '!help [command name]',
    async execute(message, args) {
        
        await mongodb1().then(async (mongoose) => {
            
            const receivingUserInput = async (inputReason) =>{
                
                var flexibleMessageString = "";
                if (inputReason == "bigtask"){
                    flexibleMessageString = "A Big task";
                }else if (inputReason == "mediumtask"){
                    flexibleMessageString = "A Medium task";
                }else if (inputReason == "littleTask"){
                    flexibleMessageString = "A Little task";
                }
                    //Filter messages and listen to person to input the next video.
                const filter = m => m.author.id === message.author.id
                return message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
                    .then((collected) => {
                        if (inputReason == "yesOrNo"){
                            return collected.first().content.toString();
                        }
                        if (collected.first().content != ""){
                            message.channel.send(`${flexibleMessageString} has been successfully recorded. :smile:`);
                            return collected.first().content.toString();
                        }
                        message.channel.send('Please do not pass in an empty string, try again');
                        return receivingUserInput(inputReason);
                    })
            }
            
            try{
                var listOfMediumTask = [];
                var listOflittleTask = [];
                message.channel.send("Start a new round of 1-3-5 studying technique? (Yes/No) \nDisclaimer: All previous 1-3-5 studying record taskings will be erased. :cry:")
                
                var yesOrNo = await receivingUserInput("yesOrNo");

                if (yesOrNo.toLowerCase() == "yes" || yesOrNo.toLowerCase() == "y"){
                message.channel.send('Please input a big task, followed by 3 medium ones and 5 little ones to begin the session. :smile:')
                var bigtask = await receivingUserInput("bigtask");
                console.log(bigtask);
                for (let i=0; i<3; i++){
                    var mediumtask = await receivingUserInput("mediumtask");
                    listOfMediumTask.push(mediumtask);
                }
                console.log(mediumtask);
                for (let i=0; i<5; i++){
                    var littleTask = await receivingUserInput("littleTask");
                    listOflittleTask.push(littleTask);
                }
                console.log(listOfMediumTask);
                console.log(listOflittleTask);
                //Query database and search for userId and update that id
                const updated135 = await oneThreeFiveSchema.findOneAndUpdate(
                    {
                        userId: message.member.id,
                    },
                    {
                        userId: message.member.id,
                        bigTask: bigtask,
                        mediumTasks: listOfMediumTask,
                        littleTasks: listOflittleTask,
                    },
                    {
                        upsert:true,
                        new: true,
                    }
                )
                console.log(updated135['mediumTasks']);
                console.log(updated135['littleTasks']);
                var stringToChannelMessage = "Your tasking for today includes \n";
                stringToChannelMessage = stringToChannelMessage + "Big Task: \n" + updated135['bigTask'] + "\n";
                stringToChannelMessage =  stringToChannelMessage + "\n" + "Medium Tasks: \n";
                for (let i=0; i<listOfMediumTask.length; i++){
                    stringToChannelMessage = stringToChannelMessage + `${i+1}. ` + updated135['mediumTasks'][i] + "\n";
                }
                stringToChannelMessage = stringToChannelMessage + "\n" + "Little Tasks: \n";
                for (let i=0; i<listOflittleTask.length; i++){
                    stringToChannelMessage =  stringToChannelMessage + `${i+1}. ` +updated135['littleTasks'][i] + "\n";
                }    
                message.channel.send(stringToChannelMessage);
            }else{
                message.channel.send('It\'s okay to take a break once in a while. Have plenty of rest! :heart:')
            }
            } finally {
                
            }
            
        })
    },
};