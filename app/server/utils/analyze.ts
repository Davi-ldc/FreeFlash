import { execSync } from 'child_process';// execSync é pra ele rodar de forma síncrona, esperando o processo terminar
import { readdirSync, unlinkSync, copyFileSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '../../.vercel/output/functions/index.func');
const appRoot = path.resolve(__dirname, '../..');

const VERCEL_EDGE_LIMIT = 1024; //1MB no hobby, 2 no pro e 4 no enterprise do vercel

// bytes -> KB (com 2 casas decimais). 
const formatSize = (bytes: number): string => `${(bytes / 1024).toFixed(2)} KB`;

console.log('🔍 Analisando bundle...');

const files = readdirSync(dir);
const metafile = files.find(f => f.startsWith('metafile-') && f.endsWith('.json'));

if (!metafile) {
  console.error('❌ Erro: Nenhum metafile em .vercel/output/functions/index.func/');
  process.exit(1);
}

const metafilePath = path.join(dir, metafile);

// Gzip
try {
  // cjs pra node e js (esm) pra edge
  const bundleFilename = files.find(f => f === 'index.js' || f === 'index.cjs');
  
  if (!bundleFilename) {
    throw new Error('Não foi possível encontrar "index.js" ou "index.cjs" em .vercel/output/functions/index.func/');
  }

  const outputFilePath = path.join(dir, bundleFilename);
  
  const stats = statSync(outputFilePath);
  const originalSizeInBytes = stats.size;
  
  const fileContent = readFileSync(outputFilePath);
  const gzippedSizeInBytes = gzipSync(fileContent).length;

  //o quanto tinha antes - o quanto tem agora (economia) / original * 100
  const savingPercentage = ((originalSizeInBytes - gzippedSizeInBytes) / originalSizeInBytes) * 100;
  const gzippedSizeInKB = gzippedSizeInBytes / 1024;// 1024 bytes = 1 KB
  
  const status = gzippedSizeInKB <= VERCEL_EDGE_LIMIT ? `✅ você ainda tem ${(VERCEL_EDGE_LIMIT - gzippedSizeInKB).toFixed(2)} KB de sobra` : `❌ Passou o limite por ${(gzippedSizeInKB - VERCEL_EDGE_LIMIT).toFixed(2)} KB`;

  console.log(`
---
ANÁLISE GZIP (para Vercel Edge Functions)📄
  ${bundleFilename}: ${formatSize(originalSizeInBytes)} → ${formatSize(gzippedSizeInBytes)} (-${savingPercentage.toFixed(2)}%)

📊 RESUMO:
  Total original: ${formatSize(originalSizeInBytes)}
  Total gzip:     ${formatSize(gzippedSizeInBytes)}
  Economia:       ${savingPercentage.toFixed(2)}%
  Limite Vercel:  ${VERCEL_EDGE_LIMIT.toFixed(2)} KB
  Status:         ${status}
---
  `);

} catch (error) {
    console.error(error);
}


const targetPath = path.join(appRoot, 'meta.json');
try {
  console.log('📄 Gerando relatório... (arquivo descomprimido)');

  copyFileSync(metafilePath, targetPath);

  execSync(`esbuild-analyzer --metafile=${targetPath}`, {
    stdio: 'inherit'//faz com que a saída apareça no console
  });
  
} catch (error) {
  console.error('❌ Falha no esbuild-analyzer:', error);
} finally {//finally garante que sempre sejá executado, mesmo em caso de erro
  unlinkSync(targetPath);
}
