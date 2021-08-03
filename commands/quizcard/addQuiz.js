//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const { prefix } = require('../../config.json');
const quizcardSchema = require('../../schemas/quizcard-schema.js');

////Boiler-plate function to add exp to users
module.exports = {
    name: 'addquiz',
    description: 'List all of my commands or info about a specific command.',
	aliases: ['addquizzes' ], //Psuedo-command that allows activation of code
	usage: '!help [command name]',
    async execute(message, args) {

        const receivingUserInput = async (inputReason) =>{
                    //Filter messages and listen to person to input the next video.
                const filter = m => m.author.id === message.author.id
                return message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
                    .then((collected) => {
                        if (inputReason == "findPackageNumber") {
                            //Not number
                            console.log(collected.first().content);
                            console.log(parseInt(collected.first().content) + 1);
                            if (isNaN(collected.first().content)){
                                message.channel.send('Please select a number corresponding to the right answer. :smile:')
                                return receivingUserInput("findPackageNumber");
                            }
                            return parseInt(collected.first().content.toString());
                        } else if (inputReason == "findCorrectAnswer"){
                            if (collected.first().content == "1" || collected.first().content == "2" || collected.first().content == "3" || collected.first().content == "4"){
                                return collected.first().content;
                            }
                                message.channel.send('Please select a number that corresponds to one of the choices. :smile:')
                                return receivingUserInput("findCorrectAnswer");
                        }

                        if (collected.first().content != ""){
                            return collected.first().content.toString();
                        }
                        message.channel.send('Please do not pass in an empty string');
                        return receivingUserInput(inputReason);
                    })
            }
        
        await mongodb1().then(async (mongoose) => {
            try{
                var listOfQuizzes = "Select the number corresponding to the quiz pack that you would like quizzes added to.\n";
                const quizPackageToAddTo = await quizcardSchema.find({
                    userId:message.member.id,
                })
                console.log(quizPackageToAddTo + "hi");
                if(quizPackageToAddTo.length == 0){
                    return message.reply(`You do not have any ongoing quiz packages to edit. Type \'!Createquiz <Package_name>\' to create a quiz package today! :smile:`);
                }else{
                    for (let i=0; i<quizPackageToAddTo.length; i++){
                        listOfQuizzes = listOfQuizzes + `${i+1}: ${quizPackageToAddTo[i]['packageName']}. \n`
                    }
                }
                message.channel.send(listOfQuizzes);
                if (quizPackageToAddTo.length >= 1){
                    var packageToEdit = quizPackageToAddTo[parseInt(await receivingUserInput("findPackageName"))-1]['packageName'];
                    console.log(packageToEdit);
                }
                console.log(packageToEdit);
                if (packageToEdit == undefined) return message.reply('This package is not available. :frown:');
                message.channel.send('Input a question for this quiz! :smile:');
                var questionOfQuiz = await receivingUserInput('inputQuizTitle');
                
                message.channel.send('Quiz title saved. Add 4 answer choices for this question!')
                var answerChoice1 = await receivingUserInput("inputAnswerChoice");
                message.channel.send('First answer choice saved. :smile:')
                var answerChoice2 = await receivingUserInput("inputAnswerChoice");
                message.channel.send('Second answer choice saved. :smile:')
                var answerChoice3 = await receivingUserInput("inputAnswerChoice");
                message.channel.send('Third answer choice saved. :smile:')
                var answerChoice4 = await receivingUserInput("inputAnswerChoice");

                stringOfChoices = "Last answer choice saved. :smile: \nThis is your 4 answer choices. Key in the number corresponding to the right answer. :smile: \n"
                stringOfChoices = stringOfChoices + "1. " + answerChoice1 + "\n";
                stringOfChoices = stringOfChoices + "2. " + answerChoice2 + "\n";
                stringOfChoices = stringOfChoices + "3. " + answerChoice3 + "\n";
                stringOfChoices = stringOfChoices + "4. " + answerChoice4;
                message.channel.send(stringOfChoices);
                var answerString = await receivingUserInput("findCorrectAnswer");

                //Query database and search for userId and update that id
                const result2 = await quizcardSchema.findOneAndUpdate(
                    {
                        userId: message.member.id,
                        packageName: packageToEdit,
                    },
                    {
                        userId: message.member.id,
                        packageName: packageToEdit,
                        $inc : {
                            quizQuestionAmount: 1,
                        },
                        $push : {
                            quiz : [{
                                quizQuestion: questionOfQuiz,
                                quizAnswers: [answerChoice1, answerChoice2, answerChoice3, answerChoice4],
                                quizRightAnswer: answerString,
                              }],
                        }
                    },
                    {
                        upsert:true,
                        new: true,
                    }
                )
                let { quiz } = result2;
                console.log(quiz);
                message.channel.send("Quiz has been successfully added to the package.")
            } finally {
            }
            
        })
    },
};