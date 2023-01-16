const express =require("express");
const articleRouter=require("./articleRouter");
const authRouter=require("./authRouter");
const adminRouter=require("./adminRouter");
const userRouter=require("./userRouters");
const publicReqRouter=require("./publicReqRouter")


const router=express.Router();


router.use("/article",articleRouter);
router.use("/auth",authRouter);
router.use("/admin",adminRouter);
router.use("/user",userRouter);
router.use("/publicreq",publicReqRouter);



module.exports=router;
