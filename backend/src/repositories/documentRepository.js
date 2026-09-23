const fs = require('node:fs');
const path = require('node:path');

const storageDir = path.join(__dirname, '..', '..', 'storage');
fs.mkdirSync(storageDir, { recursive: true });

const documents = new Map();

function buildMetadata({ id, originalName, size, uploadedAt, owner, filePath }) {
  return {
    id,
    originalName,
    size,
    uploadedAt,
    owner,
    filePath,
  };
}

function addDocument({ id, originalName, size, uploadedAt, owner, filePath }) {
  const record = buildMetadata({ id, originalName, size, uploadedAt, owner, filePath });
  documents.set(id, record);
  return { ...record };
}

function listDocuments() {
  return Array.from(documents.values()).map((document) => {
    const { filePath, ...publicDocument } = document;
    return publicDocument;
  });
}

function getDocumentById(id) {
  const document = documents.get(id);
  if (!document) {
    return null;
  }

  const { filePath, ...publicDocument } = document;
  return {
    ...publicDocument,
    filePath,
  };
}

module.exports = {
  storageDir,
  addDocument,
  listDocuments,
  getDocumentById,
};
