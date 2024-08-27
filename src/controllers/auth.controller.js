import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
    const { username, email, password } = req.body; //get user data from request
    try { //try to register new user

        const passwordHash = await bcrypt.hash(password, 10); //encrypt password
        const newUser = new User({ //create new user
            username,
            email,
            password: passwordHash,
        });

        const userSaved=await newUser.save(); //save user to database
        
        res.json({id:userSaved._id,
            username:userSaved.username,
            email:userSaved.email, 
            createdAt:userSaved.createdAt,
            updatedAt:userSaved.updatedAt,
        }); //return user data without password to client

    } catch (error) { //catch any errors
        console.log(error);
        res.status(500).send({ message: "Error registering user" }); //return error message
    }
}; //register new user

export const login = (req, res) => res.send("login"); 