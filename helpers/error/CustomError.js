class CustomError extends Error {
    constructor(message,status,data){
        super(message);
        this.status=status;
    }
}




module.exports=CustomError;