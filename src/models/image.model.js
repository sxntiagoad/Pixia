import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model('Image', imageSchema);