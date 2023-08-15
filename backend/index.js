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
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'

import {register} from "./controllers/auth.js"
import {createPost} from "./controllers/posts.js"

import { verifyToken } from "./middleware/auth.js"


/* Importing data files, for random data for users and posts*/
import { users, posts } from "./data/index.js" //data
import User from "./models/User.js" //dataBase clusters
import Post from "./models/Post.js" //dataBase clusters

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
/* ROUTES WITH FILES LIKE IMAGES AND POSTS */
// The routes needing the image upload has to been via this file only, as multer has
// been initialised here only, upload.single("picture") makes sure the
// uploaded image has been added in the local storage/ Backend
app.post("/auth/register", upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

/* ALL OTHER ROUTES */
// The routes that handle authentication and authorization of user: login, signup, verifying and generating token
app.use("/auth", authRoutes)
// The routes that handle all user related queries: add/Remove friend, get user friend, get user specific details
app.use("/users", userRoutes)
// The routes that handle all post realted queries: showing my post, all posts, liked posts
app.use("/posts", postRoutes)
//These are basically other file extensions, the second paramter are just another locaiton
//which are called when someone enters these base routes. 
//later those routes in these files, are called upon triggering those specific urls

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

    /* ADD ONE TIME ONLY, When you delete your db, run below only once, to create dummy data */
    // User.insertMany(users);
    // Post.insertMany(posts)
})
.catch((error) => console.log(`${error} did not connect`));

/*
Links:
Material UI: https://mui.com/material-ui/getting-started/installation/
Redux Toolkit: https://redux-toolkit.js.org/introduction/getting-started 
React Router: https://reactrouter.com/en/v6.3.0/getting-started/installation
Redux Persist: https://github.com/rt2zz/redux-persist
React Dropzone: https://react-dropzone.js.org/
Node: https://nodejs.org/en/download/
Nodemon: https://github.com/remy/nodemon
NPX: https://www.npmjs.com/package/npx
VsCode: https://code.visualstudio.com/download
Dotenv: https://github.com/motdotla/dotenv
MongoDB: https://www.mongodb.com/
Mongoose: https://github.com/Automattic/mongoose
JsonWebToken: https://github.com/auth0/node-jsonwebtoken 
Multer: https://github.com/expressjs/multer
GridFS-Storage: https://github.com/devconcept/multer-gridfs-storage
Google Fonts: https://fonts.google.com/
Formik: https://formik.org/docs/overview
Yup: https://github.com/jquense/yup
*/