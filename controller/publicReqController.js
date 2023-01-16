const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const PublicReq = require("../models/PublicReq");


const addNewReq = asyncErrorWrapper(async (req, res, next) => {


    const information = req.body;
    const publicReq = await PublicReq.create({
        ...information
    })

    return res
        .status(200)
        .json({
            success:true,
            message:"Request saved successfull",
            data:publicReq
        })
});


module.exports = {
    addNewReq
} 