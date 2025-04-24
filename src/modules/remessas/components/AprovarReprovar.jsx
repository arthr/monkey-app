import React, { useState } from 'react';
import { Button, TextInput, Alert } from 'flowbite-react';
import { approveRemessa } from '../services/remessaApi';
import { FiCheck, FiX, FiSend, FiLogOut } from 'react-icons/fi';
import useAuth from '../../auth/hooks/useAuth';

const AprovarReprovar = ({ remessa, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [aprovada, setAprovada] = useState(null);
    const [usuario] = useState(user.profile.name || false);
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
            onClose();
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

            {/* Instruções */}
            <div className="mb-4">
                <p>Por favor, selecione uma opção e clique em Enviar.</p>
                <small className="text-sm text-orange-500 italic">Atenção! Esta ação é irreversível.</small>
            </div>

            <div className="mb-4">
                <TextInput
                    color="info"
                    type="text"
                    placeholder="Digite seu nome para confirmar"
                    value={usuario}
                    readOnly={true}
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-between items-center gap-3">
                <Button
                    outline
                    color="green"
                    onClick={() => setAprovada(true)}
                    disabled={aprovada === true || isSubmitting}
                    className="flex-1"
                >
                    <FiCheck className="mr-2" />
                    Aprovar
                </Button>
                <Button
                    outline
                    color="red"
                    onClick={() => setAprovada(false)}
                    disabled={aprovada === false || isSubmitting}
                    className="flex-1"
                >
                    <FiX className="mr-2" />
                    Reprovar
                </Button>
                <Button
                    outline
                    color="blue"
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