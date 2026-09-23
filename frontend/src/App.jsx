import { useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { downloadDocument, listDocuments } from './services/documentApi';

const initialDocuments = [];

export default function App() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [error, setError] = useState('');

  async function loadDocuments() {
    setLoadingDocuments(true);
    setError('');

    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch (loadError) {
      setError(loadError.message || 'Não foi possível carregar os documentos.');
    } finally {
      setLoadingDocuments(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleDownload(documentId) {
    try {
      await downloadDocument(documentId, 'documento');
    } catch (downloadError) {
      setError(downloadError.message || 'Falha no download.');
    }
  }

  function handleUploadSuccess(document) {
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Document Management System</h1>
      <p>Gerencie uploads, listagem e download de documentos de forma simples.</p>

      <UploadComponent onUploadSuccess={handleUploadSuccess} />

      {error && (
        <p style={{ color: 'crimson', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      <div>
        <button type="button" onClick={loadDocuments} disabled={loadingDocuments} style={{ marginBottom: '1rem' }}>
          {loadingDocuments ? 'Atualizando...' : 'Atualizar lista'}
        </button>
      </div>

      <DocumentList documents={documents} onDownload={handleDownload} />
    </main>
  );
}
