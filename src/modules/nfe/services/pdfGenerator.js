import jsPDF from 'jspdf';

/**
 * Serviço para gerar PDF a partir dos dados da NFe
 */
class NfePdfGenerator {
    constructor() {
        this.pageWidth = 210; // A4 width in mm
        this.pageHeight = 297; // A4 height in mm
        this.margin = 15;
        this.contentWidth = this.pageWidth - (this.margin * 2);
        this.currentY = this.margin;
        this.maxY = this.pageHeight - 20; // Altura máxima da página (deixando espaço para rodapé)
        this.pdf = null;
    }

    /**
     * Gera PDF a partir dos dados da NFe
     * @param {Object} nfeData - Dados da NFe
     * @returns {Promise<void>}
     */
    async gerarPdf(nfeData) {
        try {
            this.pdf = new jsPDF();
            this.currentY = this.margin;

            // Configurar fonte padrão
            this.pdf.setFont('helvetica');

            // Cabeçalho do documento
            this.adicionarCabecalho(nfeData);

            // Dados de identificação
            this.adicionarIdentificacao(nfeData);

            // Participantes
            this.adicionarParticipantes(nfeData);

            // Itens da NFe
            this.adicionarItens(nfeData);

            // Totais
            this.adicionarTotais(nfeData);

            // Informações de transporte
            this.adicionarTransporte(nfeData);

            // Informações financeiras
            this.adicionarFinanceiro(nfeData);

            // Rodapé em todas as páginas
            this.adicionarRodapeTodasPaginas();

            // Abrir em nova aba
            const pdfBlob = this.pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');

            // Limpar URL após um tempo
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            throw new Error('Erro ao gerar PDF: ' + error.message);
        }
    }

    /**
     * Verifica se precisa de nova página e cria se necessário
     * @param {number} espacoNecessario - Espaço necessário em mm
     */
    verificarNovaPagina(espacoNecessario = 10) {
        if (this.currentY + espacoNecessario > this.maxY) {
            this.pdf.addPage();
            this.currentY = this.margin;
            return true;
        }
        return false;
    }

    /**
     * Adiciona cabeçalho do documento
     */
    adicionarCabecalho(nfeData) {
        // Título principal
        this.pdf.setFontSize(20);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('NOTA FISCAL ELETRÔNICA', this.pageWidth / 2, this.currentY, { align: 'center' });
        this.currentY += 10;

        // Número e série
        this.pdf.setFontSize(14);
        const numeroSerie = `Nº ${nfeData.identificacao?.numero || 'N/A'} - Série ${nfeData.identificacao?.serie || 'N/A'}`;
        this.pdf.text(numeroSerie, this.pageWidth / 2, this.currentY, { align: 'center' });
        this.currentY += 8;

        // Chave de acesso
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(`Chave de Acesso: ${nfeData.identificacao?.chaveAcesso || 'N/A'}`, this.pageWidth / 2, this.currentY, { align: 'center' });
        this.currentY += 12;

        // Linha separadora
        this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
        this.currentY += 8;
    }

    /**
     * Adiciona dados de identificação
     */
    adicionarIdentificacao(nfeData) {
        this.verificarNovaPagina(30);

        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('DADOS DE IDENTIFICAÇÃO', this.margin, this.currentY);
        this.currentY += 6;

        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');

        const dados = [
            `Data de Emissão: ${nfeData.identificacao?.dataEmissao || 'N/A'}`,
            `Data de Saída: ${nfeData.identificacao?.dataSaida || 'N/A'}`,
            `Natureza da Operação: ${nfeData.identificacao?.naturezaOperacao || 'N/A'}`,
            `Modelo: ${nfeData.identificacao?.modelo || 'N/A'}`
        ];

        dados.forEach(texto => {
            this.verificarNovaPagina(5);
            this.pdf.text(texto, this.margin, this.currentY);
            this.currentY += 4;
        });

        this.currentY += 5;
    }

    /**
     * Adiciona dados dos participantes
     */
    adicionarParticipantes(nfeData) {
        this.verificarNovaPagina(50);

        // Emitente
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('EMITENTE', this.margin, this.currentY);
        this.currentY += 6;

        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');

        const emitente = nfeData.emitente || {};
        const dadosEmitente = [
            `Razão Social: ${emitente.razaoSocial || 'N/A'}`,
            `Nome Fantasia: ${emitente.nomeFantasia || 'N/A'}`,
            `CNPJ: ${this.formatarCnpj(emitente.cnpj)}`,
            `IE: ${emitente.inscricaoEstadual || 'N/A'}`
        ];

        if (emitente.endereco) {
            dadosEmitente.push(
                `Endereço: ${emitente.endereco.logradouro || ''}, ${emitente.endereco.numero || ''}`,
                `${emitente.endereco.bairro || ''} - ${emitente.endereco.cidade || ''}/${emitente.endereco.uf || ''}`,
                `CEP: ${this.formatarCep(emitente.endereco.cep)}`
            );
        }

        dadosEmitente.forEach(texto => {
            this.verificarNovaPagina(5);
            this.pdf.text(texto, this.margin, this.currentY);
            this.currentY += 4;
        });

        this.currentY += 3;

        // Verificar espaço para destinatário
        this.verificarNovaPagina(40);

        // Destinatário
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('DESTINATÁRIO', this.margin, this.currentY);
        this.currentY += 6;

        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');

        const destinatario = nfeData.destinatario || {};
        const dadosDestinatario = [
            `Razão Social: ${destinatario.razaoSocial || 'N/A'}`,
            `${destinatario.cnpj ? 'CNPJ' : 'CPF'}: ${this.formatarCnpj(destinatario.cnpj || destinatario.cpf)}`,
            `IE: ${destinatario.inscricaoEstadual || 'N/A'}`,
            `E-mail: ${destinatario.email || 'N/A'}`
        ];

        if (destinatario.endereco) {
            dadosDestinatario.push(
                `Endereço: ${destinatario.endereco.logradouro || ''}, ${destinatario.endereco.numero || ''}`,
                `${destinatario.endereco.bairro || ''} - ${destinatario.endereco.cidade || ''}/${destinatario.endereco.uf || ''}`,
                `CEP: ${this.formatarCep(destinatario.endereco.cep)}`
            );
        }

        dadosDestinatario.forEach(texto => {
            this.verificarNovaPagina(5);
            this.pdf.text(texto, this.margin, this.currentY);
            this.currentY += 4;
        });

        this.currentY += 8;
    }

    /**
     * Adiciona tabela de itens
     */
    adicionarItens(nfeData) {
        if (!nfeData.itens || nfeData.itens.length === 0) return;

        this.verificarNovaPagina(30);

        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('ITENS DA NOTA FISCAL', this.margin, this.currentY);
        this.currentY += 8;

        // Cabeçalho da tabela
        const colunas = ['Item', 'Código', 'Descrição', 'Qtd', 'Un', 'Vl. Unit', 'Vl. Total'];
        const larguras = [15, 25, 60, 15, 10, 25, 25];

        // Função para desenhar cabeçalho da tabela
        const desenharCabecalho = () => {
            let x = this.margin;
            this.pdf.setFontSize(8);
            this.pdf.setFont('helvetica', 'bold');

            colunas.forEach((coluna, i) => {
                this.pdf.rect(x, this.currentY, larguras[i], 6);
                this.pdf.text(coluna, x + 2, this.currentY + 4);
                x += larguras[i];
            });

            this.currentY += 6;
        };

        // Desenhar cabeçalho inicial
        desenharCabecalho();

        // Linhas da tabela
        this.pdf.setFont('helvetica', 'normal');
        
        nfeData.itens.forEach((item, index) => {
            // Verificar se precisa de nova página (considerando altura da linha + margem de segurança)
            if (this.currentY + 10 > this.maxY) {
                this.pdf.addPage();
                this.currentY = this.margin + 10; // Espaço extra no topo da nova página
                desenharCabecalho(); // Redesenhar cabeçalho na nova página
            }

            let x = this.margin;
            const dados = [
                (index + 1).toString(),
                item.codigo || '',
                this.truncarTexto(item.descricao || '', 30),
                item.quantidadeComercial?.toLocaleString('pt-BR') || '0',
                item.unidadeComercial || '',
                this.formatarMoeda(item.valorUnitarioComercial),
                this.formatarMoeda(item.valorTotal)
            ];

            dados.forEach((dado, i) => {
                this.pdf.rect(x, this.currentY, larguras[i], 6);
                this.pdf.text(dado, x + 2, this.currentY + 4);
                x += larguras[i];
            });

            this.currentY += 6;
        });

        this.currentY += 8;
    }

    /**
     * Adiciona totais
     */
    adicionarTotais(nfeData) {
        if (!nfeData.totais) return;

        this.verificarNovaPagina(40);

        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('TOTAIS DA NOTA FISCAL', this.margin, this.currentY);
        this.currentY += 6;

        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');

        const totais = [
            `Valor dos Produtos: ${this.formatarMoeda(nfeData.totais.valorTotalProdutos)}`,
            `Valor do ICMS: ${this.formatarMoeda(nfeData.totais.valorIcms)}`,
            `Valor do Frete: ${this.formatarMoeda(nfeData.totais.valorFrete)}`,
            `Valor do Desconto: ${this.formatarMoeda(nfeData.totais.valorDesconto)}`
        ];

        totais.forEach(texto => {
            this.verificarNovaPagina(5);
            this.pdf.text(texto, this.margin, this.currentY);
            this.currentY += 4;
        });

        // Total geral destacado
        this.verificarNovaPagina(8);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(11);
        this.pdf.text(`VALOR TOTAL DA NFe: ${this.formatarMoeda(nfeData.totais.valorTotalNfe)}`, this.margin, this.currentY);
        this.currentY += 8;
    }

    /**
     * Adiciona informações de transporte
     */
    adicionarTransporte(nfeData) {
        if (!nfeData.transporte) return;

        this.verificarNovaPagina(40);

        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('DADOS DE TRANSPORTE', this.margin, this.currentY);
        this.currentY += 6;

        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');

        const modalidade = nfeData.transporte.modalidadeFrete === '0' ? 'Por conta do emitente' :
                          nfeData.transporte.modalidadeFrete === '1' ? 'Por conta do destinatário' : 'Não informado';
        
        this.verificarNovaPagina(5);
        this.pdf.text(`Modalidade do Frete: ${modalidade}`, this.margin, this.currentY);
        this.currentY += 4;

        if (nfeData.transporte.transportadora) {
            const transp = nfeData.transporte.transportadora;
            const dados = [
                `Transportadora: ${transp.razaoSocial || 'N/A'}`,
                `CNPJ: ${this.formatarCnpj(transp.cnpj)}`,
                `IE: ${transp.inscricaoEstadual || 'N/A'}`
            ];

            dados.forEach(texto => {
                this.verificarNovaPagina(5);
                this.pdf.text(texto, this.margin, this.currentY);
                this.currentY += 4;
            });
        }

        this.currentY += 5;
    }

    /**
     * Adiciona informações financeiras
     */
    adicionarFinanceiro(nfeData) {
        if (!nfeData.cobranca) return;

        this.verificarNovaPagina(40);

        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('DADOS FINANCEIROS', this.margin, this.currentY);
        this.currentY += 6;

        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');

        if (nfeData.cobranca.fatura) {
            const fatura = nfeData.cobranca.fatura;
            const dados = [
                `Número da Fatura: ${fatura.numero || 'N/A'}`,
                `Valor Original: ${this.formatarMoeda(fatura.valorOriginal)}`,
                `Valor Líquido: ${this.formatarMoeda(fatura.valorLiquido)}`
            ];

            dados.forEach(texto => {
                this.verificarNovaPagina(5);
                this.pdf.text(texto, this.margin, this.currentY);
                this.currentY += 4;
            });
        }

        if (nfeData.cobranca.duplicatas && nfeData.cobranca.duplicatas.length > 0) {
            this.currentY += 3;
            this.verificarNovaPagina(8);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.text('Duplicatas:', this.margin, this.currentY);
            this.currentY += 4;

            this.pdf.setFont('helvetica', 'normal');
            nfeData.cobranca.duplicatas.forEach(dup => {
                this.verificarNovaPagina(5);
                this.pdf.text(`Nº ${dup.numero || 'N/A'} - Venc: ${dup.dataVencimento || 'N/A'} - Valor: ${this.formatarMoeda(dup.valor)}`, this.margin + 5, this.currentY);
                this.currentY += 4;
            });
        }

        this.currentY += 5;
    }

    /**
     * Adiciona rodapé em todas as páginas
     */
    adicionarRodapeTodasPaginas() {
        const totalPages = this.pdf.internal.getNumberOfPages();
        const dataGeracao = new Date().toLocaleString('pt-BR');

        for (let i = 1; i <= totalPages; i++) {
            this.pdf.setPage(i);
            this.pdf.setFontSize(8);
            this.pdf.setFont('helvetica', 'italic');
            
            // Informações do rodapé
            this.pdf.text(`Documento gerado em ${dataGeracao}`, this.margin, this.pageHeight - 10);
            this.pdf.text('Gerado via Sistema de Pré-visualização de NFe', this.pageWidth - this.margin, this.pageHeight - 10, { align: 'right' });
            
            // Numeração das páginas
            if (totalPages > 1) {
                this.pdf.text(`Página ${i} de ${totalPages}`, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
            }
        }
    }

    /**
     * Utilitários de formatação
     */
    formatarMoeda(valor) {
        return parseFloat(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    formatarCnpj(documento) {
        if (!documento) return 'N/A';
        
        if (documento.length === 14) {
            return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else if (documento.length === 11) {
            return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return documento;
    }

    formatarCep(cep) {
        if (!cep) return 'N/A';
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    truncarTexto(texto, limite) {
        if (!texto) return '';
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }
}

export default new NfePdfGenerator(); 