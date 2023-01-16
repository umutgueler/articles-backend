const asyncErrorWrapper = require("express-async-handler");

const { searchHelper, populateHelper, articleSortHelper, paginationHelper } = require("./queryMiddlewareHelpers");

const articleQueryMiddleware = function (model) {


    return asyncErrorWrapper(async function (req, res, next) {

        let query = model.find()

        const userid = req.headers?.userid;

        if (userid) {
            if (req?.query?.myarticles === "true") {
                query = query.find({ user: userid })
            }
            if (req?.query?.mylikes === "true") {

                query = query.find({likes:userid})
            };


        }




        if (req?.query?.searchTitle) {

            query = searchHelper("title", req?.query?.searchTitle, query);
        }

        if (req?.query?.searchContent) {

            query = searchHelper("content", req?.query?.searchContent, query);
        }

        if (req?.query?.category) {

            const category = req?.query?.category.split(" ");
            
            query = query.find({ category: category })

        }




        if (req?.query?.population) {
            const population = req?.query?.population;
            if (population === "user") {
                query = query.populate({
                    path: "user",
                    select: "username profile_image"
                })
            }
            else if (population === "comment") {
                query = query
                    .populate(
                        {
                            path: "user",
                            select: "username profile_image"
                        })
                    .populate(
                        {

                            path: "comments",
                            select: "content user",
                            populate: {
                                path: "user",
                                select: "username name profile_image"
                            }

                        })
            }

        };

        query = articleSortHelper(query, req);

        const paginationResult = await paginationHelper(model, query, req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResult = await query;

        res.queryResult = {
            success: true,
            count: queryResult.length,
            pagination: pagination,
            data: queryResult
        }
        next()
    })
};


module.exports = articleQueryMiddleware;