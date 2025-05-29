# Módulo NFe - Nota Fiscal Eletrônica

Este módulo fornece funcionalidades para trabalhar com Notas Fiscais Eletrônicas (NFe), incluindo upload, processamento, visualização e geração de relatórios em PDF.

## Funcionalidades

### 🔍 Pré-visualização de NFe

- Upload de arquivos XML de NFe via drag & drop ou seleção
- Parsing automático dos dados do XML
- Visualização organizada em abas temáticas
- Formatação automática de valores monetários e documentos

### 📄 Geração de PDF

- **Geração de PDF completo** com todos os dados da NFe
- **Layout profissional** com formatação adequada
- **Abertura automática** em nova aba do navegador
- **Processamento client-side** usando jsPDF
- **Múltiplas páginas** quando necessário para grandes volumes de itens

### 📋 Abas de Visualização

1. **Dados Gerais**: Informações básicas da NFe (número, série, chave de acesso)
2. **Participantes**: Dados do emitente e destinatário
3. **Itens**: Lista detalhada dos produtos/serviços
4. **Transporte**: Informações de frete e transportadora
5. **Financeiro**: Dados de cobrança, fatura e duplicatas

### 📋 Ações Disponíveis

- **Gerar PDF**: Cria um documento PDF completo da NFe
- **Baixar JSON**: Exporta os dados estruturados em formato JSON
- **Copiar Chave de Acesso**: Copia a chave da NFe para área de transferência
- **Compartilhar**: Usa a API nativa de compartilhamento do navegador

## Estrutura do Módulo

```text
src/modules/nfe/
├── components/
│   ├── FileUpload.jsx          # Componente de upload de arquivos
│   ├── NfeVisualizacao.jsx     # Componente de visualização da NFe
│   └── NfeAcoes.jsx            # Componente de ações (PDF, JSON, etc.)
├── hooks/
│   └── useNfe.js               # Hook customizado para gerenciar estado
├── pages/
│   └── PreVisualizacaoPage.jsx # Página principal do módulo
├── services/
│   ├── xmlParser.js            # Serviço para parsing de XML
│   └── pdfGenerator.js         # Serviço para geração de PDF
├── routes.jsx                  # Configuração de rotas do módulo
└── README.md                   # Este arquivo
```

## Componentes

### FileUpload

Componente responsável pelo upload de arquivos XML.

**Props:**

- `onFileSelect(file)`: Callback executado quando um arquivo é selecionado
- `loading`: Indica se o processamento está em andamento
- `error`: Mensagem de erro (se houver)

**Funcionalidades:**

- Drag & drop de arquivos
- Validação de tipo e tamanho de arquivo
- Feedback visual durante o upload
- Tratamento de erros

### NfeVisualizacao

Componente que exibe os dados processados da NFe.

**Props:**

- `nfeData`: Objeto com os dados estruturados da NFe

**Funcionalidades:**

- Navegação por abas
- Formatação automática de valores
- Organização hierárquica dos dados
- Interface responsiva

### NfeAcoes

Componente que fornece ações para interagir com os dados da NFe.

**Props:**

**Métodos principais:**

- `parseXmlFile(file)`: Processa um arquivo XML e retorna os dados estruturados
- `extractNfeData(xmlDoc)`: Extrai dados específicos do documento XML
- `formatDateTime(dateString)`: Formata datas e horários
- `formatarMoeda(valor)`: Formata valores monetários

## Hooks

### useNfe

Hook customizado para gerenciar o estado e operações do módulo NFe.

**Retorna:**

- `loading`: Estado de carregamento
- `error`: Mensagem de erro
- `nfeData`: Dados da NFe processada
- `uploadHistory`: Histórico de uploads
- `processarArquivo(file)`: Função para processar arquivo
- `limparDados()`: Limpa dados atuais
- `validarArquivo(file)`: Valida arquivo antes do upload

## Uso

### Integração no Sistema

O módulo é automaticamente integrado nas rotas da aplicação através de:

```javascript
// src/app/routes/routes.jsx
import { nfeRoutes } from "../../modules/nfe/routes";

// As rotas são definidas em:
// /nfe - Página principal do módulo
// /nfe/pre-visualizacao - Alias para a página principal
```

### Menu de Navegação

Um item é adicionado automaticamente ao sidebar da aplicação com o ícone de documento e o texto "NFe".

## Validações

### Arquivos Aceitos

- **Formato**: Apenas arquivos `.xml`
- **Tamanho máximo**: 50MB
- **Estrutura**: Deve ser um XML válido de NFe

### Processamento

- Parsing robusto com tratamento de erros
- Validação de estrutura XML
- Extração segura de dados
- Formatação automática de valores

## Características Técnicas

### Processamento Local

- Todo o processamento é feito no navegador do usuário
- Não há envio de dados para servidor
- Segurança e privacidade dos dados garantidas

### Performance

- Parsing otimizado para arquivos XML grandes
- Interface responsiva durante o processamento
- Feedback visual em tempo real

### Acessibilidade

- Interface compatível com leitores de tela
- Navegação por teclado
- Contrastes adequados para modo escuro/claro

## Extensibilidade

O módulo foi desenvolvido para ser facilmente extensível:

1. **Novos tipos de processamento**: Adicione métodos ao `xmlParser`
2. **Novas visualizações**: Crie componentes adicionais
3. **Validações customizadas**: Estenda o hook `useNfe`
4. **Integrações externas**: Utilize os serviços existentes

## Suporte a Formatos

### XML de NFe

- **Versão**: 4.00 (padrão atual)
- **Namespace**: `http://www.portalfiscal.inf.br/nfe`
- **Elementos suportados**: Todos os principais elementos da NFe

### Dados Extraídos

- Identificação da NFe
- Dados de emitente e destinatário
- Itens com impostos
- Totais fiscais
- Informações de transporte
- Dados de cobrança
- Informações complementares

## Troubleshooting

### Problemas Comuns

1. **Erro de parsing XML**
   - Verifique se o arquivo não está corrompido
   - Confirme que é um XML válido de NFe

2. **Arquivo muito grande**
   - O limite é de 50MB
   - Considere compactar o arquivo se necessário

3. **Dados não exibidos**
   - Verifique se o XML contém os elementos esperados
   - Consulte o console do navegador para erros detalhados

### Logs de Debug

O módulo registra informações detalhadas no console do navegador para facilitar a depuração.
