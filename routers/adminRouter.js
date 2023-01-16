const express = require("express");
const {getAccessToRoute,getAdminAccess}=require("../middlewares/authorization/authMid");
const {blockUser,deleteUser,editUser,imageUploadAdmin,getAllUsers,getAllUserReqs,getAllUsersUserReqs,downloadFileAdmin,getAllPublicReq,getSinglePublicReq,deletePublicReq,deleteAllPublicReq}=require("../controller/adminControllers");
const {checkUserExist,checkArticleExist,checkPublicReqExist} = require("../middlewares/database/databaseErrorHelpers");
const {getUser}=require("../controller/authController")
const profileImageUpload=require("../middlewares/libraries/profileImageUpload")



const {editArticle,articleImageUpload,deleteArticle,articleFilesUpload,deleteFile}=require("../controller/articleController")

const router = express.Router();


router.use([getAccessToRoute,getAdminAccess]);
//User
router.get("/user/block/:id",checkUserExist,blockUser);
router.delete("/user/delete/:id",checkUserExist,deleteUser);
router.get("/user/profile/:id", checkUserExist,getUser);
router.put("/user/edit/:id",checkUserExist,editUser);
router.post("/user/upload/:id",checkUserExist,profileImageUpload,imageUploadAdmin);
router.get("/user",getAllUsers);


//Article

router.put("/article/:id/edit", checkArticleExist,editArticle,articleImageUpload,articleFilesUpload);
router.delete("/article/:id/delete",checkArticleExist, deleteArticle);
router.put("/:id/deletefile", checkArticleExist,deleteFile);


//PublicReq

router.get("/publicreq",getAllPublicReq);
router.get("/publicreq/:publicreqid",checkPublicReqExist,getSinglePublicReq);

router.delete("/publicreq/:publicreqid",checkPublicReqExist,deletePublicReq);

router.delete("/publicreq",deleteAllPublicReq);

module.exports=router;