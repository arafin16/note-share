const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { connectDatabase, getModels } = require('./database');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Database models
let Course, Content;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 256 * 1024 * 1024 } });

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Simple admin check (hardcoded for now)
const ADMIN_PASSWORD = "admin123";
const ADMIN_EMAIL = "admin@gmail.com";

// ========================
// ✅ COURSE ENDPOINTS
// ========================

// GET all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    const coursesWithContent = await Promise.all(
      courses.map(async (course) => {
        const contents = await Content.find({ courseId: course.id }).sort({ createdAt: -1 });
        return { ...course.toObject(), contents };
      })
    );
    res.json(coursesWithContent);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE course
app.post('/api/courses', async (req, res) => {
  try {
    const { title, description, id } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const newCourse = new Course({
      id,
      title,
      description: description || '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await newCourse.save();
    res.json({ id, title, description, createdAt: Date.now(), contents: [] });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE course
app.put('/api/courses/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const courseId = req.params.id;

    if (!title) return res.status(400).json({ error: 'Title required' });

    await Course.updateOne(
      { id: courseId },
      { title, description: description || '', updatedAt: Date.now() }
    );

    res.json({ success: true, message: 'Course updated' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE course
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    await Course.deleteOne({ id: courseId });
    await Content.deleteMany({ courseId });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// ✅ CONTENT ENDPOINTS
// ========================

// ADD content to course
app.post('/api/courses/:courseId/contents', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { contentTitle, textData, fileName, fileType, fileUrl, id } = req.body;

    

    if (!contentTitle) return res.status(400).json({ error: 'Content title required' });
    if (!courseId) return res.status(400).json({ error: 'Course ID required' });
    if (!id) return res.status(400).json({ error: 'Content ID required' });

    const newContent = new Content({
      id,
      courseId,
      contentTitle,
      textData: textData || '',
      fileName: fileName || '',
      fileType: fileType || '',
      fileUrl: fileUrl || '',
      createdAt: Date.now()
    });

    await newContent.save();
    console.log('Content added successfully');
    res.json({ success: true, message: 'Content added' });
  } catch (error) {
    console.error('Add content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE content
app.delete('/api/courses/:courseId/contents/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    await Content.deleteOne({ id: contentId });
    res.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// ✅ FILE UPLOAD ENDPOINT
// ========================
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    
    
    res.json({ 
      success: true, 
      url: fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype || 'application/octet-stream'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// ✅ ADMIN LOGIN
// ========================
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get upload URL
app.get('/api/upload-url', (req, res) => {
  res.json({ 
    uploadUrl: `/api/upload`
  });
});

// ========================
// ✅ SERVER START
// ========================
async function startServer() {
  try {
    const models = await connectDatabase();
    Course = models.Course;
    Content = models.Content;

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
