import mongoose from "mongoose";


export const connectDB = async () => {  //create function to connect to database
    try { 
    await mongoose.connect("mongodb://127.0.0.1:27017/PixiaDB");  //connect to database
    console.log(">>> Database connected"); //log message to console

    } catch (error) {
        console.error("Error connecting to database:", error.message);
    }
};