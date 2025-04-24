import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Alert, Badge, Modal, Spinner, ModalBody, ModalHeader } from "flowbite-react";
import { FiArrowLeft, FiCheck, FiDownload, FiAlertCircle, FiInfo } from "react-icons/fi";

// Components
import DetailCard from "../components/DetailCard";
import TitulosTable from "../components/TitulosTable";
import AprovarReprovar from "../components/AprovarReprovar";
import Loader from "../components/Loader";

// Hooks
import useRemessaDetail from "../hooks/useRemessaDetail";

const Detalhes = () => {
    const { filename } = useParams();
    const { remessa, loading, error, refreshRemessa } = useRemessaDetail(filename);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Função para formatar a data
    const formatarData = (data) => {
        if (!data || data.length !== 6) return "N/D";
        const dia = data.substring(0, 2);
        const mes = data.substring(2, 4);
        const ano = "20" + data.substring(4, 6);
        return `${dia}/${mes}/${ano}`;
    };

    // Função para calcular o valor total dos títulos
    const calcularValorTotal = () => {
        if (!remessa?.titulos) return "R$ 0,00";
        const total = remessa.titulos.reduce(
            (sum, titulo) => sum + parseFloat(titulo.valorTitulo || 0),
            0
        );
        return total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

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
                    <Link to="/remessas">
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
                    <Link to="/remessas">
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
                    <Link to="/remessas">
                        <Button color="gray">
                            <FiArrowLeft className="mr-2" />
                            Voltar
                        </Button>
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-2">
                        {remessa.arquivoRetorno && (
                            <Button color="info">
                                <FiDownload className="mr-2" />
                                Baixar Arquivo de Retorno
                            </Button>
                        )}

                        <Button
                            color="success"
                            onClick={() => setModalIsOpen(true)}
                            disabled={remessa.situacao?.aprovada || (remessa.situacao?.timestamp && !remessa.situacao?.aprovada)}
                        >
                            <FiCheck className="mr-2" />
                            {remessa.situacao?.aprovada
                                ? 'Aprovada'
                                : (remessa.situacao?.timestamp && !remessa.situacao?.aprovada ? 'Reprovada' : 'Aprovar/Reprovar')
                            }
                        </Button>
                    </div>
                </div>

                {/* Cards com informações da remessa */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
                    {/* Sacado/Cedente */}
                    <DetailCard title="Sacado/Cedente">
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Sacado:</span>
                                <span className="font-medium">{remessa.header?.nomeEmpresa || "N/D"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">CNPJ:</span>
                                <span className="font-medium">{remessa.titulos[0]?.numeroInscricaoPagador || "N/D"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Cedente:</span>
                                <span className="font-medium">{remessa.titulos[0]?.sacadorAvalista || "N/D"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">CNPJ:</span>
                                <span className="font-medium">{remessa.titulos[0]?.numeroInscricao || "N/D"}</span>
                            </li>
                        </ul>
                    </DetailCard>

                    {/* Situação */}
                    <DetailCard title="Situação">
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Usuário:</span>
                                <span className="font-medium">{remessa.situacao?.usuario || "N/D"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                                <Badge
                                    color={remessa.situacao?.aprovada ? "success" : (!remessa.situacao?.aprovada && remessa.situacao?.timestamp ? "failure" : "warning")}
                                >
                                    {remessa.situacao?.aprovada ? "Aprovada" : (!remessa.situacao?.aprovada && remessa.situacao?.timestamp ? "Reprovada" : "Pendente")}
                                </Badge>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Data da Situação</span>
                                <span className="font-medium">
                                    {remessa.situacao?.timestamp
                                        ? new Date(remessa.situacao?.timestamp).toLocaleString()
                                        : "N/D"}
                                </span>
                            </li>
                        </ul>
                    </DetailCard>

                    {/* Informações adicionais */}
                    <DetailCard title="Informações Adicionais">
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Valor Total:</span>
                                <span className="font-medium">{calcularValorTotal()}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Títulos:</span>
                                <span className="font-medium">{remessa.titulos?.length || 0}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Data de Importação:</span>
                                <span className="font-medium">
                                    {remessa.timestamp
                                        ? new Date(remessa.timestamp).toLocaleString()
                                        : "N/D"}
                                </span>
                            </li>
                        </ul>
                    </DetailCard>
                </div>

                {/* Tabela de títulos */}
                <div className="w-full">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Títulos</h4>
                    <TitulosTable titulos={remessa.titulos} />
                </div>
            </div>

            {/* Modal de Aprovar/Reprovar */}
            <Modal
                show={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                dismissible
            >
                <ModalHeader>
                    Aprovar ou Reprovar Remessa
                </ModalHeader>
                <ModalBody>
                    <AprovarReprovar
                        remessa={remessa}
                        onClose={() => setModalIsOpen(false)}
                        onSuccess={refreshRemessa}
                    />
                </ModalBody>
            </Modal>
        </div>
    );
};

export default Detalhes;