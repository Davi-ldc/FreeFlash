## Anotações sobre como o vite funciona

A ideia do Vite (que significa "rápido" em francês) é facilitar o desenvolvimento, simplificando configurações e otimizando o processo de build. Tem 2 funções principais:

1. **Produção**: O Vite compila TypeScript para JavaScript, SCSS para CSS... resolve todos os imports, remove código não utilizado (Tree Shaking), minifica os arquivos (removendo espaços, quebras de linha, comentários e encurtando nomes de variáveis), e gera arquivos finais compactos e otimizados, tipo `main.[hash].js` e `main.[hash].css`.  
   > **Obs:** O hash no nome dos arquivos serve para forçar o navegador a recarregar o arquivo atualizado. Sem ele, o browser usa uma versão antiga salva em cache. Por isso que qnd vc roda `npm run build`, o hash muda, forçando que o navegador a carregar a versão mais recente.

2. **Desenvolvimento**: Ao inves de fazer o bundle completo ele monta um servidor local que vai compilando os arquivos quando necessário. Tipo quando vc importa './style.scss' ele Converte de SCSS para CSS na hora e serve o CSS já processado pro navegador. E quando você atualizar um arquivo ele recompila só aquele módulo e atualiza o que for necessário no navegador sem recarregar a página inteira (**Hot Module Replacement (HMR)**), 