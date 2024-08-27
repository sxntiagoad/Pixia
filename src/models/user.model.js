import mongoose from "mongoose";

const userSchema = new mongoose.Schema({  // Create a schema
  username: { // Define the properties of the schema 
    type: String,
    required: true,
    trim: true, // Remove whitespace from both ends of a string
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure that the email is unique
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });   // Add timestamps to the schema
export default mongoose.model("User", userSchema); // Create a model from the schema
