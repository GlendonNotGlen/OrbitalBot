//Importing of necesary libraries and packages
const mongodb1 = require('../../database/mongodb1');
const quizcardSchema = require('../../schemas/quizcard-schema.js');

module.exports = {
    name: 'deletequizpackage',
    description: 'Removes a quiz package from the user\'s existing list of quiz packages.',
	aliases: ['changequiz', 'edittingquiz'], //Psuedo-command that allows activation of code
	usage: 'Use \'!deletequizpackage 1\' to remove the first quiz package on the user\'s database. Use \'!listQuizPackage to view the index of your quiz packages\'',
    async execute(message, args) {

        const receivingUserInput = async () =>{
                const filter = m => m.author.id === message.author.id
                return message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
                    .then((collected) => {
                        //Not number
                        if (isNaN(collected.first().content)){
                            message.channel.send('Please select only the number corresponding to the package to be deleted. :smile:')
                            return receivingUserInput();
                        }
                        return collected.first().content;
                    })
            }
        
        await mongodb1().then(async (mongoose) => {
            try{
                var listOfQuizzes = "Select the number corresponding to the quiz pack that you would like deleted. :frown:\n";
                const result = await quizcardSchema.find({
                    userId:message.member.id,
                })
                console.log(result + "hi");
                if(result.length == 0){
                    listOfQuizzes = `You do not have any quiz packages to delete. Type \'!Createquiz <Package_name>\' to create a quiz package today! :smile:`
                }else{
                    for (let i=0; i<result.length; i++){
                        listOfQuizzes = listOfQuizzes + `${i+1}: ${result[i]['packageName']}. \n`
                    }
                }
                message.channel.send(listOfQuizzes);

                var packageToEdit = result[parseInt(await receivingUserInput("findPackageNumber")) -1]['packageName'];
                if (packageToEdit == undefined) return message.reply('This package is not available.');

                //Query database and search for userId and update that id
                const result2 = await quizcardSchema.deleteOne(
                    {
                        userId: message.member.id,
                        packageName: packageToEdit,
                    },
                )
                let { quiz } = result2;
                console.log(quiz);
                message.channel.send("The quiz package has been deleted! :smile:")
                
            } finally {
            }
            
        })
    },
};