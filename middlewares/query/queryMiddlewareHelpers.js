
const searchHelper = (searchKey, search,query) => {



    const searchObject = {};

    const regex = new RegExp(search, "i");
    
    searchObject[searchKey] = regex;

    return query.where(searchObject);

};

;

const populateHelper = (query, popilation) => {

    return query.populate(popilation);
};

const articleSortHelper = (query, req) => {

    const sortKey = req.query.sortBy;
    //Sorted  

    if (sortKey === "most-liked") {

        return query.sort("-likesCount -createdAt")
    }
    if (sortKey === "most-comment") {

        return query.sort("-commentsCount -createdAt")
    }

    return query.sort("-createdAt")

};

const paginationHelper = async (model, query, req) => {

    //Pagination

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = await model.countDocuments(query);
    
    pagination.lastPage = Math.ceil(total / limit);


    pagination.page = page;
    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit: limit
        }

    };

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    };

    return {
        query: query.skip(startIndex).limit(limit),
        pagination: pagination
    }

}



module.exports = {
    searchHelper,
    populateHelper,
    articleSortHelper,
    paginationHelper
}