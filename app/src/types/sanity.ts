export interface SanityImage {
  url: string;
}

export interface Colecao {
  titulo: string;
  slug: string;
  local: string;
  data: string; // Formato YYYY-MM-DD
  ano: number;
  imagemPrincipal: SanityImage;
}

//Omit gera Colecao sem o campo data, que é reescrito
//Em teoria é a mesma coisa, mas fica explicito que ta no formato DD/MM
export interface ColecaoFormatada extends Omit<Colecao, 'data'> {
  data: string; // Formato DD/MM
}

export interface ColecaoAgrupada {
  ano: number;
  //não precisa armazenar 2 vezes. 
  colecoes: Omit<ColecaoFormatada, 'ano'>[];
}