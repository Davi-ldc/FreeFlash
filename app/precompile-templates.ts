import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

console.log('🔨 Compilando templates...');

// Compila templates 
execSync(
    'handlebars src/pages src/partials -f server/precompiled-templates.js -e hbs',
    { stdio: 'inherit' }
);

const convertHandlebarsToESM = (inputFile: string): void => {
  try {
    console.log(`🔄 Convertendo ${inputFile} para ESM...`);
    
    // Lê o arquivo original
    const content = readFileSync(inputFile, 'utf-8');
    
    // Verifica se já está em formato ESM
    if (content.includes('export default')) {
      console.log('✅ Arquivo já está em formato ESM!');
      return;
    }
    
    // Extrai apenas o conteúdo dentro da IIFE
    const iifeMatch = content.match(/^\(function\(\) \{[\s\S]*var template = Handlebars\.template, templates = Handlebars\.templates = Handlebars\.templates \|\| \{\};([\s\S]*?)\}\)\(\);?\s*$/);
    
    if (!iifeMatch) {
      console.error('❌ Não foi possível encontrar o padrão IIFE esperado');
      process.exit(1);
    }
    
    // Extrai o conteúdo dos templates
    const templatesContent = iifeMatch[1].trim();
    
    // Constrói o novo arquivo ESM
    const esmContent = `import Handlebars from "handlebars/runtime";

const template = Handlebars.template;
const templates = {};

${templatesContent}

export default templates;
`;
    
    // Escreve o arquivo convertido
    writeFileSync(inputFile, esmContent, 'utf-8');
    
  } catch (error) {
    console.error('❌ Erro durante a conversão:', error);
    console.error('Conteúdo do arquivo:', error instanceof Error ? error.message : 'Erro desconhecido');
    process.exit(1);
  }
};

convertHandlebarsToESM('./server/precompiled-templates.js');

console.log('✅ Templates compilados e convertidos para ESM!');