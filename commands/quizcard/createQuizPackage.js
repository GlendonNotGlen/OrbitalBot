//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const quizcardSchema = require('../../schemas/quizcard-schema.js');

////Boiler-plate function to add exp to users
module.exports = {
    name: 'createquizpackage',
	description: 'Creates a quiz package for users.',
	aliases: ['createquiz', 'createquizcards'], //Psuedo-command that allows activation of code
	usage: 'Use \'!createquizpackage\' to activate our bot and instructions will be provided along the way.',
    async execute(message, args) {
        const questionfind = async (Answerlookout) =>{
                
                //Filter messages and listen to person to input the next video.
                const filter = m => m.author.id === message.author.id
                return message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
                    .then((collected) => {

                        if (Answerlookout == 3) {
                            if (collected.first().content == "1" || collected.first().content == "2" || collected.first().content == "3" || collected.first().content == "4"){
                                return collected.first().content;
                            }
                            message.channel.send('Select only the number that correspond to the supposed correct answer.')
                            return questionfind(3)
                        }
                        if (collected.first().content == "" || collected.first().content == undefined){
                            message.channel.send('Please do not pass in an empty string.');
                            return questionfind(2);      
                        }
                        return collected.first().content;  
                    })
            }
        
        await mongodb1().then(async (mongoose) => {
            try{
                var nameOfQuizPackage = "";
                if (args[0] == "" || args[0] == undefined || args == []) {
                    message.channel.send("Please type in a name for this quiz package! :books:");
                    nameOfQuizPackage = await questionfind(0);
                    console.log(nameOfQuizPackage);
                }else{
                    for (let i=0; i<args.length; i++){
                        nameOfQuizPackage += args[i] + " "
                    }
                }

                message.channel.send("Would you like to create your very first question (Yes/No)? :excited:")
                var yesOrNo = await questionfind(0);
                if (yesOrNo.toLowerCase() == "yes" || yesOrNo.toLowerCase() == "y"){
                    message.channel.send("What is your first question? :books:")
                    var firstQuestion = await questionfind(0);
                    var stringChoices = "";

                    message.channel.send("Question saved. What is your first answer choice?")
                    var string1 = await questionfind(2);
                    message.channel.send("First answer choice saved. Now, type your second answer choice.")
                    var string2 = await questionfind(2);
                    message.channel.send("Second answer choice saved. Now, type your Third answer choice.")
                    var string3 = await questionfind(2);
                    message.channel.send("Third answer choice saved. Now, type your Fourth answer choice.")
                    var string4 = await questionfind(2);
                    

                    stringChoices = "Fourth answer choice saved. Select the number corresponding to the right answer! :smile: \n"
                    stringChoices = stringChoices + "1. " + string1 + "\n";
                    stringChoices = stringChoices + "2. " + string2 + "\n";
                    stringChoices = stringChoices + "3. " + string3 + "\n";
                    stringChoices = stringChoices + "4. " + string4 + "\n";
                    message.channel.send(stringChoices);
                    var answerString = await questionfind(3);

                    //Query database and search for userId and update that id
                    const result = await quizcardSchema.findOneAndUpdate(
                        {
                            userId: message.member.id,
                            packageName: nameOfQuizPackage,
                        },
                        {
                            userId: message.member.id,
                            packageName: nameOfQuizPackage,
                            $inc : {
                                quizQuestionAmount: 1,
                            },
                            $push : {
                                quiz : [{
                                    quizQuestion: firstQuestion,
                                    quizAnswers: [string1, string2, string3, string4],
                                    quizRightAnswer: answerString,
                                }],
                            }
                        },
                        {
                            upsert:true,
                            new: true,
                        }
                    )
                    let { quiz } = result;
                    /*var quizSelected = {
                        "quizQuestion": nameOfQuizPackage,
                    
                        "quizAnswers": [string1, string2, string3, string4],
                    
                        "quizRightAnswer": answerString,
                    }
                    console.log(quizSelected);
                    await quiz.push(quizSelected);*/
                    console.log(quiz);
                    /*await quizcardSchema.findOneAndUpdate(
                        {
                            userId: message.member.id,
                            packageName: nameOfQuizPackage,
                        },
                        {
                            userId: message.member.id,
                            packageName: nameOfQuizPackage,
                            quiz: quizcardSchema,
                        },
                        {}
                    )*/
                    message.channel.send("First quiz package and first question created! All the best! :smile: ");
                }else{
                    const result = await quizcardSchema.findOneAndUpdate(
                        {
                            userId: message.member.id,
                            packageName: nameOfQuizPackage,
                        },
                        {
                            userId: message.member.id,
                            packageName: nameOfQuizPackage,
                        },
                        {
                            upsert:true,
                            new: true,
                        }
                    )
                    console.log(result);
                message.channel.send("Quiz package created, if you would like to add a quiz into the package, type \'!addQuiz\' anytime! :smile:");
                }
            } finally {
                //Close connection to database
              
            }
            
        })
    },
};
