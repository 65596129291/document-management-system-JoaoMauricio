# Especificação - Document Management System

## 1. Objetivo

Permitir que usuários enviem, consultem e baixem documentos de forma simples e segura, mantendo o armazenamento local da aplicação e registrando os metadados essenciais do arquivo.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário
- Armazenamento local dos arquivos no filesystem da aplicação
- Registro de metadados essenciais em memória
- Configuração por variáveis de ambiente

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Edição de arquivos após o upload
- Compartilhamento público de documentos
- Busca por conteúdo do arquivo
- Histórico detalhado de ações
- Controle avançado de permissões por perfil ou papel
- Integração com serviços de terceiros

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O usuário pode enviar um documento para o sistema. |
| RF-02 | O sistema deve registrar os metadados obrigatórios do documento enviado. |
| RF-03 | O usuário pode consultar a lista de documentos cadastrados. |
| RF-04 | O usuário pode solicitar o download de um documento por identificador único. |
| RF-05 | O sistema deve indicar erro quando o documento solicitado não existir. |
| RF-06 | O sistema deve associar cada documento ao usuário responsável pelo envio. |
| RF-07 | O sistema deve manter a relação entre o arquivo físico e seus metadados para permitir o download correto. |
| RF-08 | O sistema deve disponibilizar informações básicas do documento, incluindo identificação e data de upload. |
| RF-09 | O sistema deve rejeitar requisições de upload sem arquivo válido ou sem o conteúdo esperado. |
| RF-10 | O sistema deve fornecer uma resposta clara para erros de leitura, gravação ou ausência de item. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos enviados devem ser gravados no filesystem local da aplicação, na pasta backend/storage, utilizando multer com diskStorage. |
| RNF-02 | Os metadados dos documentos devem ser mantidos em memória nesta fase inicial do projeto. |
| RNF-03 | A configuração da aplicação deve ser feita por variáveis de ambiente, conforme a abordagem de 12-Factor App. |
| RNF-04 | O sistema deve priorizar simplicidade, clareza e manutenibilidade sobre abstrações complexas. |
| RNF-05 | O sistema deve tratar erros de I/O e acesso de forma controlada e previsível. |
| RNF-06 | A API deve ter comportamento consistente para operações de upload, listagem e download. |
| RNF-07 | A solução deve permitir evolução incremental sem introduzir complexidade desnecessária. |
| RNF-08 | A arquitetura da aplicação deve seguir a estrutura em camadas: routes, controllers, services e repositories. |

## 5. Modelo de dados (metadados do documento)

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | string | Identificador único do documento. |
| originalName | string | Nome original do arquivo enviado pelo usuário. |
| size | number | Tamanho do arquivo em bytes. |
| uploadedAt | string | Data e hora do upload em formato ISO 8601. |
| owner | string | Identificador do usuário dono do documento. |

### Observações do modelo

- O modelo acima representa os metadados essenciais do documento.
- O conteúdo binário do arquivo é armazenado separadamente no filesystem local.
- O campo owner permite organizar os documentos por usuário de forma simples.
- O identificador do documento deve ser único para evitar colisões entre itens.
- Em esta fase inicial, a persistência dos metadados é em memória e não em banco de dados.

## 6. Contratos de API

### 6.1. POST /upload

Descrição: realiza o envio de um documento para o sistema.

- Método: POST
- Content-Type: multipart/form-data
- Entrada: arquivo enviado no corpo da requisição, possivelmente associado ao usuário responsável pelo upload
- Saída esperada: objeto com os metadados do documento criado
- Erros esperados:
  - arquivo ausente
  - arquivo inválido
  - falha de gravação no filesystem
  - erro interno do servidor

Exemplo de resposta esperada:

```json
{
  "id": "doc-123",
  "originalName": "relatorio.pdf",
  "size": 245678,
  "uploadedAt": "2026-09-23T14:30:00.000Z",
  "owner": "usuario-01"
}
```

### 6.2. GET /documents

Descrição: lista os documentos cadastrados.

- Método: GET
- Saída esperada: array de objetos contendo os metadados dos documentos
- Erros esperados:
  - falha de leitura dos metadados
  - erro interno do sistema

Exemplo de resposta esperada:

```json
[
  {
    "id": "doc-123",
    "originalName": "relatorio.pdf",
    "size": 245678,
    "uploadedAt": "2026-09-23T14:30:00.000Z",
    "owner": "usuario-01"
  },
  {
    "id": "doc-456",
    "originalName": "contrato.pdf",
    "size": 189340,
    "uploadedAt": "2026-09-23T16:10:00.000Z",
    "owner": "usuario-02"
  }
]
```

### 6.3. GET /documents/:id/download

Descrição: recupera o arquivo associado a um documento específico.

- Método: GET
- Parâmetro obrigatório: id do documento
- Saída esperada: conteúdo binário do arquivo solicitado, com cabeçalhos apropriados para download
- Erros esperados:
  - documento inexistente
  - arquivo não localizado
  - falha de leitura do arquivo

Comportamento esperado:

- Se o identificador for válido e o arquivo existir, a resposta deve devolver o conteúdo do arquivo para download.
- Se o identificador não existir, a API deve retornar erro de recurso não encontrado.
- Se o arquivo físico estiver ausente, a API deve indicar falha de processamento ou inconsistência de dados.

## 7. Decisões arquiteturais

- O backend será organizado em uma estrutura simples de Clean Architecture, com as camadas: routes, controllers, services e repositories.
- A dependência entre as camadas seguirá a ordem: routes -> controllers -> services -> repositories.
- O frontend será implementado com componentes funcionais em React, organizados por componentes, páginas e serviços.
- A comunicação entre frontend e backend será feita por fetch com prefixo /api, conforme a configuração do Vite.
- O armazenamento dos arquivos será estritamente local, respeitando a limitação do projeto.
- Os metadados serão mantidos em memória nesta fase inicial, sem persistência em banco de dados.
- A configuração da aplicação será feita por variáveis de ambiente para manter a configuração separada do código.
- A solução deve priorizar simplicidade, previsibilidade e evolução incremental.
- Não serão introduzidas integrações externas ou mecanismos de armazenamento complexos nesta etapa.

## 8. Plano de execução em etapas

### Etapa 1 - Definição da base do sistema

- Definir o objetivo do produto e os limites do escopo.
- Confirmar a arquitetura em camadas do backend e a organização do frontend.
- Validar a política de armazenamento local e os requisitos de metadados em memória.

### Etapa 2 - Estrutura funcional mínima

- Definir o fluxo principal de upload de documentos.
- Estabelecer a operação de listagem dos documentos cadastrados.
- Preparar a operação de download baseada no identificador do documento.

### Etapa 3 - Regras de negócio e validação

- Garantir que cada documento tenha identificação única.
- Verificar a associação entre arquivo físico e metadados.
- Tratar cenários de documento inexistente, arquivo ausente e falha de leitura/escrita.

### Etapa 4 - Qualidade e confiabilidade

- Revisar mensagens de erro e respostas HTTP esperadas.
- Confirmar que a aplicação atende às necessidades básicas de gestão documental.
- Verificar aderência às regras de arquitetura e restrições de armazenamento definidas no projeto.

### Etapa 5 - Evolução incremental

- Expandir somente quando houver demanda funcional clara.
- Avaliar melhorias futuras sem comprometer a simplicidade do sistema atual.
- Preparar a base para features posteriores, como controle mais refinado de usuários e persistência de dados.

## 9. Critérios de aceitação

- O sistema permite realizar upload de documentos válidos.
- O sistema lista todos os documentos com seus metadados básicos.
- O sistema permite baixar um documento pelo identificador correto.
- O sistema responde com erro apropriado quando o documento não existe.
- Os arquivos físicos ficam armazenados localmente na pasta de armazenamento definida.
- Os metadados dos documentos são registrados e consultados corretamente em memória.
- A arquitetura e as convenções do projeto são respeitadas durante a implementação futura.

## 10. Resumo executivo

O Document Management System proposto tem como propósito fornecer uma solução simples e funcional para upload, listagem e download de documentos em ambiente local. A implementação futura deve manter o armazenamento dos arquivos no filesystem local da aplicação, preservar a organização em Clean Architecture no backend e seguir princípios de simplicidade, clareza e evolução incremental. Esta especificação serve como referência para o desenvolvimento futuro do sistema sem incluir ainda a execução de arquivos de backend ou frontend.
