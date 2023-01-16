const express = require("express");
const {addNewReq}=require("../controller/publicReqController");



const router = express.Router();


router.post("/",addNewReq)


module.exports=router;