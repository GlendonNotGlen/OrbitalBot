
//Importing of necesary libraries and packages
const mongodb1 = require('../database/mongodb1');
const profileSchema = require('../schemas/profile-schema');
const getNeededXp = (level) => level * level * 1000;

////Boiler-plate function to add exp to users
module.exports = {
    async execute(userId, xpToAdd, message, skipMessage) {

        await mongodb1().then(async (mongoose) => {
            try{
                //Query database and search for userId and update that id
                const result = await profileSchema.findOneAndUpdate({ userId },
                    {
                        userId,
                        $inc: { xp: xpToAdd },
                    },
                    {
                        upsert:true,
                        new: true,
                    }
                )
                //variable for user's current xp and level
                let { xp, level } = result;
                
                //Bot send message to notify gaining xp 
                if (skipMessage != true) {
                message.reply(`You have gained ${xpToAdd} xp.`);
            }
                //Needed xp to level up
                var neededXp = getNeededXp(level);

                //Keeps levelling up until the xp does not overflow
                while(xp>neededXp){
                  level++;
                  xp -= neededXp;
    
                  message.reply(`Congratulatons, you have leveled up! You are now level ${level} with ${xp} experience. You will now need ${getNeededXp(level)} xp to level up again!`);    
                  neededXp = getNeededXp(level);
                }

                //Update the profileSchema according to new level and xp
                await profileSchema.updateOne({
                    userId,
                },
                {
                    level,
                    xp,
                })
            } finally {
                //Close connection to database
              mongoose.connection.close();
            }
        })
    },
};
