const User = require("../../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const Article = require("../../models/Article");
const Comment = require("../../models/Comment")
const PublicReq = require("../../models/PublicReq")


const checkUserExist = asyncErrorWrapper(async (req, res, next) => {



    const { id } = req.params

    const user = await User.findById(id);

    if (!user) {
        return next(new CustomError("There is no such user wiht that id", 400))
    }
    req.user = user;
    return next()
});

const checkArticleExist = asyncErrorWrapper(async (req, res, next) => {

    const article_id = req.params.id || req.params.article_id;


    const article = await Article.findById(article_id)
        .populate(
            {
                path: "user",
                select: "username profile_image"

            }
        )
        .populate(
            {
                path: "comments",
                select: "content user",
                populate: {
                    path: "user",
                    select: "username name profile_image"
                }
            }
        )


    if (!article) {
        return next(new CustomError("There is no such article wiht that id", 400))
    }
    req.article = article;
    return next()
});



const checkPublicReqExist = asyncErrorWrapper(async (req, res, next) => {
    const publicReqId = req.params.publicreqid;

    const publicReq = await PublicReq.findById(publicReqId);
    if (!publicReq) {
        return next(new CustomError("There is no such request wiht that id", 400))
    }
    req.publicReq = publicReq;


    return next()

});

const checkArticleAndCommentExist = asyncErrorWrapper(async (req, res, next) => {
    const { article_id, comment_id } = req.params;



    const comment = await Comment.findOne({
        _id: comment_id,
        article: article_id
    })
        .populate(
            {
                path: "article",
                select: "title"
            }
        )
        .populate(
            {
                path: "user",
                select: "name profile_image"
            }
        )

    if (!comment) {
        return next(new CustomError("There is no comment wiht that id associated wiht article", 400))
    }

    req.comment = comment;
    return next()

})



module.exports = {
    checkUserExist,
    checkArticleExist,
    checkPublicReqExist,
    checkArticleAndCommentExist

}
