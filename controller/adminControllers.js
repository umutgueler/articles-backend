const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/User");

const path = require("path")
const PublicReq = require("../models/PublicReq")


const blockUser = asyncErrorWrapper(async (req, res, next) => {

    const user = req.user;

    user.blocked = !user.blocked;

    const result=user.blocked ? "blocked":"none blocked"
    await user.save()

    return res
        .status(200)
        .json({
            success: true,
            message: `This user blocked status change that ${result}`
        })


});
const deleteUser = asyncErrorWrapper(async (req, res, next) => {

    const user = req.user;

    await user.remove()

    return res
        .status(200)
        .json({
            success: true,
            message: "Delete Successful"
        })

});

const editUser = asyncErrorWrapper(async (req, res, next) => {

    const editInformation = req.body;
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, editInformation, {
        new: true,
        runValidators: true
    });

    return res
        .status(200)
        .json({
            success: true,
            message: "Edit operation is successful",
            data: user
        })

});
const imageUploadAdmin = asyncErrorWrapper(async (req, res, next) => {
    //Image upload success
    const user = req.user;
    user.profile_image = req.savedProfileImage;
    res
        .status(200)
        .json({
            success: true,
            message: "Image upload successful",
            data: user
        })
});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {

    const users=await User.find();
    
    return res
    .status(200)
    .json({
        success:true,
        messagee:"Get all users successful",
        data:users
    })
});

const getAllUserReqs = asyncErrorWrapper(async (req, res, next) =>{

    const userReqs= await UserReq.find().populate("user")

    return res
    .status(200)
    .json({
        success:true,
        message:"Get all user request",
        data:userReqs
    })
});

const getAllUsersUserReqs = asyncErrorWrapper(async (req, res, next) => {

    const userId=req.params.id

    const data =await UserReq.find({user:userId});

    return res
    .status(200)
    .json({
        success:true,
        message:"Get all the user request success",
        data:data
    })
});
const downloadFileAdmin= asyncErrorWrapper(async (req, res, next) => {

    const filename = req.body.filename;
    const userId = req.params.userid;

    const rootDir = path.dirname(require.main.filename);
    const filePath = path.join(rootDir, "public", "uploads", "user", userId, filename);



    return res.download(filePath);



});

const getAllPublicReq = asyncErrorWrapper(async (req, res, next) =>{

    const publicReq=await PublicReq.find()

    return res
    .status(200)
    .json({
        success:true,
        message:"Get all public request",
        data:publicReq
    })
});


const getSinglePublicReq = asyncErrorWrapper(async (req, res, next) =>{

    
    const publicReq=req.publicReq;

    return res
    .status(200)
    .json({
        success:true,
        message:"Get single public request",
        data:publicReq
    })
});

const deletePublicReq = asyncErrorWrapper(async (req, res, next) =>{

    const publicReq=req.publicReq
    await publicReq.remove();

    return res
    .status(200)
    .json({
        success:true,
        message:"Delete operation successful"
    })

});

const deleteAllPublicReq = asyncErrorWrapper(async (req, res, next) =>{

    
    await PublicReq.deleteMany();

    return res
    .status(200)
    .json({
        success:true,
        message:"Delete operation successful"
    })

});





module.exports = {
    blockUser,
    deleteUser,
    editUser,
    imageUploadAdmin,
    getAllUsers,
    getAllUserReqs,
    getAllUsersUserReqs,
    downloadFileAdmin,
    getAllPublicReq,
    getSinglePublicReq,
    deletePublicReq,
    deleteAllPublicReq
    
}