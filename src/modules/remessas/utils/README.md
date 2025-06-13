# Identificador Inteligente de Documentos Fiscais

Este módulo fornece funcionalidades para identificar diferentes tipos de documentos fiscais em remessas, incluindo NFe, CTe, NFCe e Notas de Serviço.

## Funcionalidades

### `validarChaveDocumento(chave)` / `validarChaveNFe(chave)`

Identifica e valida uma chave de documento fiscal (NFe, CTe, NFCe ou Nota de Serviço).

**Parâmetros:**

- `chave` (string): Chave do documento fiscal

**Retorna:**

```javascript
{
  valida: boolean,
  erros: string[],
  tipoDocumento: {
    tipo: string,           // 'CHAVE_ELETRONICA', 'NOTA_SERVICO', 'DESCONHECIDO'
    subtipo: string,        // 'NFe', 'CTe', 'NFCe' (para chaves eletrônicas)
    descricao: string,      // Descrição legível do tipo
    modelo: string,         // Modelo do documento (para chaves eletrônicas)
    valido: boolean,        // Se o tipo é reconhecido
    comprimento: number     // Comprimento da chave
  },
  componentes: {            // Apenas para chaves eletrônicas válidas
    cuf: string,            // Código da UF (2 dígitos)
    aamm: string,           // Ano e mês (4 dígitos)
    cnpj: string,           // CNPJ do emitente (14 dígitos)
    modelo: string,         // Modelo do documento (2 dígitos)
    serie: string,          // Série (3 dígitos)
    numero: string,         // Número do documento (9 dígitos)
    tpEmis: string,         // Tipo de emissão (1 dígito)
    cnf: string,            // Código numérico (8 dígitos)
    dv: string              // Dígito verificador (1 dígito)
  }
}
```

### `validarChavesRemessa(remessa)`

Identifica e valida todas as chaves de documentos fiscais de uma remessa.

**Parâmetros:**

- `remessa` (object): Objeto da remessa contendo array de títulos

**Retorna:**

```javascript
{
  totalTitulos: number,
  titulosComChave: number,
  titulosSemChave: number,
  chavesValidas: number,
  chavesInvalidas: number,
  detalhes: [
    {
      indice: number,
      identificacao: string,
      temChave: boolean,
      chaveValida: boolean,
      chave: string,
      validacao: object
    }
  ]
}
```

### `formatarChaveNFe(chave)`

Formata uma chave de documento fiscal para exibição com espaços.

**Parâmetros:**

- `chave` (string): Chave do documento fiscal

**Retorna:**

- String formatada com espaços a cada 4 dígitos

### `identificarTipoDocumento(chave)`

Identifica o tipo de documento fiscal baseado na chave.

**Parâmetros:**

- `chave` (string): Chave do documento

**Retorna:**

- Objeto com informações sobre o tipo de documento

## Identificação e Validações Realizadas

### Estrutura da Chave

- Comprimento: deve ter exatamente 44 dígitos
- Formato: deve conter apenas números

### Componentes Validados

1. **Código da UF (2 dígitos)**: Deve ser um código válido de unidade federativa
2. **Ano/Mês (4 dígitos)**: Mês deve estar entre 01-12, ano deve ser >= 2006
3. **CNPJ (14 dígitos)**: Formato básico de CNPJ
4. **Modelo (2 dígitos)**: Deve ser 55 (NFe), 57 (CTe) ou 65 (NFCe)
5. **Série (3 dígitos)**: Deve estar entre 001-999
6. **Número (9 dígitos)**: Deve estar entre 000000001-999999999
7. **Tipo de Emissão (1 dígito)**: Deve estar entre 1-9
8. **Código Numérico (8 dígitos)**: Formato válido
9. **Dígito Verificador (1 dígito)**: Formato válido

## Códigos de UF Válidos

- **Norte**: 11, 12, 13, 14, 15, 16, 17
- **Nordeste**: 21, 22, 23, 24, 25, 26, 27, 28, 29
- **Sudeste**: 31, 32, 33, 35
- **Sul**: 41, 42, 43
- **Centro-Oeste**: 50, 51, 52, 53

## Tipos de Documento Suportados

### Chaves Eletrônicas (44 dígitos)

- **NFe (Modelo 55)**: Nota Fiscal Eletrônica
- **CTe (Modelo 57)**: Conhecimento de Transporte Eletrônico  
- **NFCe (Modelo 65)**: Nota Fiscal de Consumidor Eletrônica

### Notas de Serviço (menos de 44 dígitos)

- Qualquer documento com menos de 44 dígitos é considerado Nota de Serviço e é automaticamente válido

## Exemplo de Uso

```javascript
import { validarChaveDocumento, validarChavesRemessa } from './nfeValidator';

// Identificar NFe
const nfe = validarChaveDocumento('43250690233131000101550010000008111234567890');
console.log(nfe.tipoDocumento.descricao); // "NFe"
console.log(nfe.valida); // true

// Identificar CTe
const cte = validarChaveDocumento('43250690233131000101570010000008111234567890');
console.log(cte.tipoDocumento.descricao); // "CTe"

// Identificar Nota de Serviço
const ns = validarChaveDocumento('123456789');
console.log(ns.tipoDocumento.descricao); // "Nota de Serviço"
console.log(ns.valida); // true

// Identificar documentos da remessa
const identificacao = validarChavesRemessa(remessa);
console.log(`${identificacao.chavesValidas} de ${identificacao.titulosComChave} documentos identificados`);
```

## Componentes da Interface

### `NFeValidationBadge`

Badge inteligente que exibe o status de validação dos documentos fiscais na listagem de remessas:

- Identifica automaticamente o tipo predominante (NFe, CTe, Nota de Serviço, Misto)
- Mostra ícones específicos para cada tipo de documento
- Exibe tooltips informativos com detalhes da validação

### `NFeValidationCard`

Card detalhado que mostra informações completas sobre a validação dos documentos fiscais na página de detalhes da remessa:

- Estatísticas resumidas da validação
- Modal com análise detalhada de cada documento
- Identificação visual do tipo de cada documento
- Lista de erros específicos por documento
