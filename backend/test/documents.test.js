const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

async function withServer(callback) {
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    await callback(port);
  } finally {
    server.close();
  }
}

test('POST /api/upload salva arquivo e retorna metadados', async () => {
  await withServer(async (port) => {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo de teste'], { type: 'text/plain' }), 'arquivo.txt');
    formData.append('owner', 'usuario-01');

    const response = await fetch(`http://127.0.0.1:${port}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 201, 'upload deve criar documento');
    const body = await response.json();
    assert.ok(body.id, 'deve existir id');
    assert.strictEqual(body.originalName, 'arquivo.txt');
    assert.strictEqual(body.owner, 'usuario-01');
  });
});

test('GET /api/documents lista documentos cadastrados', async () => {
  await withServer(async (port) => {
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob(['arquivo 1'], { type: 'text/plain' }), 'lista-1.txt');

    await fetch(`http://127.0.0.1:${port}/api/upload`, {
      method: 'POST',
      body: uploadForm,
    });

    const response = await fetch(`http://127.0.0.1:${port}/api/documents`);
    assert.strictEqual(response.status, 200, 'deve listar documentos');
    const documents = await response.json();
    assert.ok(Array.isArray(documents), 'lista deve ser um array');
    assert.ok(documents.length >= 1, 'deve haver ao menos um documento');
  });
});

test('GET /api/documents/:id/download retorna o arquivo', async () => {
  await withServer(async (port) => {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo do download'], { type: 'text/plain' }), 'download.txt');

    const createResponse = await fetch(`http://127.0.0.1:${port}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const created = await createResponse.json();

    const response = await fetch(`http://127.0.0.1:${port}/api/documents/${created.id}/download`);
    assert.strictEqual(response.status, 200, 'download deve funcionar');
    const text = await response.text();
    assert.strictEqual(text, 'conteudo do download');
  });
});
