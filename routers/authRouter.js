const express = require("express");
const { register, getUser, login, logOut,imageUpload,forgotPassword,resetPassword,editDetails,deleteUser } = require("../controller/authController");
const { getAccessToRoute } = require("../middlewares/authorization/authMid");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers")





const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.get("/profile", getAccessToRoute, getUser);
router.get("/logout", getAccessToRoute, logOut);
router.post("/upload",getAccessToRoute,profileImageUpload,imageUpload); 
router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute,editDetails);
router.delete("/delete",getAccessToRoute,deleteUser)

module.exports=router;