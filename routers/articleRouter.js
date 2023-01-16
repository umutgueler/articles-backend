const express = require("express");
const { getAllUserArticle, getAllArticles, addNewArticle, getSingleArticle, editArticle, deleteArticle, likeArticle, articleImageUpload, articleFilesUpload, deleteFile, downloadFile} = require("../controller/articleController");
const { getAccessToRoute, getArticleOwnerAccess } = require("../middlewares/authorization/authMid")
const { checkArticleExist } = require("../middlewares/database/databaseErrorHelpers");
const articleQueryMiddleware = require("../middlewares/query/articleQueryMiddleware");
const Article = require("../models/Article");


const commentRouter=require("./commentRouter")
const router = express.Router();





router.get("/", articleQueryMiddleware(Article   
), getAllArticles)
router.get("/userarticles", getAccessToRoute, getAllUserArticle)
router.get("/:id", checkArticleExist, getSingleArticle);
router.get("/:id/like", [getAccessToRoute, checkArticleExist], likeArticle)
router.post("/add", getAccessToRoute, addNewArticle, articleImageUpload, articleFilesUpload)
router.put("/:id/edit", [getAccessToRoute, checkArticleExist, getArticleOwnerAccess], editArticle, articleImageUpload, articleFilesUpload);
router.delete("/:id/delete", [getAccessToRoute, checkArticleExist, getArticleOwnerAccess], deleteArticle);
router.put("/:id/deletefile", [getAccessToRoute, checkArticleExist, getArticleOwnerAccess], deleteFile);
router.post("/:id/downloadfile/",checkArticleExist,downloadFile);

router.use("/:article_id/comment",checkArticleExist,commentRouter)



module.exports = router;