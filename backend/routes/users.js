import express from "express"
import{ getUser,getUserFriend,addRemoveFriend }from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* READ ROUTES */

//get specific user details or data
router.get("/:id", verifyToken, getUser)
router.get("/:id/friends", verifyToken, getUserFriend)
router.patch("/:id/friendID", verifyToken, addRemoveFriend)

export default router
