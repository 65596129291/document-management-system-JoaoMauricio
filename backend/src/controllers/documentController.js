const fs = require('node:fs');
const path = require('node:path');
const { createDocument, getDocumentList, getDocumentForDownload } = require('../services/documentService');

function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo não enviado.' });
  }

  try {
    const document = createDocument({
      originalName: req.file.originalname,
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

    if (!document.filePath || !fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'Arquivo não encontrado.' });
    }

    return res.download(document.filePath, document.originalName);
  } catch (error) {
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
