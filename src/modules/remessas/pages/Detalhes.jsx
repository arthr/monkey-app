import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Alert, Badge, Modal, Spinner, ModalBody, ModalHeader } from "flowbite-react";
import { FiArrowLeft, FiCheck, FiDownload, FiAlertCircle, FiInfo, FiSettings } from "react-icons/fi";

// Components
import DetailCard from "../components/DetailCard";
import TitulosTable from "../components/TitulosTable";
import AprovarReprovar from "../components/AprovarReprovar";
import Loader from "../components/Loader";
import NFeValidationCard from "../components/NFeValidationCard";

// Context and Hooks
import { RemessasProvider } from '../contexts';
import { useRemessaData } from '../hooks/useRemessaData';
import { useRemessaActions } from '../hooks/useRemessaActions';
import { useRemessaCalculations } from '../hooks/useRemessaCalculations';

const DetalhesContent = () => {
    const { filename } = useParams();
    const { remessa, loading, error, fetchRemessaByFilename } = useRemessaData();
    const { 
        downloadRemessa, downloadRetorno, downloadCorrigida, gerarCorrigida,
        downloadingRemessa, downloadingRetorno, downloadingCorrigida, gerandoCorrigida,
        remessaUrl, retornoUrl, remessaCorrigidaUrl
    } = useRemessaActions();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (filename) {
            fetchRemessaByFilename(filename);
        }
    }, [filename, fetchRemessaByFilename]);

    useEffect(() => {
        if (remessaUrl) {
            window.open(remessaUrl, "_blank");
        }
    }, [remessaUrl]);

    useEffect(() => {
        if (retornoUrl) {
            window.open(retornoUrl, "_blank");
        }
    }, [retornoUrl]);

    useEffect(() => {
        if (remessaCorrigidaUrl) {
            window.open(remessaCorrigidaUrl, "_blank");
        }
    }, [remessaCorrigidaUrl]);

    const { valorTotal } = useRemessaCalculations(remessa);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="px-6 py-8 mx-auto">
                <Alert color="failure" icon={FiAlertCircle}>
                    <span className="font-medium">Erro!</span> {error}
                </Alert>
                <div className="mt-4">
                    <Link to="/">
                        <Button color="gray">
                            <FiArrowLeft className="mr-2" />
                            Voltar para a lista
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!remessa) {
        return (
            <div className="px-6 py-8 mx-auto">
                <Alert color="info" icon={FiInfo}>
                    <span className="font-medium">Informação:</span> Remessa não encontrada.
                </Alert>
                <div className="mt-4">
                    <Link to="/">
                        <Button color="gray">
                            <FiArrowLeft className="mr-2" />
                            Voltar para a lista
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto">
            <div className="flex flex-col items-start mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                    Detalhes da Remessa
                </h3>
                <p className="text-gray-400 mb-4">{remessa.filename}</p>

                {/* Botões de ação no topo */}
                <div className="w-full flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <Link to="/">
                        <Button outline color="gray">
                            <FiArrowLeft className="mr-2" />
                            Voltar
                        </Button>
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-2">
                        {remessa.filename && (
                            <Button outline color="cyan" onClick={() => downloadRemessa(remessa.filename)} disabled={downloadingRemessa}>
                                {downloadingRemessa ? (
                                    <>
                                        <Spinner className="mr-2 size-5" />
                                        Gerando link...
                                    </>
                                ) : (
                                    <>
                                        <FiDownload className="mr-2" />
                                        Baixar Arquivo de Remessa
                                    </>
                                )}
                            </Button>
                        )}
                        {remessa.arquivoRetorno && (
                            <Button outline color="gray" onClick={() => downloadRetorno(remessa.arquivoRetorno)} disabled={downloadingRetorno}>
                                {downloadingRetorno ? (
                                    <>
                                        <Spinner className="mr-2 size-5" />
                                        Gerando link...
                                    </>
                                ) : (
                                    <>
                                        <FiDownload className="mr-2" />
                                        Baixar Arquivo de Retorno
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Botão para gerar/baixar CNAB corrigido */}
                        {remessa.arquivoCorrigido ? (
                            <Button outline color="purple" onClick={() => downloadCorrigida(remessa.filename, remessa.timestamp)} disabled={downloadingCorrigida}>
                                {downloadingCorrigida ? (
                                    <>
                                        <Spinner className="mr-2 size-5" />
                                        Gerando link...
                                    </>
                                ) : (
                                    <>
                                        <FiDownload className="mr-2" />
                                        Baixar CNAB Corrigido (WBA)
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button outline color="purple" onClick={() => gerarCorrigida(remessa)} disabled={gerandoCorrigida}>
                                {gerandoCorrigida ? (
                                    <>
                                        <Spinner className="mr-2 size-5" />
                                        Gerando arquivo...
                                    </>
                                ) : (
                                    <>
                                        <FiSettings className="mr-2" />
                                        Gerar CNAB Corrigido (WBA)
                                    </>
                                )}
                            </Button>
                        )}

                        <Button
                            outline
                            color={remessa.situacao?.aprovada
                                ? 'green'
                                : (remessa.situacao?.timestamp && !remessa.situacao?.aprovada ? 'red' : 'blue')
                            }
                            onClick={() => setModalIsOpen(true)}
                            disabled={remessa.situacao?.aprovada || (remessa.situacao?.timestamp && !remessa.situacao?.aprovada)}
                        >
                            <FiCheck className="mr-2" />
                            {remessa.situacao?.aprovada
                                ? 'Aprovada'
                                : (remessa.situacao?.timestamp && !remessa.situacao?.aprovada ? 'Reprovada' : 'Aprovar / Reprovar')
                            }
                        </Button>
                    </div>
                </div>

                {/* Cards com informações da remessa */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-6">
                    {/* Sacado/Cedente */}
                    <DetailCard title="Sacado/Cedente">
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Sacado:</span>
                                <span className="font-medium text-right">{remessa.header?.nomeEmpresa || "N/D"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">CNPJ:</span>
                                <span className="font-medium text-right">{remessa.titulos[0]?.numeroInscricaoPagador || "N/D"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Cedente:</span>
                                <span className="font-medium text-right">{remessa.titulos[0]?.sacadorAvalista || "N/D"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">CNPJ:</span>
                                <span className="font-medium text-right">{remessa.titulos[0]?.numeroInscricao || "N/D"}</span>
                            </li>
                        </ul>
                    </DetailCard>

                    {/* Informações da Remessa */}
                    <DetailCard title="Informações da Remessa">
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Arquivo:</span>
                                <span className="font-medium">{remessa.filename}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Data de Importação:</span>
                                <span className="font-medium">{new Date(remessa.timestamp).toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Quantidade de Títulos:</span>
                                <span className="font-medium">{remessa.titulos?.length || 0}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Valor Total:</span>
                                <span className="font-medium">{valorTotal}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Situação:</span>
                                <span>
                                    {remessa.situacao?.aprovada && remessa.situacao?.timestamp ? (
                                        <Badge color="success">Aprovada</Badge>
                                    ) : !remessa.situacao?.aprovada && remessa.situacao?.timestamp ? (
                                        <Badge color="failure">Reprovada</Badge>
                                    ) : (
                                        <Badge color="warning">Pendente</Badge>
                                    )}
                                </span>
                            </li>
                            {remessa.situacao?.usuario && (
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Usuário:</span>
                                    <span className="font-medium">{remessa.situacao.usuario}</span>
                                </li>
                            )}
                            {remessa.situacao?.observacoes && (
                                <li className="flex flex-col">
                                    <span className="text-gray-600 mb-1">Observações:</span>
                                    <span className="font-medium text-sm bg-gray-50 p-2 rounded">{remessa.situacao.observacoes}</span>
                                </li>
                            )}
                        </ul>
                    </DetailCard>

                    {/* Validação de NFe */}
                    <NFeValidationCard remessa={remessa} />
                </div>

                {/* Tabela de títulos */}
                <TitulosTable titulos={remessa.titulos} />

                {/* Modal de aprovação/reprovação */}
                <Modal show={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                    <ModalHeader>Aprovar / Reprovar Remessa</ModalHeader>
                    <ModalBody>
                        <AprovarReprovar
                            remessa={remessa}
                            onClose={() => setModalIsOpen(false)}
                            onSuccess={() => {
                                setModalIsOpen(false);
                                fetchRemessaByFilename(filename);
                            }}
                        />
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
};

const Detalhes = () => {
    return (
        <RemessasProvider>
            <DetalhesContent />
        </RemessasProvider>
    );
};

export default Detalhes;