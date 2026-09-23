const crypto = require('node:crypto');
const { addDocument, listDocuments, getDocumentById } = require('../repositories/documentRepository');

function createDocument({ originalName, size, owner, filePath }) {
  const id = `doc-${crypto.randomUUID()}`;
  const uploadedAt = new Date().toISOString();

  const document = addDocument({
    id,
    originalName,
    size,
    uploadedAt,
    owner: owner || 'anonymous',
    filePath,
  });

  const { filePath: storedPath, ...publicDocument } = document;
  return publicDocument;
}

function getDocumentList() {
  return listDocuments();
}

function getDocumentForDownload(id) {
  const document = getDocumentById(id);
  if (!document) {
    const error = new Error('Documento não encontrado');
    error.statusCode = 404;
    throw error;
  }

  const { filePath, ...publicDocument } = document;
  return {
    ...publicDocument,
    filePath,
  };
}

module.exports = {
  createDocument,
  getDocumentList,
  getDocumentForDownload,
};
