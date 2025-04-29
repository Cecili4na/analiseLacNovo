export interface Atributos {
  aparência: number;
  aroma: number;
  sabor: number;
  textura: number;
  geral: number;
}

export interface Teste {
  id: string;
  atributos: Atributos;
  intencaoCompra: number;
  comentarios: string;
  avaliador: string;
  data: string;
}

export interface MediaAtributos {
  aparência: number;
  aroma: number;
  sabor: number;
  textura: number;
  geral: number;
} 