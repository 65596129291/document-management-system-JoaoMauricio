const fs = require('node:fs');
const path = require('node:path');
const { createDocument, getDocumentList, getDocumentForDownload } = require('../services/documentService');

function sanitizeOriginalName(originalName = 'documento') {
  const baseName = path.basename(originalName || 'documento');
  const safeName = baseName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return safeName || 'documento';
}

function ensureStoragePath(filePath) {
  const storageRoot = path.resolve(__dirname, '..', '..', 'storage');
  const resolvedPath = path.resolve(filePath);

  if (resolvedPath !== storageRoot && !resolvedPath.startsWith(`${storageRoot}${path.sep}`)) {
    const error = new Error('Arquivo fora do diretório permitido.');
    error.statusCode = 403;
    throw error;
  }

  return resolvedPath;
}

function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo não enviado.' });
  }

  try {
    const document = createDocument({
      originalName: sanitizeOriginalName(req.file.originalname),
      size: req.file.size,
      owner: req.body.owner,
      filePath: req.file.path,
    });

    return res.status(201).json(document);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao processar o upload do documento.' });
  }
}

function listDocuments(req, res) {
  try {
    return res.status(200).json(getDocumentList());
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar documentos.' });
  }
}

function downloadDocument(req, res) {
  try {
    const document = getDocumentForDownload(req.params.id);
    const safeFilePath = ensureStoragePath(document.filePath);

    if (!safeFilePath || !fs.existsSync(safeFilePath)) {
      return res.status(404).json({ message: 'Arquivo não encontrado.' });
    }

    return res.download(safeFilePath, sanitizeOriginalName(document.originalName));
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ message: 'Acesso ao arquivo negado.' });
    }

    if (error.statusCode === 404) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    return res.status(500).json({ message: 'Erro ao baixar o documento.' });
  }
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
