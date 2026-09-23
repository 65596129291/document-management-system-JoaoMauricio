const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const router = express.Router();
const storageDir = path.join(__dirname, '..', '..', 'storage');

fs.mkdirSync(storageDir, { recursive: true });

function sanitizeFileName(originalName = 'documento') {
  const baseName = path.basename(originalName || 'documento');
  const safeName = baseName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return safeName || 'documento';
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storageDir);
  },
  filename: (req, file, callback) => {
    const safeName = sanitizeFileName(file.originalname);
    const uniqueName = `${Date.now()}-${safeName}`;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const safeName = sanitizeFileName(file.originalname);
    const isAllowed = /\.(txt|csv|pdf|doc|docx|xls|xlsx|png|jpg|jpeg|json)$/i.test(safeName);

    if (!isAllowed) {
      return callback(new Error('Tipo de arquivo não permitido.'));
    }

    callback(null, true);
  },
});

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;
