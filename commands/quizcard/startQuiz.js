//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const { prefix } = require('../../config.json');
const quizcardSchema = require('../../schemas/quizcard-schema.js');

module.exports = {
    name: 'startquiz',
    description: 'List all of my commands or info about a specific command.',
	aliases: ['addquizzes' ], //Psuedo-command that allows activation of code
	usage: '!help [command name]',
    async execute(message, args) {

        const getRandomNumber = (max) => {return Math.floor(Math.random() * max)};
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
                            if (collected.first().content == "1" || collected.first().content == "2" || collected.first().content == "3" || collected.first().content == "4" || collected.first().content == "endquiz"){
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
                var listOfQuizzes = "Select the number corresponding to the quiz pack that you would like to be tested on.\n";
                const quizPackageToAddTo = await quizcardSchema.find({
                    userId:message.member.id,
                })
                console.log(quizPackageToAddTo + "hi");
                if(quizPackageToAddTo.length == 0){
                    return message.channel.send(`You do not have any ongoing quiz packages to get tested on. Type \'!Createquiz <Package_name>\' to create a quiz package today! :smile:`);
                }else{
                    for (let i=0; i<quizPackageToAddTo.length; i++){
                        listOfQuizzes = listOfQuizzes + `${i+1}. ${quizPackageToAddTo[i]['packageName']}.\n`
                    }
                }
                message.channel.send(listOfQuizzes);
                if (quizPackageToAddTo.length >= 1){
                    var packageTested = quizPackageToAddTo[parseInt(await receivingUserInput("findPackageName"))-1]['packageName'];
                    console.log(packageTested);
                }
                console.log(packageTested);
            
                

                const quizPackageToGetTestedOn = await quizcardSchema.findOne({
                    userId: message.member.id,
                    packageName: packageTested,
                })

                if (quizPackageToGetTestedOn != undefined || quizPackageToGetTestedOn != null){
                var userInput = "";
                var numberOfQuizzes = 1;
                if ((quizPackageToGetTestedOn['quiz']).length != 0){
                    message.channel.send('Preparing your first question... ');
                }
                while(userInput != "endquiz" && numberOfQuizzes != 0){
                    numberOfQuizzes = (quizPackageToGetTestedOn['quiz']).length;
                    if (numberOfQuizzes != 0){
                        var getRandomIndex = await getRandomNumber(numberOfQuizzes);
                        console.log(getRandomIndex + " hello");
                        var correctAnswer = await quizPackageToGetTestedOn['quiz'][getRandomIndex]['quizRightAnswer'];
                        var questionString = 'Qn: '+ await quizPackageToGetTestedOn['quiz'][getRandomIndex]['quizQuestion'] + "\n";
                        for (let i=0; i<4; i++){
                            questionString =  questionString + `${i+1}. ` + quizPackageToGetTestedOn['quiz'][getRandomIndex]['quizAnswers'][i] + ".\n";
                        }
                        message.channel.send(questionString);

                        userInput = await receivingUserInput("findCorrectAnswer");
                        if (userInput!="endquiz" && userInput == correctAnswer){
                            message.channel.send('Congratulations, you got that answer right! :smile: \nRemember, you can end the quiz session by typing \'endquiz\'! In the meantime, generating the next question...');
                        }else if(userInput!="endquiz" && userInput != correctAnswer){
                            message.channel.send(`The answer for that question is ${correctAnswer}. It's okay, there is always next time, we can review our notes again! :books:\nRemember, you can end the quiz session by typing \'endquiz\'!\n\n`)
                        }
                    }else if(numberOfQuizzes == 0){
                        message.channel.send('This package does not have any quiz questions. You can add more question by typing \'!addquiz\'.')
                    }
                }
                message.channel.send('Quiz session has ended. Let\'s play again next time! :smile:');
            }
            } finally {
            }
            
        })
    },
};