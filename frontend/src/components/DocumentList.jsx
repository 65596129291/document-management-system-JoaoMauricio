import DownloadButton from './DownloadButton';

export default function DocumentList({ documents, onDownload }) {
  if (!documents.length) {
    return (
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: '1rem' }}>
        <h2>Documentos</h2>
        <p>Nenhum documento encontrado.</p>
      </section>
    );
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: '1rem' }}>
      <h2>Documentos</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
        {documents.map((document) => (
          <li key={document.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '0.75rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <div>
              <strong>{document.originalName}</strong>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                {document.owner || 'anonymous'} · {new Date(document.uploadedAt).toLocaleString()}
              </div>
            </div>
            <DownloadButton documentId={document.id} fileName={document.originalName} onDownload={onDownload} />
          </li>
        ))}
      </ul>
    </section>
  );
}
