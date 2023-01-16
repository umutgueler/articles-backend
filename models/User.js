const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Article = require("./Article");


const fs = require("fs");
const path = require("path")
const Comment = require("./Comment")



const UserScehma = new Schema({

    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    username: {
        type: String,
        minLength: [4, 'Username must be at least 4'],
        required: [true, "Please provide a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide valid email"
        ],
        unique: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        minLength: [6, "Please provide a password with min lenght 6"],
        required: [true, "Please provide a password"],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    profile_image: {
        type: String,
        default: "https://res.cloudinary.com/dvdf3jgf9/image/upload/v1672002379/articles/ProfileImages/default-profile-pic-e1513291410505_ddphd5.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: String,
        select: false
    }

});

//User Schema Method

UserScehma.methods.generateJwtFromUser = function () {

    const payload = {
        id: this._id,
        name: this.name,
        username: this.username,
        role: this.role
    };

    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });

    return token;

};
UserScehma.methods.getResetPasswordTokenFromUser = function () {
    const randomHexString = crypto.randomBytes(16).toString("hex");
    const { RESET_PASSWORD_EXPIRE } = process.env;

    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex")

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;

}
//Pre Hooks
UserScehma.pre("save", function (next) {
    if (!this.isModified("password")) {
        next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err)
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err)
            this.password = hash;
            next()
        });
    });
});
UserScehma.pre("findOneAndUpdate", function (next) {
    if (!this._update.password) {
        next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err)
        bcrypt.hash(this._update.password, salt, (err, hash) => {
            if (err) next(err)
            this._update.password = hash;
            next()
        });
    });
});

UserScehma.post("remove", async function () {

    const articles = await Article.find({
        user: this._id
    });

    articles.forEach(async function (article) {
        await article.remove();
    });

    
    await Article.updateMany(
        { likes:this._id},
        { $pull: { likes: this._id } , $inc : {likesCount:-1}}
    )
    
    await Comment.deleteMany({
        user: this._id
    })

    if (this.profile_image != "https://res.cloudinary.com/dvdf3jgf9/image/upload/v1672002379/articles/ProfileImages/default-profile-pic-e1513291410505_ddphd5.jpg") {
        await cloudinary.uploader.destroy(`Articles/ProfileImages/profileImage_${this._id}`);
    }


})




module.exports = mongoose.model("User", UserScehma);

