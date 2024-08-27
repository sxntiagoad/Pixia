import mongoose from "mongoose";


export const connectDB = async () => {  //create function to connect to database
    try { 
    await mongoose.connect("mongodb://localhost/PixiaDB");  //connect to database
    console.log(">>> Database connected"); //log message to console

    } catch (error) {
        console.log("Error connecting to database", error );
    }
};