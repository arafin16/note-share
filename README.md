# Course Platform - Share Notes

A modern course management and note-sharing platform built with Express, MongoDB, and vanilla JavaScript.

## Project Structure

```
note-share/
├── backend/              # Backend API server
│   ├── server.js         # Main Express server
│   ├── database.js       # MongoDB connection & models
│   ├── package.json      # Backend dependencies
│   ├── uploads/          # User uploaded files (git-ignored)
│   └── .gitignore        # Backend ignore rules
├── public/               # Frontend static files
│   ├── index.html        # Main HTML file with UI
│   └── favicon.svg       # Site icon
├── package.json          # Root package.json (delegates to backend)
├── .env.local            # Environment variables (git-ignored)
├── .env.example          # Environment variables template
├── README.md             # This file
└── DEPLOYMENT.md         # Deployment instructions
```

## Setup Instructions

### Prerequisites
- Node.js (v20+)
- MongoDB (running on localhost:27017)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/arafin16/note-share.git
cd note-share
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env.local file**
```bash
cp .env.example .env.local
```
Then edit `.env.local` and add your credentials:
```
UPLOADTHING_SECRET=your_secret_here
UPLOADTHING_APP_ID=your_app_id_here
```

4. **Start the server**
```bash
npm start
```

The app will run at `http://localhost:3000`

## Features

- 📚 **Course Management** - Create, read, update, delete courses
- 📝 **Content Management** - Add text notes and files to courses
- 📤 **File Upload** - Upload files that are stored locally
- 🔐 **Admin Panel** - Secure admin login to manage content
- 💾 **MongoDB** - Persistent data storage
- 🎨 **Clean UI** - Responsive and easy-to-use interface

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses with content
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Content
- `POST /api/courses/:courseId/contents` - Add content to course
- `DELETE /api/courses/:courseId/contents/:contentId` - Delete content

### Files
- `POST /api/upload` - Upload file
- `GET /uploads/:filename` - Download file

### Auth
- `POST /api/admin/login` - Admin login

## Default Credentials

- Email: `admin@gmail.com`
- Password: `admin123`

## Development

```bash
npm start     # Start server
```

The server runs on port 3000 and serves the frontend from the `public/` directory.

## Tech Stack

- **Backend**: Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

## Git Ignore

The following are ignored from git:
- `node_modules/`
- `uploads/`
- `.env.local`
- `.env`
- Database files

## License

MIT License

## Author

Arafin (@arafin16)
