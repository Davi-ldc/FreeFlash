import 'dotenv/config';
import { createClient } from '@sanity/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import imageUrlBuilder from '@sanity/image-url';
import type { Colecao, ColecaoAgrupada, ColecaoFormatada } from './src/types/sanity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true,// assim ele faz cache dos dados em servidores mais proximos de você e serve mais rápido se ainda for valido
  //mas na pratica nem faz diferença por que eu só rodo fetch quando o sanity manda o webhook
  apiVersion: '2024-05-01',
});

//Constants
const LIMIT_BY_YEAR = 3;

const builder = imageUrlBuilder(client);

//De YYYY-MM-DD para DD/MM
function formatData(dataString: string): string {
  const [, mes, dia] = dataString.split('-');
  return `${dia}/${mes}`;
}

function groupByYear(colecoes: ColecaoFormatada[]): ColecaoAgrupada[] {
  const grouped = new Map<number, ColecaoFormatada[]>();

  for (const colecao of colecoes) {
    const year = colecao.ano;

    //se não existir no objeto, cria a chave com um array vazio
    if (!grouped.has(year)) { 
      grouped.set(year, []);
    }

    grouped.get(year)!.push(colecao)//adiciona a chave
  }
  //limita o número de coleções
  return Array.from(grouped.entries())
    .sort(([a], [b]) => b - a) // ordenação numérica direta
    .map(([ano, colecoes]) => ({
      ano, // mantém como number
      //tira o ano pra deixar o json mais clean
      colecoes: colecoes.slice(0, LIMIT_BY_YEAR).map(({ ano, ...rest }) => rest)
    }));
}

async function fetchContent() {
  const time = performance.now();
  console.log('Buscando dados do Sanity...');
  try {
    //GROQ query (GROQ é a linguagem de query do sanity)
    //https://www.sanity.io/docs/content-lake/how-queries-work
    const query = `*[_type == "colecao"] | order(ano desc, data desc) {
      titulo, "slug": slug.current, local, data, ano, "imagemPrincipal": imagemPrincipal.asset->{url}
    }`;

    //array com coleções
    const colecoesRaw: Colecao[] = await client.fetch(query)

    const formatadas: ColecaoFormatada[] = colecoesRaw.map((c) => ({
      ...c,
      data: formatData(c.data),//formata pra DD/MM
      //ao ?auto=format ele comprime pra avif, ou webp se o navegador não suportar avif
      imagemPrincipal: { url: builder.image(c.imagemPrincipal.url).auto('format').url() }, 
    }))

    const agrupadas: ColecaoAgrupada[] = groupByYear(formatadas)

    const outputPath = path.resolve(__dirname, 'content.json')
    //o stringify converte um objeto js em string json
    // await fs.writeFile(outputPath, JSON.stringify(agrupadas , null, 2)) //pra debug
    await fs.writeFile(outputPath, JSON.stringify(agrupadas))

    const elapsedTime = (performance.now() - time) / 1000;
    console.log(`Dados obtidos com sucesso em ${elapsedTime.toFixed(2)} segundos.`);
    console.log(`Dados salvos em: ${outputPath}`);

  } catch (error) {
    console.error('Erro ao buscar dados do Sanity:', error);
    process.exit(1);
  }
}

fetchContent();