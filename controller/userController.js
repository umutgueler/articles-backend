const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {


    let user = req.data;
    if (!user) {
        const { id } = req.params;
        user = await User.findById(id);
    }


    return res
        .status(200)
        .json({
            success: true,
            data: user
        })
})
const getAllUser = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find();

    return res
        .status(200)
        .json({
            success: true,
            data: users
        })

})

module.exports = {
    getSingleUser,
    getAllUser
}