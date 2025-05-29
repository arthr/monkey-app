import React, { useState } from 'react';
import { Card, Table, TableHead, TableRow, TableBody, TableCell, TableHeadCell, Badge } from 'flowbite-react';
import { FiInfo, FiUser, FiTruck, FiFileText, FiDollarSign } from 'react-icons/fi';
import NfeAcoes from './NfeAcoes';

const NfeVisualizacao = ({ nfeData }) => {
    const [abaSelecionada, setAbaSelecionada] = useState('geral');

    if (!nfeData) {
        return null;
    }

    const formatarMoeda = (valor) => {
        return parseFloat(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const formatarCnpjCpf = (documento) => {
        if (!documento) return 'N/A';
        
        if (documento.length === 14) {
            // CNPJ
            return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else if (documento.length === 11) {
            // CPF
            return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return documento;
    };

    const formatarCep = (cep) => {
        if (!cep) return 'N/A';
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const abas = [
        { id: 'geral', nome: 'Dados Gerais', icon: FiInfo },
        { id: 'participantes', nome: 'Participantes', icon: FiUser },
        { id: 'itens', nome: 'Itens', icon: FiFileText },
        { id: 'transporte', nome: 'Transporte', icon: FiTruck },
        { id: 'financeiro', nome: 'Financeiro', icon: FiDollarSign }
    ];

    return (
        <div className="space-y-6">
            {/* Cabeçalho da NFe */}
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Nota Fiscal Eletrônica
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Número: <strong>{nfeData.identificacao?.numero || 'N/A'}</strong></span>
                            <span>Série: <strong>{nfeData.identificacao?.serie || 'N/A'}</strong></span>
                            <Badge color="green">Autorizada</Badge>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                        <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                            <p>Data de Emissão: <strong>{nfeData.identificacao?.dataEmissao || 'N/A'}</strong></p>
                            <p>Data de Saída: <strong>{nfeData.identificacao?.dataSaida || 'N/A'}</strong></p>
                        </div>
                        <NfeAcoes nfeData={nfeData} />
                    </div>
                </div>
            </Card>

            {/* Navegação por abas */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {abas.map((aba) => {
                        const Icon = aba.icon;
                        return (
                            <button
                                key={aba.id}
                                onClick={() => setAbaSelecionada(aba.id)}
                                className={`
                                    py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors
                                    ${abaSelecionada === aba.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{aba.nome}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Conteúdo das abas */}
            {abaSelecionada === 'geral' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Identificação da NFe
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Chave de Acesso:</span>
                                <span className="font-mono text-gray-900 dark:text-white break-all">
                                    {nfeData.identificacao?.chaveAcesso || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Natureza da Operação:</span>
                                <span className="text-gray-900 dark:text-white">
                                    {nfeData.identificacao?.naturezaOperacao || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Modelo:</span>
                                <span className="text-gray-900 dark:text-white">
                                    {nfeData.identificacao?.modelo || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Código Verificador:</span>
                                <span className="text-gray-900 dark:text-white">
                                    {nfeData.identificacao?.codigoVerificador || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Resumo dos Totais
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Valor dos Produtos:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatarMoeda(nfeData.totais?.valorTotalProdutos)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Valor do ICMS:</span>
                                <span className="text-gray-900 dark:text-white">
                                    {formatarMoeda(nfeData.totais?.valorIcms)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Valor do Frete:</span>
                                <span className="text-gray-900 dark:text-white">
                                    {formatarMoeda(nfeData.totais?.valorFrete)}
                                </span>
                            </div>
                            <div className="flex justify-between border-t pt-3">
                                <span className="text-gray-600 dark:text-gray-400 font-semibold">Total da NFe:</span>
                                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                    {formatarMoeda(nfeData.totais?.valorTotalNfe)}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {abaSelecionada === 'participantes' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Emitente
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Razão Social:</span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {nfeData.emitente?.razaoSocial || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Nome Fantasia:</span>
                                <p className="text-gray-900 dark:text-white">
                                    {nfeData.emitente?.nomeFantasia || 'N/A'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">CNPJ:</span>
                                    <p className="font-mono text-gray-900 dark:text-white">
                                        {formatarCnpjCpf(nfeData.emitente?.cnpj)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">IE:</span>
                                    <p className="text-gray-900 dark:text-white">
                                        {nfeData.emitente?.inscricaoEstadual || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            {nfeData.emitente?.endereco && (
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Endereço:</span>
                                    <p className="text-gray-900 dark:text-white">
                                        {nfeData.emitente.endereco.logradouro}, {nfeData.emitente.endereco.numero}
                                        {nfeData.emitente.endereco.complemento && `, ${nfeData.emitente.endereco.complemento}`}
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {nfeData.emitente.endereco.bairro} - {nfeData.emitente.endereco.cidade}/{nfeData.emitente.endereco.uf}
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        CEP: {formatarCep(nfeData.emitente.endereco.cep)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Destinatário
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Razão Social:</span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {nfeData.destinatario?.razaoSocial || 'N/A'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {nfeData.destinatario?.cnpj ? 'CNPJ:' : 'CPF:'}
                                    </span>
                                    <p className="font-mono text-gray-900 dark:text-white">
                                        {formatarCnpjCpf(nfeData.destinatario?.cnpj || nfeData.destinatario?.cpf)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">IE:</span>
                                    <p className="text-gray-900 dark:text-white">
                                        {nfeData.destinatario?.inscricaoEstadual || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">E-mail:</span>
                                <p className="text-gray-900 dark:text-white">
                                    {nfeData.destinatario?.email || 'N/A'}
                                </p>
                            </div>
                            {nfeData.destinatario?.endereco && (
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Endereço:</span>
                                    <p className="text-gray-900 dark:text-white">
                                        {nfeData.destinatario.endereco.logradouro}, {nfeData.destinatario.endereco.numero}
                                        {nfeData.destinatario.endereco.complemento && `, ${nfeData.destinatario.endereco.complemento}`}
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {nfeData.destinatario.endereco.bairro} - {nfeData.destinatario.endereco.cidade}/{nfeData.destinatario.endereco.uf}
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        CEP: {formatarCep(nfeData.destinatario.endereco.cep)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {abaSelecionada === 'itens' && (
                <Card className="w-full overflow-x-auto [&>div:first-child]:p-0">
                    <Table striped hoverable>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Item</TableHeadCell>
                                <TableHeadCell>Código</TableHeadCell>
                                <TableHeadCell>Descrição</TableHeadCell>
                                <TableHeadCell>NCM</TableHeadCell>
                                <TableHeadCell>CFOP</TableHeadCell>
                                <TableHeadCell className="text-center">Qtd</TableHeadCell>
                                <TableHeadCell className="text-center">Un</TableHeadCell>
                                <TableHeadCell className="text-right">Vl. Unit</TableHeadCell>
                                <TableHeadCell className="text-right">Vl. Total</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {nfeData.itens && nfeData.itens.length > 0 ? (
                                nfeData.itens.map((item, index) => (
                                    <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell className="text-center font-medium">
                                            {item.numeroItem || index + 1}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {item.codigo || 'N/A'}
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {item.descricao || 'N/A'}
                                                </p>
                                                {item.informacoesAdicionais && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {item.informacoesAdicionais}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{item.ncm || 'N/A'}</TableCell>
                                        <TableCell className="text-sm">{item.cfop || 'N/A'}</TableCell>
                                        <TableCell className="text-center">
                                            {item.quantidadeComercial?.toLocaleString('pt-BR') || '0'}
                                        </TableCell>
                                        <TableCell className="text-center text-sm">
                                            {item.unidadeComercial || 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatarMoeda(item.valorUnitarioComercial)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatarMoeda(item.valorTotal)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-4">
                                        Nenhum item encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {abaSelecionada === 'transporte' && (
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Dados de Transporte
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Modalidade do Frete:</span>
                                <p className="text-gray-900 dark:text-white">
                                    {nfeData.transporte?.modalidadeFrete === '0' ? 'Por conta do emitente' :
                                     nfeData.transporte?.modalidadeFrete === '1' ? 'Por conta do destinatário' :
                                     'Não informado'}
                                </p>
                            </div>
                            
                            {nfeData.transporte?.transportadora && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Transportadora</h4>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">Razão Social:</span>{' '}
                                            {nfeData.transporte.transportadora.razaoSocial || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">CNPJ:</span>{' '}
                                            {formatarCnpjCpf(nfeData.transporte.transportadora.cnpj)}
                                        </p>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">IE:</span>{' '}
                                            {nfeData.transporte.transportadora.inscricaoEstadual || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">Endereço:</span>{' '}
                                            {nfeData.transporte.transportadora.endereco || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            {nfeData.transporte?.volume && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Volume</h4>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">Quantidade:</span>{' '}
                                            {nfeData.transporte.volume.quantidade || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">Peso Líquido:</span>{' '}
                                            {nfeData.transporte.volume.pesoLiquido ? 
                                                `${nfeData.transporte.volume.pesoLiquido.toLocaleString('pt-BR')} kg` : 'N/A'}
                                        </p>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">Peso Bruto:</span>{' '}
                                            {nfeData.transporte.volume.pesoBruto ? 
                                                `${nfeData.transporte.volume.pesoBruto.toLocaleString('pt-BR')} kg` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {abaSelecionada === 'financeiro' && (
                <div className="space-y-6">
                    {nfeData.cobranca?.fatura && (
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Fatura
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Número:</span>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {nfeData.cobranca.fatura.numero || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Valor Original:</span>
                                    <p className="text-gray-900 dark:text-white">
                                        {formatarMoeda(nfeData.cobranca.fatura.valorOriginal)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Valor Líquido:</span>
                                    <p className="font-semibold text-green-600 dark:text-green-400">
                                        {formatarMoeda(nfeData.cobranca.fatura.valorLiquido)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {nfeData.cobranca?.duplicatas && nfeData.cobranca.duplicatas.length > 0 && (
                        <Card className="w-full overflow-x-auto [&>div:first-child]:p-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-6 pt-6">
                                Duplicatas
                            </h3>
                            <Table striped hoverable>
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell>Número</TableHeadCell>
                                        <TableHeadCell className="text-center">Data de Vencimento</TableHeadCell>
                                        <TableHeadCell className="text-right">Valor</TableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y">
                                    {nfeData.cobranca.duplicatas.map((duplicata, index) => (
                                        <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <TableCell className="font-medium">
                                                {duplicata.numero || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {duplicata.dataVencimento || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatarMoeda(duplicata.valor)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}

                    {/* Informações Adicionais */}
                    {nfeData.informacoesAdicionais?.informacoesComplementares && (
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Informações Complementares
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                    {nfeData.informacoesAdicionais.informacoesComplementares}
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default NfeVisualizacao; 