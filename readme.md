# FreeFlash 🚀
Uma dev stack opinativa, simples, rápida e com o menor curto de hospedagem possivel, inspirada pelo [Lisergia](https://github.com/bizarro/lisergia).

## Features

* ⚡ **Super Rápido:** SSR com Vercel Edge Functions, Hono e Eta.js pré-compilado. O resultado é *cold starts* **9x menores** que funções serverless tradicionais e *warm starts* **2x mais rápidos**.
* 💰 **Custo Quase Zero:** Projetado para funcionar com margem dentro dos planos gratuitos da Vercel e do Sanity. Seu único custo fixo é o domínio (~R$ 65/ano).
* ⚙️ **Builds Otimizados:** Usa Turborepo para cachear templates Eta.js e assets do Vite. O bundle final pesa incríveis ✨ **9.02KB** ✨  (gziped)
* 🤟🏻 **Ultilitários WebGPU (em desenvolvimento):** Eles vão facilitar animações com shaders em imagens ou textos, a ideia é algo tipo o threejs só que super minimalista e focado em imagens e textos. 
* 🤖 **CMS:** Sanity.io como um Headless CMS "all-code".
* 🛠️ **Stack Moderna:** TypeScript, Vite, SCSS, Eta.js no Front-end e Hono como Back-end 

## Instalação

```bash
git clone https://github.com/Davi-ldc/FreeFlash.git
cd FreeFlash
```

Em `/cms` crie um novo projeto Sanity.
```bash
cd cms
bun create sanity@latest
```

E um `.env` na pasta `app` com:

```env
SANITY_PROJECT_ID=XXXXXXXX
RESEND_API_KEY=re_XXXXXXXXXXXXXX
```

Depois é so rodar:
```bash
bun i

# (Sanity e App)
bun dev

# build manual do app
bun build

# Comandos específicos por workspace
bun dev:app
bun dev:cms

# Analisa o tamanho do bundle do servidor (depois de rodar build)
cd app
bun run analyze 

# Ou em root
bun run a
```

---

## Deploy na Vercel

1. Acesse [Vercel](https://vercel.com).
2. Clique em: `Add New... → Project`.
3. Escolha o repositório do GitHub.

### Configurações de Build:

Na tela de configuração:

- 🔽 Expanda "Build and Output Settings":
- **Framework Preset:** `Vite`
- **Root Directory:** `app`

- 🔐 Variáveis de Ambiente:
- Name: `SANITY_PROJECT_ID` → seu ID do projeto Sanity

## Webhook 🤟🏻

### No Vercel:

1. Vá em `Settings → Git` do seu projeto.
2. Role até `Deploy Hooks` e clique em “Create Hook”:
   - **Hook Name:** `sanity-update`
   - **Git Branch Name:** `main` (ou o que você usar)
3. Copie a URL do hook gerado.

### No Sanity:

1. Acesse: [sanity.io/manage](https://sanity.io/manage)
2. Escolha seu projeto → vá em `API` → `Webhooks`.
3. Clique em “Add new webhook”:
   - **URL:** cole a URL do hook da Vercel
   - **Trigger on:** marque `Create`, `Update` e `Delete`
4. Salve.

---

## Deploy do CMS (Sanity Studio)

```bash
cd cms
npx sanity deploy
```
---

## Processo de Build
São 4 tarefas cacheadas pelo turborepo:

- `build:vite (cacheado)` → Compila o SCSS e TS e processa os assets otimizando eles com um hash.
- `fetch:sanity (sem cache)` → Lê todos os dados do CMS, preprocessa eles e salva em um `content.json`.
- `precompileTemplates (cacheado)` → Transforma os templates Eta.js em funções JavaScript.
- `build` → Esse é mais complexo:
  - Primeiro compilamos index.ts com tsup para `vercel/output/functions/index.func/`, no formato:
    - **CommonJS (.cjs)** para Node
    - **ESM (.js)** para edge
  - Depois copiamos:
    - `server/.vc-config.json` → `.vercel/output/functions/index.func/` (ele especifica o runtime e o arquivo com a função)
    - `server/vercel.config.json` → `.vercel/output/config.json` (nesse caso eu estou renomeando também) configurações gerais do Vercel

No final fica assim:
```text
.vercel/output/
├── config.json              # Define rotas e configurações das funções
├── static/                  # Assets estáticos do Vite
│   └── assets/
│       └── ...
└── functions/               
    └── index.func/          
        ├── .vc-config.json  # Configuração da função
        └── index.js         # Código compilado do Hono
```

### Sobre as configurações do Vercel (server/config/vercel.config.json)
```json
{
  "version": 3,
  "routes": [
    {
      "src": "/assets/(.*)",
      // Como estamos usando vite para preprocessar os assets os arquivos são imutaveis e
      // a CDN ou o próprio navegador podem fazer cache deles por 1 ano (31536000 segundos)
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      // Isso faz com que antes de seguir para um redirecionamento, o Vercel cheque se o arquivo existe no sistema de arquivos
      // Tipo GET /assets/js/main.BSI2MmxF.js → ele serve direto de .vercel/output/static/assets/js/
      "handle": "filesystem"
    },
    {
      // Qualquer rota que não seja /api/* e não tenha sido resolvida com arquivos físicos vai para /index
      "src": "/((?!api/).*)",
      "dest": "/index"
    }
  ]
}
```


## Desenvolvimento
- Em dev, a gente roda fetch, Vite e o servidor em paralelo, tudo monitorado com Nodemon, usando concurrently. 
- Aí o Hono renderiza os `.eta` com base nos dados tipados em: `app\types\pages.ts` e o Vite serve o TypeScript e o scss em `http://localhost:${vitePort}/src/main.ts`. 
- repara que a lógica do servidor ta em `server/app.ts`, ai tem um entrypoint pro vercel `server/index.ts` e um arquivo pra dev `server/dev.ts`. Isso por que, no bundle final eu não posso importar @hono/node-server por causa das limitações de edge runtime, nem se o import estiver em um if
- No TypeScript do front, a gente importa o SCSS e o Vite injeta ele no browser. Para compilar o servidor eu estou usando o `tsx` 

## Processamento de Assets  

Toda ideia do projeto é ser o mais otimizado possivel, então para poder usar um hash agressivo 
em tudo (incluindo as imagens) temos um helper `asset`, disponível na variável `it`, usado assim:
`<%= it.asset('src/assets/images/favicon.svg') %>` em dev ele manda para `http://localhost:${vitePort}/${originalPath}` e em build usa o manifest: `/${manifest[manifestKey].file}`;

#### Sobre o runtime: 

##### Limitações do edge

Quando você manda um arquivo para o Vercel ele é compactado com gzip e Brotli e, dependendo do navegador (quando ele faz uma requisição HTTP vem incluído no cabeçalho `Accept-Encoding: br, gzip`), ele usa br (mais eficiente) ou gzip.
- Sua função edge não pode pesar mais de 1MB após ser comprimida com gzip (no Pro 2MB e Enterprise 4MB)
- O limite de memória é fixo em 128 MB. Se passar, vai tomar um erro `502`
- Você não tem acesso ao sistema de arquivos, ou seja, não pode usar fs (File System) para ler arquivos
- Para analisar o bundle rode `pnpm analyze` em app ou `pnpm a` na raiz

##### Vantagens

- Você praticamente não vai ter cold start
- [O tempo de resposta do servidor vai ser 2x mais rápido em warm starts e 9x mais rápido em cold starts:](https://www.openstatus.dev/blog/monitoring-latency-vercel-edge-vs-serverless)

| Runtime              | p50  | p95   | p99   |
|----------------------|------|-------|-------|
| Serverless Cold Start| 859  | 1.046 | 1.156 |
| Serverless Warm      | 246  | 563   | 855   |
| Edge                 | 106  | 178   | 328   |

OBS: p50 é a media, p95 = 1.046 quer dizer que 95% das requisições foram mais rápidas que 1.046 ms; intuitivamente, p99 representa o 1% das requisições que demoraram mais para responder.

## Mudando de runtime
Mude o `/server/config/.vc-config.json`
de:
```json
{
  "runtime": "edge",
  "entrypoint": "index.js"
}
```
para:
```json
{
  "runtime": "nodejs22.x",
  "handler": "index.cjs"
}
```

No `tsup.config.ts` → format: `'cjs'` vira `'esm'`

##### Meus testes
* Mesmo com um JSON de 5MB minificado, ainda sobraram 368KB. A função estava pesando 656KB.
* Mesmo que você mude o servidor, esse projeto suporta um CMS de até 5MB tranquilo. Daí pra frente, dependendo da lógica adicional que você implementar no Hono, talvez seja melhor mudar para serverless.

## Roadmap e Contribuições

O projeto está sempre evoluindo. Algumas ideias para o futuro:

Backend->
* **Melhor HRM pro fetch-sanity.ts** 

* **Fetches Incrementais do Sanity:** Hoje, cada build busca todo o conteúdo. Uma otimização incrível seria buscar apenas os documentos alterados desde o último build, como um "git" do conteúdo. 
* **Proxy reverso para urls do Sanity:** Atualmente, não há restrições nativas no Sanity para limitar parâmetros tipo ?w=99999, o que poderia permitir que alguem manipulasse os URLs e para solicitar imagens gigantes e queimar minha banda disponível. Seria interessante implementar um entrypoint que limite esses parâmetros pra evitar ataques.
* **Melhor suporte para github codespaces:** Já funciona mas falta garantir suporte para que o vite consiga importar as fontes

Frontend->
* **Montar helpers com webGPU** Agora to trabalhando em um site com OGL e, como proximo passo, quero traduzir os ultilitarios que estou montando pra ele para o WebGPU. A ideia é facilitar o uso de shaders em imagens e textos. A parte do webGPU é pelo desafio XD

* **Criar shaders ultilitários** -> Com webGPU 

Contribuições, issues e sugestões são muito bem-vindas!

## Observações sobre o github codespaces->

Se tiver rodando nele lembra de deixar as portas como publicas e de abrir o navegado com cors desativado