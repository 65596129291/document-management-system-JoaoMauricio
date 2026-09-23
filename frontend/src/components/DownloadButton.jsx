export default function DownloadButton({ documentId, fileName, onDownload }) {
  async function handleDownload() {
    if (onDownload) {
      onDownload(documentId);
      return;
    }

    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (!response.ok) {
        throw new Error('Não foi possível baixar o documento.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName || 'documento';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
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
