Tava estudando sobre renderização HTML, e nesse arquivo a vou analisar a abordagem do https://github.com/bizarro/lisergia. A ideia é tentar direcionar meu aprendizado com base no código do bizarro.

O objetivo principal do repo é priorizar animações ao invés de metricas tipo o LCP (Quanto tempo demora pro maior elemento aparecer na tela), FCP (Quanto tempo até qualquer conteúdo aparecer)

> “Priorizar animações, movimentos e interações em um site não deveria ser controverso. Não adicionar coisas interessantes às suas páginas por causa de métricas sempre será um retrocesso.” — Luis Bizarro.

Pelo que eu entendi, a abordagem deles é -> 
- o download.ts le o sanity e salva todos os dados do site no content.json
-Ai o Express lê o content.json, procura a página correspondente ao slug, e renderiza o Twig com esses dados (SSR). Tipo: GET /sobre ->  Express procura slug "sobre" no JSON->  Renderiza o Twig com esses dados 
- o ts do servidor é compilado por tsup(ele faz Tree shaking, minifica o arquivo e é bem mais rápido que tsc. Além de que tsc não gera um unico arquivo ) que é tipo um vite só que feito apenas pra compilar ts->js (Não tem dev server e é mais simples e direto)
- Já o ts e scss do cliente são compilados por lisergia/packages/cli/ com Rollup. Ele usa terser pra minificar o codigo 
- em produção ele usa BrowserSync pro live reaload mas o cms continua vindo do express que olha o content.json

## Sobre o Express ->
Primeiro vamo entender o modelo **"serverless"** (o Vercel é baseada em serverless functions, inclusive no plano pago).

Pensa assim: a Vercel tem um servidorzão deles, que guarda os arquivos de build dos seus projetos em cache. Se eu fizer um site com SSG, quando alguém acessa, ela só pega esses arquivos prontos e manda pro cliente. A vantagem disso é que não precisa manter um servidor rodando só pra cada site, só o serverzão deles.

Mas, e se eu quisesse montar um jogo multiplayer com Three.js, ou uma plataforma de chat com React. Aí sim precisaria de um servidor separado, rodando 24/7, que recebe dado e atualiza coisas em tempo real (tipo: “envia mensagem → servidor → página do cliente atualiza”). No modelo serverless não da pra fazer isso por que não tem servidores Node.js tradicionais.

Ao invés disso, o vercel roda o servidor sobre demanda. Tipo imagina um site com 1000 produtos e uma página pra cada um em `/product/:id`. Pra fazer isso com SSG, teriamos que gerar 1000 arquivos index.html no build. O que funciona, mas não escala bem porcausa do tempo de build.

Pra resolver isso, você pode usar um Express que renderiza o .twig na hora:

```javascript
app.get('/product/:slug', async (req, res) => {
  const product = await fetchFromCMSBySlug(req.params.slug)//tambem daria pra salvar os dados em um content.json ai n precisa fazer fetch 
  res.render('product.twig', { product })
})
```

Normalmente isso exigiria um servidor rodando 24/7, escutando a porta 3000. Mas no Vercel, quando uma request chega, ele simplesmente cria um processo, roda esse script e depois fecha. Ou seja: você tem o benefício do SSR dinâmico(backend, build rápido e menos gasto de memoria) sem precisar de um servidor permanente.

Sobre o turbo repo-> ele te ajuda a economizar tempo fazendo um cache dos arquivos e rebuildando só o necessário, além de gerenciar dependencias entre os workflows, tipo se app depende de ui-lib ele roda os comando na ordem certa e vc não precisa se preocupar em rodar manualmente build lib antes de build app.

Geralmente é mais pelo gerenciamento de dependencias mesmo já que no vercel ele não guarda o cache entre builds (a não ser que você ative o turbo remote cache).