const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const router = express.Router();
const storageDir = path.join(__dirname, '..', '..', 'storage');

fs.mkdirSync(storageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storageDir);
  },
  filename: (req, file, callback) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    const uniqueName = `${Date.now()}-${safeName}`;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;
