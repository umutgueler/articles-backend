const sendJwtToClient = (user, res) => {
    //Generate JWT
    const token = user.generateJwtFromUser();


    const { JWT_COOKIE, NODE_ENV } = process.env;

    return res
        .status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(JWT_COOKIE)),
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            success: true,
            access_token: token,
            data: {
                _id:user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                title: user.title,
                about: user.about,
                place: user.place,
                role: user.role,
                profile_image: user.profile_image,
            }

        })

}
const isTokenIncluded = (req) => {
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    )
};

const getAccessTokenFromHead = (req) => {
    const authorization = req.headers.authorization;
    const access_token = authorization.split(" ")[1];
    return access_token;
}

module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHead
}