import React from 'react';
import { Badge, Tooltip } from 'flowbite-react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo, FiFileText, FiTruck } from 'react-icons/fi';
import { validarChavesRemessa } from '../utils/nfeValidator';

const NFeValidationBadge = ({ remessa }) => {
    const validacao = validarChavesRemessa(remessa);
    
    // Analisar tipos de documento
    const tiposDocumento = {
        nfe: 0,
        cte: 0,
        nfce: 0,
        notaServico: 0,
        desconhecido: 0
    };
    
    validacao.detalhes.forEach(detalhe => {
        if (detalhe.validacao?.tipoDocumento) {
            const tipo = detalhe.validacao.tipoDocumento;
            if (tipo.tipo === 'NOTA_SERVICO') {
                tiposDocumento.notaServico++;
            } else if (tipo.tipo === 'CHAVE_ELETRONICA') {
                switch (tipo.subtipo) {
                    case 'NFe':
                        tiposDocumento.nfe++;
                        break;
                    case 'CTe':
                        tiposDocumento.cte++;
                        break;
                    case 'NFCe':
                        tiposDocumento.nfce++;
                        break;
                    default:
                        tiposDocumento.desconhecido++;
                }
            } else {
                tiposDocumento.desconhecido++;
            }
        }
    });
    
    // Se não há títulos, não exibir nada
    if (validacao.totalTitulos === 0) {
        return (
            <Tooltip content="Remessa sem títulos">
                <Badge className="rounded-sm text-xs px-2 py-0.5" color="gray" icon={FiInfo}>
                    Sem títulos
                </Badge>
            </Tooltip>
        );
    }
    
    // Se não há títulos com chave
    if (validacao.titulosComChave === 0) {
        return (
            <Tooltip content="Nenhum título possui chave de documento fiscal">
                <Badge className="rounded-sm text-xs px-2 py-0.5" color="warning" icon={FiAlertTriangle}>
                    Sem Docs
                </Badge>
            </Tooltip>
        );
    }
    
    // Determinar o tipo predominante e ícone
    const getTipoPredominante = () => {
        if (tiposDocumento.nfe > 0 && tiposDocumento.cte === 0 && tiposDocumento.notaServico === 0) {
            return { tipo: 'NFe', icon: FiCheck, color: 'success' };
        }
        if (tiposDocumento.cte > 0 && tiposDocumento.nfe === 0 && tiposDocumento.notaServico === 0) {
            return { tipo: 'CTe', icon: FiTruck, color: 'blue' };
        }
        if (tiposDocumento.notaServico > 0 && tiposDocumento.nfe === 0 && tiposDocumento.cte === 0) {
            return { tipo: 'NS', icon: FiFileText, color: 'gray' };
        }
        return { tipo: 'Misto', icon: FiAlertTriangle, color: 'warning' };
    };
    
    const tipoPredominante = getTipoPredominante();
    
    // Se todas as chaves são válidas
    if (validacao.chavesValidas === validacao.titulosComChave) {
        const detalhesTooltip = [];
        if (tiposDocumento.nfe > 0) detalhesTooltip.push(`${tiposDocumento.nfe} NFe`);
        if (tiposDocumento.cte > 0) detalhesTooltip.push(`${tiposDocumento.cte} CTe`);
        if (tiposDocumento.nfce > 0) detalhesTooltip.push(`${tiposDocumento.nfce} NFCe`);
        if (tiposDocumento.notaServico > 0) detalhesTooltip.push(`${tiposDocumento.notaServico} Nota Serviço`);
        
        const tooltipText = `Todos identificados: ${detalhesTooltip.join(', ')}`;
        return (
            <Tooltip content={tooltipText}>
                <Badge className="rounded-sm text-xs px-2 py-0.5" color={tipoPredominante.color} icon={tipoPredominante.icon}>
                    {tipoPredominante.tipo}
                </Badge>
            </Tooltip>
        );
    }
    
    // Se há chaves não identificadas
    if (validacao.chavesInvalidas > 0) {
        const tooltipText = `${validacao.chavesInvalidas} não identificados de ${validacao.titulosComChave} documentos`;
        return (
            <Tooltip content={tooltipText}>
                <Badge className="rounded-sm text-xs px-2 py-0.5" color="failure" icon={FiX}>
                    Não Identificados
                </Badge>
            </Tooltip>
        );
    }
    
    // Caso misto (alguns títulos com chave, outros sem)
    const tooltipText = `${validacao.chavesValidas} identificados, ${validacao.titulosSemChave} sem documento`;
    return (
        <Tooltip content={tooltipText}>
            <Badge className="rounded-sm text-xs px-2 py-0.5" color="warning" icon={FiAlertTriangle}>
                Parcial
            </Badge>
        </Tooltip>
    );
};

export default NFeValidationBadge; 