
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const register = async(req, res) => {
  try{
    const{
        //  destructure all you need from the req.body
        firstName,
        lastName,
        email,
        password,
        picturePath, 
        friend,
        location,
        occupation
    } = req.body

    // Add salt using becrypt to the password to secure password
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    //Make a user object, then save it in the database
    const newUser = new User({//generate all values to insert into the database, 
                              //some are already here from the req.body, some we generated
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath, 
        friend,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random()*1000),
        impressions: Math.floor(Math.random()*1000),

    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser) //201: something has been created.
  }
  catch(err){
    res.status(500).json({error: err.message}) //500: some error has occured
  }

}


/* LOGIN */

export const login = async(req, res)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email: email})

        if(!user){
            return res.status(400).json({msg: "User does not exist."})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({msg: "Invalid credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        delete user.password
        res.status(200).json({token, user})
        
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

