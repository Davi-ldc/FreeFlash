import { Eta } from 'eta';
import { glob } from 'glob';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function precompileEtaTemplates() {
  console.log('🔨 Precompilando templates Eta...');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const viewsDir = path.join(__dirname, 'src');

  const eta = new Eta({ views: viewsDir, varName: 'it' });

  const templateFiles = await glob('src/{pages,partials}/**/*.eta', { cwd: __dirname });
  if (!templateFiles.length) {
    console.warn('⚠️ Nenhum template .eta encontrado.');
    return;
  }

  const compiled: Record<string, string> = {};

  for (const file of templateFiles) {
    const key = '/' + path
      .relative('src', file)
      .replace(/\\/g, '/')
      .replace(/\.eta$/, '');

    const source = readFileSync(path.join(__dirname, file), 'utf-8');
    const fn = eta.compile(source); // function anonymous(it,options)
    compiled[key] = fn.toString();
  }

  // Gera o conteúdo do objeto de templates como uma string
  const templatesObjectString = Object.entries(compiled)
    .map(([key, fnString]) => `  '${key}': ${fnString}`)
    .join(',\n');

  // Gera o arquivo runtime apenas com os templates compilados
  const out = `// Arquivo gerado automaticamente. Não edite.
export const compiledTemplates = {
${templatesObjectString}
};
`;

  writeFileSync(path.join(__dirname, 'server/precompiled-templates.js'), out, 'utf-8');
  console.log(`✅ ${templateFiles.length} templates compilados → ./server/precompiled-templates.js`);
}

precompileEtaTemplates().catch(e => {
  console.error('❌ Erro ao pré-compilar templates:', e);
  process.exit(1);
});