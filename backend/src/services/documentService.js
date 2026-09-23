const crypto = require('node:crypto');
const { addDocument, listDocuments, getDocumentById } = require('../repositories/documentRepository');

function toPublicDocument(document) {
  const { filePath, ...publicDocument } = document;
  return publicDocument;
}

function toDownloadDocument(document) {
  return {
    ...toPublicDocument(document),
    filePath: document.filePath,
  };
}

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

  return toPublicDocument(document);
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

  return toDownloadDocument(document);
}

module.exports = {
  createDocument,
  getDocumentList,
  getDocumentForDownload,
};
