/**
 * Utilitário para validação de chaves de NFe
 */

// Códigos de UF válidos para NFe
const CODIGOS_UF_VALIDOS = [
    11, 12, 13, 14, 15, 16, 17, // Norte
    21, 22, 23, 24, 25, 26, 27, 28, 29, // Nordeste
    31, 32, 33, 35, // Sudeste
    41, 42, 43, // Sul
    50, 51, 52, 53 // Centro-Oeste
];

// Modelos de documento fiscal válidos
const MODELOS_VALIDOS = {
    '55': 'NFe',     // Nota Fiscal Eletrônica
    '57': 'CTe',     // Conhecimento de Transporte Eletrônico
    '65': 'NFCe'     // Nota Fiscal de Consumidor Eletrônica
};

// Tipos de documento baseados no comprimento
const TIPOS_DOCUMENTO = {
    44: 'CHAVE_ELETRONICA', // NFe, CTe, NFCe
    MENOR_44: 'NOTA_SERVICO' // Notas de Serviço
};

/**
 * Valida se uma string contém apenas dígitos
 * @param {string} str - String a ser validada
 * @returns {boolean} - True se contém apenas dígitos
 */
const isNumeric = (str) => {
    return /^\d+$/.test(str);
};

/**
 * Valida o código da UF
 * @param {string} cuf - Código da UF (2 dígitos)
 * @returns {boolean} - True se válido
 */
const validarCodigoUF = (cuf) => {
    if (!cuf || cuf.length !== 2 || !isNumeric(cuf)) {
        return false;
    }
    return CODIGOS_UF_VALIDOS.includes(parseInt(cuf));
};

/**
 * Valida o ano e mês de emissão
 * @param {string} aamm - Ano e mês (4 dígitos)
 * @returns {boolean} - True se válido
 */
const validarAnoMes = (aamm) => {
    if (!aamm || aamm.length !== 4 || !isNumeric(aamm)) {
        return false;
    }
    
    const ano = parseInt(aamm.substring(0, 2));
    const mes = parseInt(aamm.substring(2, 4));
    
    // Validar mês (01-12)
    if (mes < 1 || mes > 12) {
        return false;
    }
    
    // Validar ano (considerando anos de 2006 em diante quando a NFe foi criada)
    const anoCompleto = ano >= 50 ? 1900 + ano : 2000 + ano;
    const anoAtual = new Date().getFullYear();
    
    return anoCompleto >= 2006 && anoCompleto <= anoAtual;
};

/**
 * Valida o CNPJ
 * @param {string} cnpj - CNPJ (14 dígitos)
 * @returns {boolean} - True se válido
 */
const validarCNPJ = (cnpj) => {
    if (!cnpj || cnpj.length !== 14 || !isNumeric(cnpj)) {
        return false;
    }
    
    // Verificar se não são todos os dígitos iguais
    if (/^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }
    
    return true; // Validação básica de formato
};

/**
 * Valida o modelo do documento fiscal
 * @param {string} modelo - Modelo (2 dígitos)
 * @returns {boolean} - True se válido
 */
const validarModelo = (modelo) => {
    if (!modelo || modelo.length !== 2 || !isNumeric(modelo)) {
        return false;
    }
    return Object.keys(MODELOS_VALIDOS).includes(modelo);
};

/**
 * Valida a série
 * @param {string} serie - Série (3 dígitos)
 * @returns {boolean} - True se válido
 */
const validarSerie = (serie) => {
    if (!serie || serie.length !== 3 || !isNumeric(serie)) {
        return false;
    }
    const serieNum = parseInt(serie);
    return serieNum >= 0 && serieNum <= 999;
};

/**
 * Valida o número da NFe
 * @param {string} numero - Número (9 dígitos)
 * @returns {boolean} - True se válido
 */
const validarNumero = (numero) => {
    if (!numero || numero.length !== 9 || !isNumeric(numero)) {
        return false;
    }
    const numeroInt = parseInt(numero);
    return numeroInt >= 1 && numeroInt <= 999999999;
};

/**
 * Valida o tipo de emissão
 * @param {string} tpEmis - Tipo de emissão (1 dígito)
 * @returns {boolean} - True se válido
 */
const validarTipoEmissao = (tpEmis) => {
    if (!tpEmis || tpEmis.length !== 1 || !isNumeric(tpEmis)) {
        return false;
    }
    const tipo = parseInt(tpEmis);
    return tipo >= 1 && tipo <= 9;
};

/**
 * Valida o código numérico
 * @param {string} cnf - Código numérico (8 dígitos)
 * @returns {boolean} - True se válido
 */
const validarCodigoNumerico = (cnf) => {
    if (!cnf || cnf.length !== 8 || !isNumeric(cnf)) {
        return false;
    }
    return true;
};

/**
 * Valida o dígito verificador
 * @param {string} dv - Dígito verificador (1 dígito)
 * @returns {boolean} - True se válido
 */
const validarDigitoVerificador = (dv) => {
    if (!dv || dv.length !== 1 || !isNumeric(dv)) {
        return false;
    }
    return true;
};

/**
 * Identifica o tipo de documento fiscal baseado na chave
 * @param {string} chave - Chave do documento
 * @returns {object} - Informações sobre o tipo de documento
 */
const identificarTipoDocumento = (chave) => {
    if (!chave) {
        return {
            tipo: 'DESCONHECIDO',
            descricao: 'Chave não fornecida',
            valido: false
        };
    }

    const chaveLimpa = String(chave).trim();
    
    // Nota de Serviço (menos de 44 dígitos)
    if (chaveLimpa.length < 44) {
        return {
            tipo: 'NOTA_SERVICO',
            descricao: 'Nota de Serviço',
            valido: true,
            comprimento: chaveLimpa.length
        };
    }
    
    // Chave eletrônica (44 dígitos)
    if (chaveLimpa.length === 44 && isNumeric(chaveLimpa)) {
        const modelo = chaveLimpa.substring(20, 22);
        const tipoModelo = MODELOS_VALIDOS[modelo];
        
        if (tipoModelo) {
            return {
                tipo: 'CHAVE_ELETRONICA',
                subtipo: tipoModelo,
                descricao: tipoModelo,
                modelo: modelo,
                valido: true,
                comprimento: 44
            };
        }
        
        return {
            tipo: 'CHAVE_ELETRONICA',
            subtipo: 'DESCONHECIDO',
            descricao: `Chave eletrônica com modelo desconhecido (${modelo})`,
            modelo: modelo,
            valido: false,
            comprimento: 44
        };
    }
    
    // Outros casos
    return {
        tipo: 'DESCONHECIDO',
        descricao: `Formato não reconhecido (${chaveLimpa.length} dígitos)`,
        valido: false,
        comprimento: chaveLimpa.length
    };
};

/**
 * Valida uma chave de documento fiscal (NFe, CTe, NFCe ou Nota de Serviço)
 * @param {string} chave - Chave do documento
 * @returns {object} - Objeto com resultado da validação
 */
export const validarChaveDocumento = (chave) => {
    const resultado = {
        valida: false,
        erros: [],
        componentes: null,
        tipoDocumento: null
    };
    
    // Identificar tipo de documento
    const tipoDoc = identificarTipoDocumento(chave);
    resultado.tipoDocumento = tipoDoc;
    
    // Verificar se a chave foi fornecida
    if (!chave) {
        resultado.erros.push('Chave não fornecida');
        return resultado;
    }
    
    // Remover espaços e converter para string
    const chaveLimpa = String(chave).trim();
    
    // Se for Nota de Serviço (menos de 44 dígitos), considerar válida
    if (tipoDoc.tipo === 'NOTA_SERVICO') {
        resultado.valida = true;
        return resultado;
    }
    
    // Para chaves eletrônicas, validar estrutura completa
    if (tipoDoc.tipo === 'CHAVE_ELETRONICA') {
        // Verificar comprimento
        if (chaveLimpa.length !== 44) {
            resultado.erros.push(`Chave eletrônica deve ter 44 dígitos, encontrados ${chaveLimpa.length}`);
            return resultado;
        }
        
        // Verificar se contém apenas números
        if (!isNumeric(chaveLimpa)) {
            resultado.erros.push('Chave deve conter apenas números');
            return resultado;
        }
    } else {
        // Tipo desconhecido
        resultado.erros.push(`Tipo de documento não reconhecido: ${tipoDoc.descricao}`);
        return resultado;
    }
    
    // Extrair componentes da chave
    const componentes = {
        cuf: chaveLimpa.substring(0, 2),
        aamm: chaveLimpa.substring(2, 6),
        cnpj: chaveLimpa.substring(6, 20),
        modelo: chaveLimpa.substring(20, 22),
        serie: chaveLimpa.substring(22, 25),
        numero: chaveLimpa.substring(25, 34),
        tpEmis: chaveLimpa.substring(34, 35),
        cnf: chaveLimpa.substring(35, 43),
        dv: chaveLimpa.substring(43, 44)
    };
    
    resultado.componentes = componentes;
    
    // Validar cada componente
    if (!validarCodigoUF(componentes.cuf)) {
        resultado.erros.push(`Código da UF inválido: ${componentes.cuf}`);
    }
    
    if (!validarAnoMes(componentes.aamm)) {
        resultado.erros.push(`Ano/Mês inválido: ${componentes.aamm}`);
    }
    
    if (!validarCNPJ(componentes.cnpj)) {
        resultado.erros.push(`CNPJ inválido: ${componentes.cnpj}`);
    }
    
            if (!validarModelo(componentes.modelo)) {
            const modelosValidos = Object.keys(MODELOS_VALIDOS).join(', ');
            resultado.erros.push(`Modelo inválido: ${componentes.modelo} (deve ser ${modelosValidos})`);
        }
    
    if (!validarSerie(componentes.serie)) {
        resultado.erros.push(`Série inválida: ${componentes.serie}`);
    }
    
    if (!validarNumero(componentes.numero)) {
        resultado.erros.push(`Número inválido: ${componentes.numero}`);
    }
    
    if (!validarTipoEmissao(componentes.tpEmis)) {
        resultado.erros.push(`Tipo de emissão inválido: ${componentes.tpEmis}`);
    }
    
    if (!validarCodigoNumerico(componentes.cnf)) {
        resultado.erros.push(`Código numérico inválido: ${componentes.cnf}`);
    }
    
    if (!validarDigitoVerificador(componentes.dv)) {
        resultado.erros.push(`Dígito verificador inválido: ${componentes.dv}`);
    }
    
    // Se não há erros, a chave é válida
    resultado.valida = resultado.erros.length === 0;
    
    return resultado;
};

/**
 * Valida as chaves de documentos fiscais de uma remessa
 * @param {object} remessa - Objeto da remessa
 * @returns {object} - Resultado da validação
 */
export const validarChavesRemessa = (remessa) => {
    const resultado = {
        totalTitulos: 0,
        titulosComChave: 0,
        titulosSemChave: 0,
        chavesValidas: 0,
        chavesInvalidas: 0,
        detalhes: []
    };
    
    if (!remessa || !remessa.titulos || !Array.isArray(remessa.titulos)) {
        return resultado;
    }
    
    resultado.totalTitulos = remessa.titulos.length;
    
    remessa.titulos.forEach((titulo, index) => {
        const detalhe = {
            indice: index,
            numeroDocumento: titulo.numeroDocumento || `Título ${index + 1}`,
            identificacao: titulo.identificacaoTituloEmpresa || `Título ${index + 1}`,
            temChave: false,
            chaveValida: false,
            chave: null,
            validacao: null
        };
        
        if (titulo.chaveNotaFiscal) {
            detalhe.temChave = true;
            detalhe.chave = titulo.chaveNotaFiscal;
            resultado.titulosComChave++;
            
            const validacao = validarChaveDocumento(titulo.chaveNotaFiscal);
            detalhe.validacao = validacao;
            detalhe.chaveValida = validacao.valida;
            
            if (validacao.valida) {
                resultado.chavesValidas++;
            } else {
                resultado.chavesInvalidas++;
            }
        } else {
            resultado.titulosSemChave++;
        }
        
        resultado.detalhes.push(detalhe);
    });
    
    return resultado;
};

/**
 * Formata uma chave de documento fiscal para exibição
 * @param {string} chave - Chave do documento fiscal
 * @returns {string} - Chave formatada
 */
export const formatarChaveNFe = (chave) => {
    if (!chave) {
        return chave;
    }
    
    const chaveLimpa = String(chave).trim();
    
    // Para chaves eletrônicas (44 dígitos), formatar com espaços
    if (chaveLimpa.length === 44) {
        // Formato: 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000
        return chaveLimpa.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    // Para Notas de Serviço ou outros formatos, retornar como está
    return chaveLimpa;
};

// Manter compatibilidade com nome antigo
export const validarChaveNFe = validarChaveDocumento;

export default {
    validarChaveDocumento,
    validarChaveNFe,
    validarChavesRemessa,
    formatarChaveNFe,
    identificarTipoDocumento
}; 