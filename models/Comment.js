
const mongoose = require("mongoose");
const Schema = mongoose.Schema;






const CommentSchema = new Schema({

    content: {
        type: String,
        required: [true, "Please provide a content"],
        minLength: [10, "Please provide a content at least 10 character"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    article: {
        type: mongoose.Schema.ObjectId,
        ref: "Article",
        required: true
    },

});



CommentSchema.pre("save", async function (next) {
    const Article = require("./Article");
    if (!this.isModified("user")) return next();
    try {

        const article = await Article.findById(this.article);
        
        article.comments.push(this._id);
        article.commentsCount = article.comments.length;

        await article.save();
        return next();

        
    }
    catch (err) {
        return next(err)
    }
})
module.exports = mongoose.model("Comment", CommentSchema)