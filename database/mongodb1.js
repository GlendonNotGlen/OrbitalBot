const mongodb1 = require('mongoose');
const { prefix, BOT_TOKEN, PASSWORD, PATHWAY } = require("../config.json");

module.exports = 
    async ()=>{
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology:true,
            autoIndex: false,
            poolSize:5,
            connectTimeoutMS: 5000,
            family:4,
            useFindAndModify: false
        };

        await mongodb1.connect(PATHWAY, dbOptions);
        return mongodb1;


        await mongodb1.set('useFindAndModify', false);
        mongodb1.Promise = global.Promise;

    }
