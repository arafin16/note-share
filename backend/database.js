const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/shareNotes';

// Define Schemas
const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
});

const contentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  contentTitle: { type: String, required: true },
  textData: { type: String, default: '' },
  fileName: { type: String, default: '' },
  fileType: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  createdAt: { type: Number, default: Date.now }
});

// Create Models
const Course = mongoose.model('Course', courseSchema);
const Content = mongoose.model('Content', contentSchema);

// Connect to MongoDB
async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected:', MONGO_URI);
    return { Course, Content };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

function getModels() {
  return { Course, Content };
}

module.exports = { connectDatabase, getModels };
