const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
    let customError = err;
    console.log(err)



    if (err.name === "CastError") {
        customError = new CustomError("Please provide a valid id", 400)
    }
    else if (err.name === "SyntaxError") {
        customError = new CustomError("Unexpected Syntax", 400)
    }
    else if (err.name === "ValidationError") {
        
        let data = {};
        Object.keys(err.errors).forEach((key)=>{
            data[key]=err.errors[key].message
        })
        return res
            .status(400)
            .json({
                success: false,
                message: "Validation failed",
                data: data
            });
        
    }
    else if (err.code === 11000) {
        return res
            .status(400)
            .json({
                success: false,
                message: "Duplicate Key Found",
                data: Object.keys(err.keyPattern)
            });

    }
    else if (err.errno === -4058) {
        customError = new CustomError("There isn't file such a", 400)
    }


    res
        .status(customError.status || 500)
        .json({
            success: false,
            message: customError.message
        })
}

module.exports = { customErrorHandler }