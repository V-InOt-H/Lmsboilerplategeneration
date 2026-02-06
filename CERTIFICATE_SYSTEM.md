# Certificate Generation System

This document describes the certificate generation system implemented for the LMS.

## Features

1. **Automatic Certificate Generation** - Learners can generate certificates upon completing a course (100% progress)
2. **Certificate Viewing** - View certificates with professional design
3. **PDF Download** - Download certificates as PDF files
4. **Certificate Verification** - Public endpoint to verify certificate authenticity

## How It Works

### Certificate Generation Flow

1. **Course Completion**
   - Learner enrolls in a course
   - Completes all lessons (marks them as complete)
   - Progress reaches 100%

2. **Generate Certificate**
   - In the Course Viewer, a "Generate Certificate" button appears when progress >= 100%
   - Clicking the button calls the API to generate the certificate
   - A unique certificate ID is generated (format: `LMS-YYYY-COD-XXXXXX`)

3. **View Certificate**
   - Click "View Certificate" to open the certificate viewer
   - Certificate displays: learner name, course name, completion date, certificate ID
   - Authority signature area

4. **Download PDF**
   - Click "Download PDF" to download the certificate as a PDF
   - Uses html2pdf.js for high-quality PDF generation

### Accessing Certificates

- **My Certificates Page**: Navigate via sidebar "Certificates" menu
- **Direct URL**: `/certificates/{certificateId}`
- **From Course**: Appears in Course Viewer after 100% completion

## API Endpoints

### GET /api/certificates
Get all certificates for the logged-in user

### GET /api/certificates/:id
Get a single certificate by ID or certificateId

### POST /api/certificates/generate
Generate a certificate for a completed course
```json
{
  "courseId": "course_id_here"
}
```

### GET /api/certificates/verify/:certificateId
Verify a certificate (public endpoint)
```json
{
  "success": true,
  "verification": {
    "valid": true,
    "certificateId": "LMS-2024-COU-XXXXXX",
    "learnerName": "John Doe",
    "courseName": "Course Title",
    "completionDate": "2024-01-15"
  }
}
```

## File Structure

```
src/app/components/certificates/
├── Certificate.tsx           # Certificate display component (print/PDF)
├── CertificateViewer.tsx     # Certificate viewer page with download
└── Certificates.tsx          # My Certificates list page

backend/
├── controllers/
│   └── certificate.controller.js  # Certificate logic
├── models/
│   └── Certificate.model.js       # Certificate model
└── routes/
    └── certificate.routes.js      # Certificate routes
```

## Certificate Design

The certificate features:
- Professional border design
- School logo/award icon
- Gold seal for authenticity
- Learner name prominently displayed
- Course name and completion date
- Unique certificate ID for verification
- Authority signature area

## Verification

To verify a certificate:
1. Go to `/api/certificates/verify/{certificateId}`
2. Returns verification details including learner name, course, and completion date

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the backend:
   ```bash
   cd backend
   npm start
   ```

3. Run the frontend:
   ```bash
   npm run dev
   ```

## Requirements for Certificate Generation

- User must be enrolled in the course
- Course progress must be 100%
- Course status must be "Completed"
- Certificate must not already exist for this user/course combination

