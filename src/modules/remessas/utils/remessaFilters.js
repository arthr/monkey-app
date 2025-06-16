import { validarChavesRemessa } from './nfeValidator';

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

    // Filtro de documentos
    const matchesDocument = filters.document === 'todos' || 
      getDocumentStatus(remessa) === filters.document;

    // Filtro de empresa
    const matchesCompany = filters.company === 'todos' || 
      remessa.companyPrefix === filters.company;

    // Filtro de situação
    const matchesStatus = filters.status === 'todos' || 
      getSituacaoStatus(remessa) === filters.status;

    return matchesSearch && matchesDocument && matchesCompany && matchesStatus;
  });
}; 