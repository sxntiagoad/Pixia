import mongoose from "mongoose";

const vacancySchema = new mongoose.Schema({
  // ... otros campos existentes ...
  processedImageUrl: {
    type: String,
    required: true
  }
});

export default mongoose.model('vacancy', vacancySchema);