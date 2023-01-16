const Article = require("../models/Article")
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const cloudinary = require('cloudinary').v2;
const fs = require("fs");
const path = require("path")


const downloadFile = asyncErrorWrapper(async (req, res, next) => {



    const filename = req.body.filename;
    const articleID = req.params.id;


    const rootDir = path.dirname(require.main.filename);
    const filePath = path.join(rootDir, "public", "uploads", "articles", articleID, filename);



    return res.download(filePath);




});
const deleteFile = asyncErrorWrapper(async (req, res, next) => {

    const article = req.article;
    const files = req.body.files;

    const rootDir = path.dirname(require.main.filename);
    const removePaths = path.join(rootDir, "public/uploads/articles/" + article._id);

    let filename;
    try {

        files.forEach(file => {
            filename = String(file);
            article.files.splice(article.files.indexOf(filename), 1)
                
            const filePath = path.join(removePaths, filename);

            fs.unlinkSync(filePath);


        })
    }
    catch {
        return next(new CustomError("No such a file: " + filename, 400))
    }

    article.save();

    return res
        .status(200)
        .json({
            success: true,
            message: "Delete operation is successful"
        })
});
const articleFilesUpload = asyncErrorWrapper(async (req, res, next) => {
    
    const article = req.article;
    const files = req.files.files;
    const filenames = JSON.parse(req.body.filenames);

    const mongoFilesNames = [];

    const utcdate = new Date(Date.now())
    const date = utcdate.toLocaleString('tr-TR').replace(" ", "_").replaceAll(":", "_");

    const rootDir = path.dirname(require.main.filename);
    const uploadPaths = path.join(rootDir, "public", "uploads", "articles", String(article._id));
    fs.mkdirSync(uploadPaths, { recursive: true }, (err) => {
        
        console.log(err) 
    });
    if (files.length > 1) {
        files.forEach((file, i) => {

            const namePath = date + "-" + String(filenames[i]) + "." + file.name.split(".").slice(-1);
            file.name = namePath;
            mongoFilesNames.push(namePath)

            const uploadPath = path.join(uploadPaths, file.name);

            file.mv(uploadPath, function (err) {
                if (err) {

                    fs.unlinkSync(file.tempFilePath)
                    return next(err);
                }
            })




        });

    }
    else {
        const file = files;
        const namePath = date + "-" + String(filenames[0]) + "." + file.name.split(".").slice(-1);
        file.name = namePath;
        mongoFilesNames.push(namePath)

        const uploadPath = path.join(uploadPaths, file.name);

        file.mv(uploadPath, function (err) {
            if (err) {

                fs.unlinkSync(file.tempFilePath)
                return next(err);
            }
        })

    }


    article.files = [...mongoFilesNames, ...article.files];

    await article.save();




    return res
        .status(200)
        .json({
            success: true,
            message: "Add new article",
            data: article
        })

});
const articleImageUpload = asyncErrorWrapper(async (req, res, next) => {
    
    const article = req.article;

    const image = req.files.image;

    if (!image) {
        return next();
    }





    image.name = "articleImage_" + article._id;
    const imageUpload = await cloudinary.uploader.upload(
        image.tempFilePath,
        {
            use_filename: true,
            public_id: image.name,
            folder: "articles/ArticleImages",
            overwrite: true
        }
    );

    article.images = imageUpload.secure_url;
    await article.save();

    fs.unlinkSync(image.tempFilePath);

    if (req.files.files) {
        return next();
    }

    return res
        .status(200)
        .json({
            success: true,
            message: "Add new article",
            data: article
        });




});
const addNewArticle = asyncErrorWrapper(async (req, res, next) => {

    let article;
    const files = req.files;


    try {
        if (!req.body.data) {

            next(new CustomError("Bad request", 400))
        }
        const information = JSON.parse(req.body.data);


        if (files) {
            if (files.image) {
                const image = files.image;
                let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

                if (!allowedMimeTypes.includes(image.mimetype)) {
                    return next(new CustomError("Please provide a valid image file", 400))
                }

            };
        }


        article = await Article.create({
            ...information,
            user: req.user.id
        });
    }
    catch (err) {
        if (files) {
            if (files.image) {
                fs.unlinkSync(files.image.tempFilePath);
            }
            
            if (files.files && files.files.length > 1) {
                
                Array.from(files.files).forEach((file) => {
                    fs.unlinkSync(file.tempFilePath);
                })

            }
            else {
                
                fs.unlinkSync(files.files.tempFilePath)
            }

        };
        return next(err);

    }


    if (files) {
        req.article = article;
        return next()
    };



    return res
        .status(200)
        .json({
            success: true,
            message: "Add new article",
            data: article
        });










})
const getAllArticles = asyncErrorWrapper(async (req, res, next) => {


    return res
        .status(200)
        .json(res.queryResult)
});

const getSingleArticle = asyncErrorWrapper(async (req, res, next) => {

    const article = req.article;

    return res
        .status(200)
        .json({
            success: true,
            data: article
        })

});

const editArticle = asyncErrorWrapper(async (req, res, next) => {

    const article_id = req.params.id;
    let article = req.article;
    const files = req.files;
    
    if (files) {
        if (files.image) {
            const image = req.files.image;
            let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

            if (!allowedMimeTypes.includes(image.mimetype)) {
                return next(new CustomError("Please provide a valid image file", 400))
            };
        }
    }


    try {

        if (!req.body.data) {




            req.article = article;

            return next();
        }
        const information = JSON.parse(req.body.data);
        information.lastUpdate = new Date(Date.now());




        article = await Article.findByIdAndUpdate(article_id, information, {
            new: true,
            runValidators: true
        });


        if (files) {
            req.article = article;
            return next();
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Edit article operation is successful",
                data: article
            });

    }
    catch (err) {
        if (files) {
            if (files.image) {
                fs.unlinkSync(files.image.tempFilePath);
            }
            if (files.files) {
                fs.unlinkSync(files.files.tempFilePath);
            }

        };
        return next(err);

    }





});

const deleteArticle = asyncErrorWrapper(async (req, res, next) => {



    const article = req.article;


    await article.remove();




    /* await Article.findByIdAndDelete(id); */

    return res
        .status(200)
        .json({
            success: true,
            message: "Delete operation is successful"
        });

});
const likeArticle = asyncErrorWrapper(async (req, res, next) => {



    const article = req.article;

    if (article.likes.includes(req.user.id)) {

        article.likes.splice(article.likes.indexOf(req.user.id));
        article.likesCount = article.likes.length;
        await article.save()

        return res
            .status(200)
            .json({
                success: true,
                message: "Unlikes operation is successful"
            });
    }

    article.likes.push(req.user.id);
    article.likesCount = article.likes.length;
    await article.save();

    return res
        .status(200)
        .json({
            success: true,
            message: "Likes operation is successful"
        });

});

const getAllUserArticle = asyncErrorWrapper(async (req, res, next) => {

    const user = req.user;
    const articles = await Article.find({ user: user.id });

    return res.
        status(200)
        .json({
            success: true,
            message: "Get all articles successful",
            data: articles
        })
});




module.exports = {
    getAllArticles,
    addNewArticle,
    getSingleArticle,
    editArticle,
    deleteArticle,
    likeArticle,
    articleImageUpload,
    getAllUserArticle,
    articleFilesUpload,
    deleteFile,
    downloadFile
}