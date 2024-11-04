import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
export const register = async (req, res) => {
    const { username, email, password } = req.body; //get user data from request
    try { //try to register new user

      const userFound = await User.findOne({email})
      if (userFound) return res.status(400).json({ 
        message: ["El correo electrónico ya está en uso"] 
      }); //return error if email already exists

        const passwordHash = await bcrypt.hash(password, 10); //encrypt password
        const newUser = new User({ //create new user
            username,
            email,
            password: passwordHash,
        });

        const userSaved=await newUser.save(); //save user to database
        const token = createAccessToken({ id: userSaved._id }); //create token
        

        res.cookie('token', token); //set cookie
        res.json({id:userSaved._id,  //return user data to client
            username:userSaved.username,
            email:userSaved.email, 
            createdAt:userSaved.createdAt,
            updatedAt:userSaved.updatedAt,
        }); //return user data without password to client

    } catch (error) { //catch any errors
        console.log(error);
        res.status(500).json({ 
          message: ["Error al registrar usuario. Por favor, intente nuevamente."] 
        }); //return error message
    }
}; //register new user

export const login = async (req, res) => {
    const { email, password } = req.body; //get user data from request
  
    try {
      const userFound = await User.findOne({ email }); //find user by email
      if (!userFound) return res.status(400).json({ 
        message: ["Usuario no encontrado"] 
      });   //return error if user not found
  
      const isMatch = await bcrypt.compare(password, userFound.password); //compare password
      if (!isMatch)
        return res.status(400).json({ 
          message: ["Contraseña incorrecta"] 
        }); //return error if password is incorrect
  
      const token = await createAccessToken({ id: userFound._id }); //create token\
      console.log(token);
  
      res.cookie("token", token); //set cookie 
      res.json({ //return user data to client
        id: userFound._id, 
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      });
    } catch (error) {
      res.status(500).json({ 
        message: ["Error en el servidor. Por favor, intente nuevamente."] 
      }); //return error message
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token", "", {expires: new Date(0) }); //clear cookie
    return res.sendStatus(200); //return message
}   

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};