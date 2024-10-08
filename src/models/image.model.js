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
  imageProcessedUrl: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

export default mongoose.model('Image', imageSchema);