const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers");
const connectDatabase = require("./helpers/database/connectDatabase");
const { customErrorHandler } = require("./middlewares/errors/customErrorHandler");
const path = require("path");


const cors = require("cors")
const fileUpload = require('express-fileupload');

const cloudinary = require('cloudinary').v2;





//Environtmen Variables
dotenv.config({
    path: "./config.env"
});
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, NODE_ENV } = process.env;
cloudinary.config({
    cloud_name: String(CLOUD_NAME),
    api_key: String(CLOUD_API_KEY),
    api_secret: String(CLOUD_API_SECRET),
    secure: NODE_ENV === "development" ? false : true

});

connectDatabase();

const origin = NODE_ENV === "development" ? "http://localhost:6600" : "https://gulerumut.github.io";
const app = express();
app.use(cors(
    {
        origin:"https://articles-gold.vercel.app"
    }
))



//Express/Middleware

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
const PORT = process.env.PORT;

//Routers Middleware
app.use("/api", routers)

//Error Handler
app.use(customErrorHandler)

app.use(express.static(path.join(__dirname, "public")))

app.listen(PORT, () => {
    console.log(`Started on:${PORT} : ${process.env.NODE_ENV}`)
})
