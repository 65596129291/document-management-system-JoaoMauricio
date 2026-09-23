async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: {
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao processar a requisição.');
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response;
}

async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);

  if (owner) {
    formData.append('owner', owner);
  }

  const response = await apiRequest('/upload', {
    method: 'POST',
    body: formData,
  });

  return response;
}

async function listDocuments() {
  return apiRequest('/documents');
}

async function downloadDocument(id) {
  const response = await fetch(`/api/documents/${id}/download`);

  if (!response.ok) {
    throw new Error('Não foi possível baixar o documento.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = id;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export { uploadDocument, listDocuments, downloadDocument };
