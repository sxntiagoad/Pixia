import mongoose from "mongoose";
import Counter from './counter.model.js';

const vacancySchema = new mongoose.Schema({
  vacancyId: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  requirements: {
    type: String,
    required: true,
    trim: true
  },
}, {
  timestamps: true
});

// Middleware pre-save para generar el ID automático
vacancySchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'vacancyId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.vacancyId = counter.seq;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('vacancy', vacancySchema);