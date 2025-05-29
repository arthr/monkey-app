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

### 🎨 Processamento Avançado de Texto

- **Suporte a HTML**: Renderização segura de conteúdo HTML nas informações complementares
- **Quebras de linha**: Processamento correto de `\n`, `\n\n` e outros caracteres especiais
- **Sanitização**: Remoção de HTML perigoso mantendo formatação básica
- **Modo duplo**: Visualização formatada ou código HTML bruto
- **PDF otimizado**: Conversão inteligente de HTML para texto limpo no PDF

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
├── utils/
│   └── textUtils.js            # Utilitários para processamento de texto
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
- **Processamento avançado de texto** nas informações complementares

### NfeAcoes

Componente que fornece ações para interagir com os dados da NFe.

**Props:**

- `nfeData`: Objeto com os dados da NFe
- `className`: Classes CSS adicionais (opcional)

**Funcionalidades:**

- Botão principal para gerar PDF
- Menu dropdown com ações adicionais
- Estados de loading para cada ação
- Tratamento de erros integrado

## Serviços

### xmlParser

Serviço responsável por fazer o parsing do XML da NFe e extrair os dados relevantes.

**Métodos principais:**

- `parseXmlFile(file)`: Processa um arquivo XML e retorna os dados estruturados
- `extractNfeData(xmlDoc)`: Extrai dados específicos do documento XML
- `formatDateTime(dateString)`: Formata datas e horários
- `formatarMoeda(valor)`: Formata valores monetários

### pdfGenerator

Serviço responsável por gerar documentos PDF a partir dos dados da NFe usando jsPDF.

**Funcionalidades:**

- **Layout profissional**: Cabeçalho, seções organizadas e rodapé
- **Formatação automática**: Valores monetários, documentos e datas
- **Tabelas estruturadas**: Itens com formatação adequada
- **Múltiplas páginas**: Suporte automático para grandes volumes de dados
- **Abertura automática**: PDF aberto em nova aba do navegador
- **Processamento de texto avançado**: Conversão inteligente de HTML para texto

**Métodos principais:**

- `gerarPdf(nfeData)`: Gera PDF completo da NFe
- `adicionarCabecalho()`: Adiciona cabeçalho com dados principais
- `adicionarItens()`: Cria tabela formatada de itens
- `adicionarTotais()`: Inclui resumo financeiro
- `adicionarInformacoesComplementares()`: Processa e adiciona informações complementares
- `formatarMoeda()`: Formata valores monetários

## Utilitários

### textUtils

Conjunto de utilitários para processamento avançado de texto com suporte a HTML e quebras de linha.

**Funcionalidades:**

#### Para Interface Web

- `processarTextoParaWeb(texto)`: Converte texto com HTML e quebras de linha para exibição web segura
- `contemHtml(texto)`: Detecta se o texto contém tags HTML

#### Para PDF

- `processarTextoParaPdf(texto)`: Remove HTML e formata texto para PDF
- `quebrarTextoParaPdf(texto, largura)`: Quebra texto em linhas adequadas
- `contarLinhasPdf(texto, largura)`: Conta linhas necessárias no PDF

**Exemplo de uso:**

```javascript
import { processarTextoParaWeb, processarTextoParaPdf } from '../utils/textUtils';

// Para exibição web
const htmlSeguro = processarTextoParaWeb('Texto com <strong>HTML</strong>\n\nE quebras de linha');

// Para PDF
const textoLimpo = processarTextoParaPdf('Texto com <strong>HTML</strong>\n\nE quebras de linha');
```

## Hooks

### useNfe

Hook customizado para gerenciar o estado e operações do módulo NFe.

**Retorna:**

- `loading`: Estado de carregamento do parsing
- `gerandoPdf`: Estado de geração do PDF
- `error`: Mensagem de erro
- `nfeData`: Dados da NFe processada
- `uploadHistory`: Histórico de uploads
- `processarArquivo(file)`: Função para processar arquivo
- `gerarPdf()`: Função para gerar PDF
- `limparDados()`: Limpa dados atuais
- `validarArquivo(file)`: Valida arquivo antes do upload
- `baixarJson()`: Baixa dados em formato JSON

## Dependências

### Principais

- **jsPDF**: Biblioteca para geração de PDF no client-side
- **DOMPurify**: Sanitização segura de HTML
- **React**: Framework base
- **Flowbite React**: Componentes de interface
- **React Icons**: Ícones do sistema

### Instalação

```bash
npm install jspdf dompurify
# ou
pnpm install jspdf dompurify
```

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

### Exemplo de Uso do Componente de Ações

```jsx
import NfeAcoes from './components/NfeAcoes';

// Em um componente
<NfeAcoes nfeData={dadosDaNfe} className="my-4" />
```

### Exemplo de Processamento de Texto

```jsx
// Componente para informações complementares com HTML
const InformacoesComplementares = ({ texto }) => {
    const textoProcessado = processarTextoParaWeb(texto);
    const temHtml = contemHtml(texto);
    
    return (
        <div 
            className={temHtml ? "html-content" : "plain-text"}
            dangerouslySetInnerHTML={{ __html: textoProcessado }}
        />
    );
};
```

## Validações

### Arquivos Aceitos

- **Formato**: Apenas arquivos `.xml`
- **Tamanho máximo**: 50MB
- **Estrutura**: Deve ser um XML válido de NFe

### Processamento de Texto

- **HTML permitido**: Tags básicas de formatação (p, br, strong, b, em, i, etc.)
- **Sanitização**: Remove scripts e conteúdo perigoso
- **Quebras de linha**: Suporta `\n`, `\n\n`, `\r\n`
- **Entidades HTML**: Decodifica automaticamente (&amp;, &lt;, etc.)

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

### Geração de PDF

- **Cliente-side**: Processamento 100% local usando jsPDF
- **Múltiplas páginas**: Suporte automático para conteúdo extenso
- **Formatação responsiva**: Ajuste automático de layout
- **Qualidade profissional**: Layout limpo e organizado
- **Texto inteligente**: Conversão automática de HTML para texto limpo

### Processamento de Texto Avançado

- **Sanitização segura**: Remove conteúdo perigoso mantendo formatação
- **Detecção automática**: Identifica presença de HTML no texto
- **Quebra inteligente**: Respeita largura da página no PDF
- **Preservação de formatação**: Mantém quebras de linha intencionais

### Performance

- Parsing otimizado para arquivos XML grandes
- Interface responsiva durante o processamento
- Feedback visual em tempo real
- Geração de PDF otimizada

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
5. **Customização de PDF**: Modifique o `pdfGenerator` para layouts específicos
6. **Processamento de texto**: Estenda `textUtils` para novos formatos

## Suporte a Formatos

### XML de NFe

- **Versão**: 4.00 (padrão atual)
- **Namespace**: `http://www.portalfiscal.inf.br/nfe`
- **Elementos suportados**: Todos os principais elementos da NFe

### HTML nas Informações Complementares

- **Tags suportadas**: p, br, strong, b, em, i, u, span, div, ul, ol, li, h1-h6, table, tr, td, th
- **Atributos permitidos**: class, style (limitados)
- **Entidades HTML**: Decodificação automática
- **Quebras de linha**: `\n`, `\n\n`, `\r\n`

### PDF Gerado

- **Formato**: PDF/A compatível
- **Tamanho**: A4 (210x297mm)
- **Fontes**: Helvetica (padrão)
- **Estrutura**: Múltiplas seções organizadas
- **Texto limpo**: HTML convertido automaticamente

### Dados Extraídos

- Identificação da NFe
- Dados de emitente e destinatário
- Itens com impostos
- Totais fiscais
- Informações de transporte
- Dados de cobrança
- **Informações complementares com processamento avançado**

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

4. **PDF não gera**
   - Verifique se o bloqueador de pop-ups está desabilitado
   - Confirme que há dados suficientes na NFe
   - Consulte o console para erros de jsPDF

5. **HTML não renderiza corretamente**
   - Verifique se as tags HTML estão na lista de permitidas
   - Confirme que não há JavaScript no conteúdo
   - Use o botão "HTML" para ver o código bruto

6. **Informações complementares cortadas no PDF**
   - O sistema quebra automaticamente texto longo
   - Limite de 80 caracteres por linha
   - Múltiplas páginas são criadas automaticamente

### Logs de Debug

O módulo registra informações detalhadas no console do navegador para facilitar a depuração.

## Contribuição

Para contribuir com melhorias:

1. **Novos layouts de PDF**: Modifique `pdfGenerator.js`
2. **Suporte a outros formatos**: Estenda `xmlParser.js`
3. **Novas ações**: Adicione funcionalidades em `NfeAcoes.jsx`
4. **Melhorias de UX**: Atualize componentes de interface
5. **Processamento de texto**: Estenda `textUtils.js` para novos casos de uso
