/**
 * Serviço para fazer o parsing de arquivos XML de NFe
 */

class NfeXmlParser {
    /**
     * Faz o parsing do arquivo XML da NFe
     * @param {File} xmlFile - Arquivo XML da NFe
     * @returns {Promise<Object>} - Dados extraídos da NFe
     */
    async parseXmlFile(xmlFile) {
        try {
            const xmlText = await this.readFileAsText(xmlFile);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            // Verifica se houve erro no parsing
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('Erro ao fazer parsing do XML: ' + parserError.textContent);
            }

            return this.extractNfeData(xmlDoc);
        } catch (error) {
            console.error('Erro ao processar arquivo XML:', error);
            throw error;
        }
    }

    /**
     * Lê o arquivo como texto
     * @param {File} file - Arquivo a ser lido
     * @returns {Promise<string>} - Conteúdo do arquivo como string
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }

    /**
     * Extrai os dados relevantes do XML da NFe
     * @param {Document} xmlDoc - Documento XML parseado
     * @returns {Object} - Dados estruturados da NFe
     */
    extractNfeData(xmlDoc) {
        const nfe = {
            // Dados de identificação
            identificacao: this.extractIdentificacao(xmlDoc),
            
            // Dados do emitente
            emitente: this.extractEmitente(xmlDoc),
            
            // Dados do destinatário
            destinatario: this.extractDestinatario(xmlDoc),
            
            // Itens da NFe
            itens: this.extractItens(xmlDoc),
            
            // Totais
            totais: this.extractTotais(xmlDoc),
            
            // Dados de transporte
            transporte: this.extractTransporte(xmlDoc),
            
            // Dados de cobrança
            cobranca: this.extractCobranca(xmlDoc),
            
            // Informações adicionais
            informacoesAdicionais: this.extractInformacoesAdicionais(xmlDoc)
        };

        return nfe;
    }

    /**
     * Extrai dados de identificação da NFe
     */
    extractIdentificacao(xmlDoc) {
        const ide = xmlDoc.querySelector('ide');
        if (!ide) return {};

        return {
            numero: this.getTextContent(ide, 'nNF'),
            serie: this.getTextContent(ide, 'serie'),
            chaveAcesso: xmlDoc.querySelector('infNFe')?.getAttribute('Id')?.replace('NFe', ''),
            dataEmissao: this.formatDateTime(this.getTextContent(ide, 'dhEmi')),
            dataSaida: this.formatDateTime(this.getTextContent(ide, 'dhSaiEnt')),
            naturezaOperacao: this.getTextContent(ide, 'natOp'),
            modelo: this.getTextContent(ide, 'mod'),
            finalidadeEmissao: this.getTextContent(ide, 'finNFe'),
            codigoVerificador: this.getTextContent(ide, 'cDV')
        };
    }

    /**
     * Extrai dados do emitente
     */
    extractEmitente(xmlDoc) {
        const emit = xmlDoc.querySelector('emit');
        if (!emit) return {};

        const endereco = emit.querySelector('enderEmit');

        return {
            cnpj: this.getTextContent(emit, 'CNPJ'),
            inscricaoEstadual: this.getTextContent(emit, 'IE'),
            razaoSocial: this.getTextContent(emit, 'xNome'),
            nomeFantasia: this.getTextContent(emit, 'xFant'),
            telefone: this.getTextContent(emit, 'fone'),
            endereco: endereco ? {
                logradouro: this.getTextContent(endereco, 'xLgr'),
                numero: this.getTextContent(endereco, 'nro'),
                complemento: this.getTextContent(endereco, 'xCpl'),
                bairro: this.getTextContent(endereco, 'xBairro'),
                cidade: this.getTextContent(endereco, 'xMun'),
                uf: this.getTextContent(endereco, 'UF'),
                cep: this.getTextContent(endereco, 'CEP'),
                pais: this.getTextContent(endereco, 'xPais')
            } : {}
        };
    }

    /**
     * Extrai dados do destinatário
     */
    extractDestinatario(xmlDoc) {
        const dest = xmlDoc.querySelector('dest');
        if (!dest) return {};

        const endereco = dest.querySelector('enderDest');

        return {
            cnpj: this.getTextContent(dest, 'CNPJ'),
            cpf: this.getTextContent(dest, 'CPF'),
            inscricaoEstadual: this.getTextContent(dest, 'IE'),
            razaoSocial: this.getTextContent(dest, 'xNome'),
            telefone: this.getTextContent(dest, 'fone'),
            email: this.getTextContent(dest, 'email'),
            endereco: endereco ? {
                logradouro: this.getTextContent(endereco, 'xLgr'),
                numero: this.getTextContent(endereco, 'nro'),
                complemento: this.getTextContent(endereco, 'xCpl'),
                bairro: this.getTextContent(endereco, 'xBairro'),
                cidade: this.getTextContent(endereco, 'xMun'),
                uf: this.getTextContent(endereco, 'UF'),
                cep: this.getTextContent(endereco, 'CEP'),
                pais: this.getTextContent(endereco, 'xPais')
            } : {}
        };
    }

    /**
     * Extrai itens da NFe
     */
    extractItens(xmlDoc) {
        const detElements = xmlDoc.querySelectorAll('det');
        const itens = [];

        detElements.forEach(det => {
            const prod = det.querySelector('prod');
            if (!prod) return;

            const item = {
                numeroItem: det.getAttribute('nItem'),
                codigo: this.getTextContent(prod, 'cProd'),
                codigoEan: this.getTextContent(prod, 'cEAN'),
                descricao: this.getTextContent(prod, 'xProd'),
                ncm: this.getTextContent(prod, 'NCM'),
                cfop: this.getTextContent(prod, 'CFOP'),
                unidadeComercial: this.getTextContent(prod, 'uCom'),
                quantidadeComercial: this.parseFloat(this.getTextContent(prod, 'qCom')),
                valorUnitarioComercial: this.parseFloat(this.getTextContent(prod, 'vUnCom')),
                valorTotal: this.parseFloat(this.getTextContent(prod, 'vProd')),
                informacoesAdicionais: this.getTextContent(det, 'infAdProd')
            };

            itens.push(item);
        });

        return itens;
    }

    /**
     * Extrai totais da NFe
     */
    extractTotais(xmlDoc) {
        const icmsTot = xmlDoc.querySelector('ICMSTot');
        if (!icmsTot) return {};

        return {
            baseCalculoIcms: this.parseFloat(this.getTextContent(icmsTot, 'vBC')),
            valorIcms: this.parseFloat(this.getTextContent(icmsTot, 'vICMS')),
            valorTotalProdutos: this.parseFloat(this.getTextContent(icmsTot, 'vProd')),
            valorFrete: this.parseFloat(this.getTextContent(icmsTot, 'vFrete')),
            valorSeguro: this.parseFloat(this.getTextContent(icmsTot, 'vSeg')),
            valorDesconto: this.parseFloat(this.getTextContent(icmsTot, 'vDesc')),
            valorTotalNfe: this.parseFloat(this.getTextContent(icmsTot, 'vNF'))
        };
    }

    /**
     * Extrai dados de transporte
     */
    extractTransporte(xmlDoc) {
        const transp = xmlDoc.querySelector('transp');
        if (!transp) return {};

        const transportadora = transp.querySelector('transporta');
        const volume = transp.querySelector('vol');

        return {
            modalidadeFrete: this.getTextContent(transp, 'modFrete'),
            transportadora: transportadora ? {
                cnpj: this.getTextContent(transportadora, 'CNPJ'),
                razaoSocial: this.getTextContent(transportadora, 'xNome'),
                inscricaoEstadual: this.getTextContent(transportadora, 'IE'),
                endereco: this.getTextContent(transportadora, 'xEnder'),
                cidade: this.getTextContent(transportadora, 'xMun'),
                uf: this.getTextContent(transportadora, 'UF')
            } : {},
            volume: volume ? {
                quantidade: this.parseFloat(this.getTextContent(volume, 'qVol')),
                pesoLiquido: this.parseFloat(this.getTextContent(volume, 'pesoL')),
                pesoBruto: this.parseFloat(this.getTextContent(volume, 'pesoB'))
            } : {}
        };
    }

    /**
     * Extrai dados de cobrança
     */
    extractCobranca(xmlDoc) {
        const cobr = xmlDoc.querySelector('cobr');
        if (!cobr) return {};

        const fat = cobr.querySelector('fat');
        const duplicatas = cobr.querySelectorAll('dup');

        const cobranca = {
            fatura: fat ? {
                numero: this.getTextContent(fat, 'nFat'),
                valorOriginal: this.parseFloat(this.getTextContent(fat, 'vOrig')),
                valorDesconto: this.parseFloat(this.getTextContent(fat, 'vDesc')),
                valorLiquido: this.parseFloat(this.getTextContent(fat, 'vLiq'))
            } : {},
            duplicatas: []
        };

        duplicatas.forEach(dup => {
            cobranca.duplicatas.push({
                numero: this.getTextContent(dup, 'nDup'),
                dataVencimento: this.formatDate(this.getTextContent(dup, 'dVenc')),
                valor: this.parseFloat(this.getTextContent(dup, 'vDup'))
            });
        });

        return cobranca;
    }

    /**
     * Extrai informações adicionais
     */
    extractInformacoesAdicionais(xmlDoc) {
        const infAdic = xmlDoc.querySelector('infAdic');
        if (!infAdic) return {};

        return {
            informacoesComplementares: this.getTextContent(infAdic, 'infCpl'),
            observacoes: this.getTextContent(infAdic, 'obsCont xTexto')
        };
    }

    /**
     * Obtém o conteúdo de texto de um elemento
     */
    getTextContent(parent, selector) {
        const element = parent.querySelector(selector);
        return element ? element.textContent.trim() : '';
    }

    /**
     * Converte string para float
     */
    parseFloat(value) {
        if (!value) return 0;
        return parseFloat(value.replace(',', '.')) || 0;
    }

    /**
     * Formata data e hora
     */
    formatDateTime(dateTimeString) {
        if (!dateTimeString) return '';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('pt-BR');
        } catch {
            return dateTimeString;
        }
    }

    /**
     * Formata data
     */
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    }
}

export default new NfeXmlParser(); 