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
  processedImageUrl: {
    type: String,
    required: false,
  },
  overlayText: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

export default mongoose.model('Image', imageSchema);