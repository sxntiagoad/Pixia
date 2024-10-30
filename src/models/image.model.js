import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  improvedPrompt: {
    type: String,
    required: false, // No es requerido por si falla el proceso de mejora
    trim: true
  },
  imageUrl: {
    type: String,
    required: true  // Este campo es requerido
  },
  processedImageUrl: {
    type: String,
    required: false
  },
  overlayText: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'generated', 'processed', 'failed'],
    default: 'pending'
  },
  metadata: {
    width: Number,
    height: Number,
    generationParams: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Por ahora opcional, hasta que implementes autenticación
  }
}, {
  timestamps: true,
  versionKey: false // Elimina el campo __v
});

// Índices para mejorar el rendimiento de las consultas
imageSchema.index({ createdAt: -1 });
imageSchema.index({ userId: 1, createdAt: -1 });

// Método para transformar el documento antes de enviarlo
imageSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model('Image', imageSchema);
