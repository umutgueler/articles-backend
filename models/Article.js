const mongoose = require("mongoose");
const slugify = require("slugify")
const Schema = mongoose.Schema;
const cloudinary = require('cloudinary').v2;
const path = require("path")
const Comment = require("./Comment")


const fs = require("fs")
const ArticleSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please provide a title"],
        minLength: [6, "Please provide a title at least 6 characters"],
        unique: true
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minLength: [10, "Please provide a title at least 10 characters"],


    },
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minLength: [12, "Please provide a title at least 20 characters"]
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    images: {
        type: String,
        default: "https://res.cloudinary.com/dvdf3jgf9/image/upload/v1672000557/articles/ArticleImages/default_article_xvj1cx.png"
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    files: [{

        type: String
    }
    ],
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: "Comment"
    }],
    commentsCount: {
        type: Number,
        default: 0
    },
    category: {
        type:String,
        enum:["Science","History","Technology","Literature","Psychology","Philosophy"]
    }



});
ArticleSchema.post("remove", async function () {



    if (this.images === "https://res.cloudinary.com/dvdf3jgf9/image/upload/v1672000557/articles/ArticleImages/default_article_xvj1cx.png") {
        return
    }
    await cloudinary.uploader.destroy(`Articles/ArticleImages/articleImage_${this._id}`);


    const rootDir = path.dirname(require.main.filename);

    const removeFolder = path.join(rootDir, "public", "uploads", "articles", String(this._id));


    let removeFiles;
    try {
        removeFiles = fs.readdirSync(removeFolder);
    }
    catch {
        return
    }



    if (removeFiles) {
        removeFiles.forEach(file => {
            const removeFile = path.join(removeFolder, file);

            fs.unlinkSync(removeFile)
        })
    }

    fs.rmdirSync(removeFolder)



})
ArticleSchema.pre("save", function (next) {

    if (!this.isModified("name")) {

        return next();
    };

    this.slug = makeSlug(this.name);
    return next();
});
ArticleSchema.pre("findOneAndUpdate", function (next) {

    if (!this._update.name) {

        return next();
    };

    this._update.slug = makeSlug(this._update.name);
    return next();
});

ArticleSchema.post("remove", async function () {

    await Comment.deleteMany({
        article: this._id
    })
})


const makeSlug = name => {
    return slugify(name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'tr',       // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })
}

module.exports = mongoose.model("Article", ArticleSchema);

