const CustomError = require("../helpers/error/CustomError")
const User = require("../models/User")
const asyncErrorWrapper = require("express-async-handler")
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers")
const { validateUserInput, comparePassword } = require("../helpers/input/inputHelpers.js")
const sendEmail = require("../helpers/libraries/sendEmail")

const register = asyncErrorWrapper(async (req, res, next) => {


    //asyn await


    const { name, username, email, password } = req.body;
    const user = await User.create({
        name,
        username,
        email,
        password,

    })

    sendJwtToClient(user, res);



})
const login = asyncErrorWrapper(async (req, res, next) => {
    const { username, password } = req.body;
    if (!validateUserInput(username, password)) {
        return next(new CustomError("Please check your input", 400));
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
        return next(new CustomError("No user found for this username", 400))
    }
    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentials", 400))
    }
    if (user.blocked) {
        return next(new CustomError("The user is blocked", 401))
    }


    sendJwtToClient(user, res);
})
const logOut = asyncErrorWrapper(async (req, res, next) => {

    const { NODE_ENV } = process.env;

    return res
        .status(200)
        .cookie({
            httpOnly: true,
            expires: new Date(Date.now),
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            success: true,
            message: "Log out successful"
        })
})


const getUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.json({
        success: true,
        data: user
    })

});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    //Image upload success
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    })
    res
        .status(200)
        .json({
            success: true,
            message: "Image upload successful",
            data: user
        })
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {

    const resetUsername = req.body.username;
    const resetEmail = req.body.email;
    const user = await User.findOne({ username: resetUsername, email: resetEmail });

    if (!user) {
        return next(new CustomError("There is no user with that username"), 400);

    };

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:6660/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
        <h1>YKFKT</h1>
        <h3>Reset Your Passwor</h3>
        <p>This<a href="${resetPasswordUrl}" target="_blank">link</a> will expire in one hour.</p>
    `;

    try {

        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        });


        return res.status(200).json({
            success: true,
            message: "Token Send Your Email"
        })
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Send", 500))
    };

})

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    if (!resetPasswordToken) {
        next(new CustomError("Please provide a valid token", 400))
    };

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        next(new CustomError("Invalid Token or Session Experied", 404))
    }

    user.password = password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();


    return res
        .status(200)
        .json({
            loves: "Ykfkt",
            message: "Reset Password Successful"
        })
})

const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInformation = req.body;
    const { id } = req.user;
    if (editInformation.role) {
        return next(new CustomError("Only admins can access this route", 403))
    }
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
const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.user;
    const user = await User.findById(id);
    if(!user){
        return next(new CustomError("There isn't user with that",400))
    }
    user.remove();
    return res
        .status(200)
        .json({
            success:true,
            message:"Delete user operation is successful",            
        });
})

module.exports = {
    register,
    getUser,
    login,
    logOut,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails,
    deleteUser
}