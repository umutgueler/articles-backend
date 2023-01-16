const jwt = require("jsonwebtoken");
const { isTokenIncluded, getAccessTokenFromHead } = require("../../helpers/authorization/tokenHelpers");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Article = require("../../models/Article")




const getAccessToRoute = (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;

    if (!isTokenIncluded(req)) {


        return next(new CustomError("You are not authorized to access this route", 401))
    }
    const accessToken = getAccessTokenFromHead(req);

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {

        if (err) {


            return next(new CustomError("You are not authorized to access this route", 401))
        }
        
        req.user = {
            id: decoded.id,
            name: decoded.name,
            username: decoded.username,
            role: decoded.role
        }

        next()
    })

};
const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.user;


    const user = await User.findById(id);


    if (user.role !== "admin") {
        return next(new CustomError("Only admins can access this route", 403));
    };

    next();


})
const getArticleOwnerAccess = asyncErrorWrapper(async (req, res, next) => {

    const userId = req.user.id;


    const article = req.article;
    
    if (article.user._id != userId) {
        return next(new CustomError("Only owner can be handle this operation", 403));
    };

    return next();


})




const getCommentOwnerAccess = asyncErrorWrapper(async (req, res, next) => {

    const userID = req.user.id;

    const comment = req.comment;
    

    if (userID !== String(comment.user._id)) {
        return next(new CustomError("Only owner can be handle this operation", 403));
    }

    return next();

})



module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getArticleOwnerAccess,
    getCommentOwnerAccess
}