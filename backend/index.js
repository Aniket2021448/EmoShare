import express from "express" //to make the backend app
import bodyParser from "body-parser"
import mongoose from "mongoose" //to manage database

import cors from "cors"     //cross origin requests
import dotenv from "dotenv" //for .env file::environment variables
import multer, { MulterError } from "multer"

import helmet from "helmet"
import morgan from "morgan"
import path from "path"

import { fileURLToPath } from "url"

import authRoutes from './routes/auth.js'
import {register} from "./controllers/auth.js"


/* CONFIGURATIONS:: especially for using the import module format */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))

app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))

//to enable cross origin request, when we have to run frontend and backend on two different
//servers
app.use(cors())
//sets the folder where we keep our images and other assets
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))


/* FILE STORAGE */
//multer setup:: https://www.npmjs.com/package/multer 
//github repo:: https://github.com/expressjs/multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})
const upload = multer({storage})
/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register)

/* ALL OTHER ROUTES */
app.use("/auth", authRoutes)

//router: post type, url to be fetched to initialise this middleware.
        //to handle images and upload them, using upload.single("picture")
        //controller which will be handling this request:: register


/* MONGO DB setup */
const PORT = process.env.PORT || 6001

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, ()=> console.log(`Server Port : ${PORT}`));
})
.catch((error) => console.log(`${error} did not connect`));

