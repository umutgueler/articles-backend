const mongosee = require("mongoose");

const connectDatabase = () => {
    mongosee.connect(process.env.MONGO_URL)
    .then(()=>{
        
    })
    .catch(err=>{
        console.error(err)
    })
}


module.exports = connectDatabase;