import DOMPurify from 'dompurify';

/**
 * Utilitários para processamento de texto das NFe
 */

/**
 * Processa texto com HTML e quebras de linha para exibição web
 * @param {string} texto - Texto a ser processado
 * @returns {string} - HTML sanitizado e formatado
 */
export const processarTextoParaWeb = (texto) => {
    if (!texto) return '';
    
    // Primeiro, converter quebras de linha para <br>
    let textoProcessado = texto.replace(/\\n\\n/g, '<br><br>').replace(/\\n/g, '<br>');
    
    // Sanitizar HTML mantendo tags básicas de formatação
    const configDOMPurify = {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
            'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'table', 'tr', 'td', 'th', 'thead', 'tbody', 'font'
        ],
        ALLOWED_ATTR: ['class', 'style'],
        KEEP_CONTENT: true,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM: false
    };
    
    return DOMPurify.sanitize(textoProcessado, configDOMPurify);
};

/**
 * Processa texto removendo HTML e formatando para PDF
 * @param {string} texto - Texto a ser processado
 * @returns {string} - Texto limpo para PDF
 */
export const processarTextoParaPdf = (texto) => {
    if (!texto) return '';
    
    // Remover tags HTML
    let textoLimpo = texto.replace(/<[^>]*>/g, '');
    
    // Decodificar entidades HTML comuns
    const entidades = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' ',
        '&apos;': "'"
    };
    
    Object.entries(entidades).forEach(([entidade, caractere]) => {
        textoLimpo = textoLimpo.replace(new RegExp(entidade, 'g'), caractere);
    });
    
    // Normalizar quebras de linha
    textoLimpo = textoLimpo.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Limitar quebras de linha consecutivas
    textoLimpo = textoLimpo.replace(/\n{3,}/g, '\n\n');
    
    // Remover espaços extras e tabs
    textoLimpo = textoLimpo.replace(/[ \t]+/g, ' ');
    
    // Remover espaços no início e fim das linhas
    textoLimpo = textoLimpo.split('\n').map(linha => linha.trim()).join('\n');

    textoLimpo = textoLimpo.replace(/\\n/g, '\n');
    
    return textoLimpo.trim();
};

/**
 * Quebra texto longo em linhas para PDF
 * @param {string} texto - Texto a ser quebrado
 * @param {number} larguraMaxima - Largura máxima em caracteres
 * @returns {string[]} - Array de linhas
 */
export const quebrarTextoParaPdf = (texto, larguraMaxima = 80) => {
    if (!texto) return [];
    
    const linhas = [];
    const paragrafos = texto.split('\n');
    
    paragrafos.forEach(paragrafo => {
        if (paragrafo.trim() === '') {
            linhas.push('');
            return;
        }
        
        const palavras = paragrafo.split(' ');
        let linhaAtual = '';
        
        palavras.forEach(palavra => {
            if ((linhaAtual + ' ' + palavra).length <= larguraMaxima) {
                linhaAtual += (linhaAtual ? ' ' : '') + palavra;
            } else {
                if (linhaAtual) {
                    linhas.push(linhaAtual);
                }
                linhaAtual = palavra;
            }
        });
        
        if (linhaAtual) {
            linhas.push(linhaAtual);
        }
    });
    
    return linhas;
};

/**
 * Detecta se o texto contém HTML
 * @param {string} texto - Texto a ser verificado
 * @returns {boolean} - True se contém HTML
 */
export const contemHtml = (texto) => {
    if (!texto) return false;
    return /<[^>]*>/g.test(texto);
};

/**
 * Conta o número de linhas que o texto ocupará no PDF
 * @param {string} texto - Texto a ser analisado
 * @param {number} larguraMaxima - Largura máxima em caracteres
 * @returns {number} - Número de linhas
 */
export const contarLinhasPdf = (texto, larguraMaxima = 80) => {
    const textoProcessado = processarTextoParaPdf(texto);
    const linhas = quebrarTextoParaPdf(textoProcessado, larguraMaxima);
    return linhas.length;
}; 