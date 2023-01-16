const mongoose = require("mongoose");
const CustomError = require("../helpers/error/CustomError");
const sendEmail = require("../helpers/libraries/sendEmail")
const Schema = mongoose.Schema;



const PublicReqSchema = new Schema({


    name: {
        type: String,
        require: true

    },
    email: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    readed: {
        type: Number,
        default: 1
    },
});

PublicReqSchema.pre("save", async function (next) {

    
    const email = this.email;
    const userName = this.name;
    const emailTemplate = `
    <style>
    #navbar{
        font-size: 1.25rem;
        
        font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        

        margin:auto

    }
    a{
        text-decoration: none;
        
    }
    a:visited{
        text-decoration: none;
        color: white;
    }
</style>
<div style=" background-color: rgb(33, 37, 41);color:white;">
    <div id = "navbar">
        <h1>Articles</h1>

    </div>
    <hr>
    <div>
        <p>
            <h3>Dear ${userName},</h3>
            We have received your request, we will get back to you as soon as possible.
            <br>
            <br>
            <h3><a href="https://articles-gold.vercel.app/">Articles</a></h3>
            <br>
            <br>
            
        </p>
    </div>
    
</div>
    `

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Articles",
            html: emailTemplate
        });

        return next()
    }
    catch (err) {
        console.log(err)
        return next(new CustomError("Email Could Not Be Send", 500))
    };

});

module.exports = mongoose.model("PublicReq", PublicReqSchema);