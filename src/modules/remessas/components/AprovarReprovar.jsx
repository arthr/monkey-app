import React, { useState } from 'react';
import { Button, TextInput, Alert } from 'flowbite-react';
import { approveRemessa } from '../services/remessaApi';
import { FiCheck, FiX, FiSend, FiLogOut } from 'react-icons/fi';

const AprovarReprovar = ({ remessa, onClose, onSuccess }) => {
    const [aprovada, setAprovada] = useState(null);
    const [usuario, setUsuario] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!usuario) {
            setError("Por favor, insira o nome do operador.");
            return;
        }

        const data = {
            aprovada,
            usuario
        };

        setIsSubmitting(true);
        try {
            await approveRemessa(remessa.filename, remessa.timestamp, data);
            if (onSuccess) onSuccess();
            onClose(); // Fecha o modal após a operação ser bem-sucedida
        } catch (error) {
            console.error("Erro ao aprovar/reprovar a remessa: ", error);
            setError(`Erro ao processar: ${error.message || 'Tente novamente mais tarde'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            {error && (
                <Alert color="failure" className="mb-4">
                    {error}
                </Alert>
            )}
            
            <div className="mb-4">
                <TextInput
                    type="text"
                    placeholder="Digite seu nome para confirmar"
                    value={usuario}
                    onChange={(e) => {
                        setUsuario(e.target.value);
                        setError(""); // Limpa o erro ao digitar
                    }}
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-between items-center gap-3">
                <Button
                    color="success"
                    onClick={() => setAprovada(true)}
                    disabled={aprovada === true || isSubmitting}
                    className="flex-1"
                >
                    <FiCheck className="mr-2" />
                    Aprovar
                </Button>
                <Button
                    color="failure"
                    onClick={() => setAprovada(false)}
                    disabled={aprovada === false || isSubmitting}
                    className="flex-1"
                >
                    <FiX className="mr-2" />
                    Reprovar
                </Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={aprovada === null || isSubmitting}
                    className="flex-1"
                >
                    <FiSend className="mr-2" />
                    Enviar
                </Button>
                <Button
                    color="light"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    <FiLogOut className="mr-2" />
                    Fechar
                </Button>
            </div>
        </div>
    );
};

export default AprovarReprovar;