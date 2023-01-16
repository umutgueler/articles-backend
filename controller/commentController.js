const Article = require("../models/Article");
const Comment = require("../models/Comment");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const addNewCommentToArticle = asyncErrorWrapper(async (req, res, next) => {

    const {article_id}=req.params;

    const user_id=req.user.id;

    const information=req.body;
    
    const comment=await Comment.create({
        ...information,
        article : article_id,
        user : user_id
    });

    return res
    .status(200)
    .json({
        success:"true",
        data:comment
    });
});

const getAllCommentsByArticle = asyncErrorWrapper(async (req, res, next) =>{

    const {article_id}=req.params;

    const article=await Article.findById(article_id).populate("comments");

    

    return res
    .status(200)
    .json({
        success:true,
        data:article
    });
});

const getSingleComment = asyncErrorWrapper(async (req, res, next) =>{

    

    const comment = req.comment;

    return res
    .status(200)
    .json({
        success:true,
        data:comment
    });

});

const editComment=asyncErrorWrapper(async (req, res, next) =>{
    
    const comment=req.comment;
    const {content}=req.body;

    comment.content=content;

    await comment.save()

    res.json({
        success:true,
        data:comment
    })
});

const deleteComment =asyncErrorWrapper(async (req, res, next) =>{


    const comment=req.comment;
    const article=req.article;
    
    
    comment.remove();
    

    article.comments.splice(article.comments.indexOf(comment.id),1);
    article.commentsCount=article.comments.length;

    await article.save();

    return res
    .status(200)
    .json({
        success:true,
        message:"Delete operation is successful"
    })
})

module.exports={
    addNewCommentToArticle,
    getAllCommentsByArticle,
    getSingleComment,
    editComment,
    deleteComment
}