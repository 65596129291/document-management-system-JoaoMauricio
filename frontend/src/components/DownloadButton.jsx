import { downloadDocument } from '../services/documentApi';

export default function DownloadButton({ documentId, fileName, onDownload }) {
  async function handleDownload() {
    if (onDownload) {
      onDownload(documentId);
      return;
    }

    try {
      await downloadDocument(documentId, fileName || 'documento');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button type="button" onClick={handleDownload} style={{ padding: '0.4rem 0.7rem' }}>
      Download
    </button>
  );
}
