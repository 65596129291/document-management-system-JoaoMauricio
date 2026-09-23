import { useState } from 'react';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError('Selecione um arquivo antes de enviar.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', file);
          if (owner) {
            formData.append('owner', owner);
          }
          return formData;
        })(),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Erro ao enviar o arquivo.');
      }

      const document = await response.json();
      setFile(null);
      setOwner('');
      if (onUploadSuccess) {
        onUploadSuccess(document);
      }
    } catch (submitError) {
      setError(submitError.message || 'Não foi possível enviar o arquivo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem' }}>
      <h2>Upload de documento</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            <span>Arquivo</span>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              style={{ display: 'block', marginTop: '0.5rem' }}
            />
          </label>

          <label>
            <span>Dono</span>
            <input
              type="text"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              placeholder="usuario-01"
              style={{ display: 'block', width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}
            />
          </label>

          <button type="submit" disabled={loading} style={{ padding: '0.75rem 1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Enviando...' : 'Enviar documento'}
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'crimson', marginTop: '0.75rem' }}>{error}</p>}
    </section>
  );
}
