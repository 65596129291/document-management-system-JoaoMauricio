# Prompt personalizado - Document Management System

## Objetivo

Implementar e evoluir o Document Management System (DMS) em conformidade com as regras do projeto: backend em Node.js + Express, frontend em React + Vite, armazenamento local com multer, metadados em memória e arquitetura em camadas simples.

## Contexto do projeto

- Backend em Clean Architecture simples: routes -> controllers -> services -> repositories
- Frontend em React com componentes funcionais e hooks
- Armazenamento físico dos arquivos em backend/storage via multer com diskStorage
- Metadados dos documentos mantidos em memória nesta fase inicial
- Reuso e evitar duplicação de lógica e código
- Comunicação do frontend com o backend via fetch usando prefixo /api
- Não utilizar provedores externos de armazenamento

## Regras obrigatórias

1. Respeitar a Clean Architecture simples no backend.
2. Os uploads devem ser gravados localmente em backend/storage.
3. Manter os metadados dos documentos em memória.
4. Criar rotas POST /upload, GET /documents e GET /documents/:id/download no backend.
5. Registrar o roteador no backend/src/app.js.
6. Criar componentes funcionais e reutilizáveis em frontend/src/components.
7. Criar cliente de API em frontend/src/services para consumir o backend via fetch com prefixo /api.
8. Atualizar App.jsx para montar a interface de upload, listagem e download.
9. Evitar duplicação e reutilizar componentes sempre que possível.
10. Validar com testes e/ou build quando apropriado.

## Fluxo de trabalho recomendado

1. Implementar o backend em camadas sem quebrar as convenções do projeto.
2. Confirmar o funcionamento das rotas e do armazenamento local.
3. Criar os componentes do frontend para upload, listagem e download.
4. Centralizar as chamadas à API em um serviço específico.
5. Montar a interface principal na raiz da aplicação.
6. Validar que o sistema funciona de ponta a ponta com o backend.

## Resultado esperado

Um DMS funcional com:
- upload de arquivos
- listagem dos documentos
- download pelo identificador
- persistência local dos arquivos
- interface mínima inteiramente operacional

## Observações

- Priorizar soluções simples, legíveis e alinhadas ao projeto.
- Não adicionar complexidade desnecessária.
- Manter o isolamento das responsabilidades por camada.
- Documentar apenas o necessário e manter o código compatível com as convenções já existentes.
