const express=require("express");
const { getAccessToRoute,getCommentOwnerAccess } = require("../middlewares/authorization/authMid");
const {addNewCommentToArticle,getAllCommentsByArticle,getSingleComment,editComment,deleteComment}=require("../controller/commentController");
const {checkArticleAndCommentExist} = require("../middlewares/database/databaseErrorHelpers");

const router=express.Router({mergeParams:true});



router.post("/",getAccessToRoute,addNewCommentToArticle);
router.get("/",getAllCommentsByArticle); 
router.get("/:comment_id",checkArticleAndCommentExist,getSingleComment);
router.put("/:comment_id/edit",[checkArticleAndCommentExist,getAccessToRoute,getCommentOwnerAccess],editComment);
router.delete("/:comment_id/delete",[checkArticleAndCommentExist,getAccessToRoute,getCommentOwnerAccess],deleteComment);
module.exports=router;
