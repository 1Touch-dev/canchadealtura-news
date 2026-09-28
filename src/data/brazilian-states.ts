/** 27 Brazilian states — shared shell data (not brand-specific). */

export interface BrazilianState {
  uf: string;
  name: string;
  slug: string;
  region: string;
}

export const BRAZILIAN_STATES: BrazilianState[] = [
  { uf: 'AC', name: 'Acre', slug: 'ac', region: 'Norte' },
  { uf: 'AL', name: 'Alagoas', slug: 'al', region: 'Nordeste' },
  { uf: 'AP', name: 'Amapá', slug: 'ap', region: 'Norte' },
  { uf: 'AM', name: 'Amazonas', slug: 'am', region: 'Norte' },
  { uf: 'BA', name: 'Bahia', slug: 'ba', region: 'Nordeste' },
  { uf: 'CE', name: 'Ceará', slug: 'ce', region: 'Nordeste' },
  { uf: 'DF', name: 'Distrito Federal', slug: 'df', region: 'Centro-Oeste' },
  { uf: 'ES', name: 'Espírito Santo', slug: 'es', region: 'Sudeste' },
  { uf: 'GO', name: 'Goiás', slug: 'go', region: 'Centro-Oeste' },
  { uf: 'MA', name: 'Maranhão', slug: 'ma', region: 'Nordeste' },
  { uf: 'MT', name: 'Mato Grosso', slug: 'mt', region: 'Centro-Oeste' },
  { uf: 'MS', name: 'Mato Grosso do Sul', slug: 'ms', region: 'Centro-Oeste' },
  { uf: 'MG', name: 'Minas Gerais', slug: 'mg', region: 'Sudeste' },
  { uf: 'PA', name: 'Pará', slug: 'pa', region: 'Norte' },
  { uf: 'PB', name: 'Paraíba', slug: 'pb', region: 'Nordeste' },
  { uf: 'PR', name: 'Paraná', slug: 'pr', region: 'Sul' },
  { uf: 'PE', name: 'Pernambuco', slug: 'pe', region: 'Nordeste' },
  { uf: 'PI', name: 'Piauí', slug: 'pi', region: 'Nordeste' },
  { uf: 'RJ', name: 'Rio de Janeiro', slug: 'rj', region: 'Sudeste' },
  { uf: 'RN', name: 'Rio Grande do Norte', slug: 'rn', region: 'Nordeste' },
  { uf: 'RS', name: 'Rio Grande do Sul', slug: 'rs', region: 'Sul' },
  { uf: 'RO', name: 'Rondônia', slug: 'ro', region: 'Norte' },
  { uf: 'RR', name: 'Roraima', slug: 'rr', region: 'Norte' },
  { uf: 'SC', name: 'Santa Catarina', slug: 'sc', region: 'Sul' },
  { uf: 'SP', name: 'São Paulo', slug: 'sp', region: 'Sudeste' },
  { uf: 'SE', name: 'Sergipe', slug: 'se', region: 'Nordeste' },
  { uf: 'TO', name: 'Tocantins', slug: 'to', region: 'Norte' },
];

export function getStateByUf(uf: string): BrazilianState | undefined {
  return BRAZILIAN_STATES.find((s) => s.uf.toLowerCase() === uf.toLowerCase() || s.slug === uf.toLowerCase());
}
