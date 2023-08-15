import User from "../models/User.js";

/* READ */

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(400).json({ message: "No user found" })
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (err) {
        res.status(404).json({ message: err.message })
    }
}


export const getUserFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )

        res.status(200).json(formattedFriends)
    }
    catch(err){
        res.status(404).json({message: err.message})
 
    }
}


export const addRemoveFriend = async(req, res)=>{
    try{
        //user is the object
        //friends is the attribute of this object, to access it, we do user.friends
        //friend is the new value we can and want to insert in the friends field of
        //the user
        //id is my id, friend id is the id of the friend i want to do something.
        const {id, friendId} = req.params
        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId)//removing friend from my id
            friend.friends = friend.friends.filter((id) = id!== id) //removing myself from his list of friends
        }else{
            user.friends.push(friendId)
            friend.friends(push(id))
        }

        //saving user and its friend state
        await user.save()
        await friend.save()

        //To show all friends, and then send all friends
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )

    }
    catch(err){
        res.status(404).json({message: err.message})
    }
}