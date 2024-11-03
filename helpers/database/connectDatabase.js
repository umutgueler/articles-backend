const mongosee = require("mongoose");

const connectDatabase = () => {
    mongosee.connect(process.env.MONGO_URL,{dbName:'articles'})
    .then(()=>{
        
    })
    .catch(err=>{
        console.error(err)
    })
}


module.exports = connectDatabase;