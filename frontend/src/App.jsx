import { useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';

const initialDocuments = [];

export default function App() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [error, setError] = useState('');

  async function loadDocuments() {
    setLoadingDocuments(true);
    setError('');

    try {
      const response = await fetch('/api/documents');

      if (!response.ok) {
        throw new Error('Erro ao carregar documentos.');
      }

      const data = await response.json();
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
      const response = await fetch(`/api/documents/${documentId}/download`);

      if (!response.ok) {
        throw new Error('Não foi possível fazer o download do documento.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'documento';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
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
