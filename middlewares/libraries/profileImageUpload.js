const asyncErrorWrapper = require("express-async-handler");
const cloudinary=require("cloudinary").v2;
const CustomError = require("../../helpers/error/CustomError");
const fs=require("fs");
const User = require("../../models/User");


const profileImageUpload = asyncErrorWrapper(async (req, res, next) => {


    let user=req.user;
    

    if (!req.files) {
        fs.unlinkSync(image.tempFilePath)
        return next(new CustomError("Please provide image file", 400))
    }
    const image = req.files.image;
    
    let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];
    if (!allowedMimeTypes.includes(image.mimetype)) {
        
        fs.unlinkSync(image.tempFilePath)
        return next(new CustomError("Please provide a valid image file", 400))
    }

    image.name="profileImage_"+user.id;

    const imageUpload = await cloudinary.uploader.upload(
        image.tempFilePath,
        {
            use_filename: true,
            public_id: image.name,
            folder: "articles/ProfileImages",
            overwrite: true
        }
    );

    user=await User.findByIdAndUpdate(user.id,{profile_image:imageUpload.secure_url},
        {
            new:true,
        })
    
    return res
    .status(200)
    .json(
        {
            success:true,
            message:"Image upload is successful",
            data:user
        }
    )
});

    module.exports = profileImageUpload;
