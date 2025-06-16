import { validarChavesRemessa } from './nfeValidator';

// Nova função para obter o tipo de documento predominante
export const getTipoDocumentoPredominante = (remessa) => {
  if (!remessa) return 'sem-documentos';
  
  const validacao = validarChavesRemessa(remessa);
  
  // Se não há títulos, retornar categoria especial
  if (validacao.totalTitulos === 0) {
    return 'sem-documentos';
  }
  
  // Se não há títulos com chave
  if (validacao.titulosComChave === 0) {
    return 'sem-documentos';
  }
  
  // Se há chaves não identificadas
  if (validacao.chavesInvalidas > 0) {
    return 'nao-identificados';
  }
  
  // Analisar tipos de documento válidos
  const tiposDocumento = {
    nfe: 0,
    cte: 0,
    nfce: 0,
    notaServico: 0,
    desconhecido: 0
  };
  
  validacao.detalhes.forEach(detalhe => {
    if (detalhe.validacao?.tipoDocumento && detalhe.chaveValida) {
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
  
  // Determinar tipo predominante
  if (tiposDocumento.nfe > 0 && tiposDocumento.cte === 0 && tiposDocumento.notaServico === 0) {
    return 'nfe';
  }
  if (tiposDocumento.cte > 0 && tiposDocumento.nfe === 0 && tiposDocumento.notaServico === 0) {
    return 'cte';
  }
  if (tiposDocumento.notaServico > 0 && tiposDocumento.nfe === 0 && tiposDocumento.cte === 0) {
    return 'ns';
  }
  
  // Se tem mais de um tipo ou há documentos mistos
  return 'misto';
};

export const getDocumentStatus = (remessa) => {
  if (!remessa) return 'sem-documentos';
  const validacao = validarChavesRemessa(remessa);
  
  if (validacao.totalTitulos === 0) return 'sem-titulos';
  if (validacao.titulosComChave === 0) return 'sem-documentos';
  if (validacao.chavesValidas === validacao.titulosComChave) return 'identificados';
  if (validacao.chavesInvalidas > 0) return 'nao-identificados';
  return 'parcial';
};

export const getSituacaoStatus = (remessa) => {
  if (!remessa) return 'pendente';
  if (remessa.situacao?.aprovada && remessa.situacao?.timestamp) return 'aprovada';
  if (!remessa.situacao?.aprovada && remessa.situacao?.timestamp) return 'reprovada';
  return 'pendente';
};

export const applyFilters = (remessas, filters) => {
  return remessas.filter(remessa => {
    // Filtro de busca por texto
    const matchesSearch = !filters.search || 
      remessa.titulos?.[0]?.sacadorAvalista?.toLowerCase().includes(filters.search.toLowerCase()) ||
      remessa.filename.toLowerCase().includes(filters.search.toLowerCase());

    // Filtro de documentos - agora usando os tipos predominantes
    const matchesDocument = filters.document === 'todos' || 
      getTipoDocumentoPredominante(remessa) === filters.document;

    // Filtro de empresa
    const matchesCompany = filters.company === 'todos' || 
      remessa.companyPrefix === filters.company;

    // Filtro de situação
    const matchesStatus = filters.status === 'todos' || 
      getSituacaoStatus(remessa) === filters.status;

    return matchesSearch && matchesDocument && matchesCompany && matchesStatus;
  });
}; 