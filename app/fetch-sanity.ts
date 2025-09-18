import 'dotenv/config'
// import type { types } from './src/types/sanity';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const client = createClient({
//   projectId: process.env.SANITY_PROJECT_ID,
//   dataset: 'production',
//   useCdn: true,
//   apiVersion: '2024-05-01',
// });

// const builder = imageUrlBuilder(client);

// async function fetchContent() {
//   const time = performance.now();
//   console.log('Buscando dados do Sanity...');
//   try {
//     //GROQ query (GROQ é a linguagem de query do sanity)
//     //https://www.sanity.io/docs/content-lake/how-queries-work
//     const query = `*[_type == "colecao"] | order(ano desc, data desc) {
//       titulo, "slug": slug.current, local, data, ano, "imagemPrincipal": imagemPrincipal.asset->{url}
//     }`;

//     //Processa os dados aqui...

//     const outputPath = path.resolve(__dirname, 'content.json')
//     //o stringify converte um objeto js em string json
//     // await fs.writeFile(outputPath, JSON.stringify(agrupadas , null, 2)) //pra debug
//     //dps salva em um content.json
//     await fs.writeFile(outputPath, JSON.stringify(query))

//     const elapsedTime = (performance.now() - time) / 1000;
//     console.log(`Dados obtidos com sucesso em ${elapsedTime.toFixed(2)} segundos.`);
//     console.log(`Dados salvos em: ${outputPath}`);

//   } catch (error) {
//     console.error('Erro:', error);
//     process.exit(1);
//   }
// }

// fetchContent();
