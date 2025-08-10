Um site é composto de 3 partes principais: HTML, CSS e JavaScript. Mas, como você já deve saber, existem vários problemas:

- HTML é repetivo, CSS é longo e JS é bagunçado.

Felizmente, com ferramentas modernas, podemos melhorar isso:

- Js pode ser tipado (evitando bugs)
- CSS pode ser pré-processado para ficar menor

Mas... **e o HTML?**

Você pode usar motores de template como **Pug** pra deixar menos repetitivo. Mas e se eu tiver conteúdo dinamico? Um sistema que me permita adicionar e remover dados que devem estar no site? Ai surge um outro problema:

---

> **Como renderizar o HTML?** 

A primeira abordagem foi:

> "Assim que recebemos uma request, consultamos o banco de dados, preenchemos um html e mandamos pro usuário "

isso chama:
## 🧠 Server-Side Rendering (SSR)

OBS: O vercel e outros serviços de hospedagem serverless não rodam SSR, o vercel, por exemplo, roda npm run build e serve o HTML estático gerado.

Um exemplo clássico é o proprio wordpress. O servidor recebe a requisição, consulta o banco de dados, monta o HTML e envia tudo pronto pro navegador.

O que é ótimo pro SEO e rápido pro usuário. Mas pode ser pesado para o servidor já que a cada request ele renderiza tudo de novo. 

---

A medida que os sites deixaram de ser só "páginas informativas" e passaram a ser aplicações completas tipo o facebook ficou evidente que recarregar a página inteira a cada clique era uma péssima experiência.
O SSR não dava conta de criar a fluidez de aplicações modernas, imagina se demorasse 1 segundo pra passar stories. 

É ai que entra o:
## ⚡ Client-Side Rendering (CSR)

> “E se a gente carregasse o HTML básico só uma vez e, a partir daí, deixasse o JavaScript montar e atualizar o conteúdo diretamente no navegador?”

Agora, o browser recebe um html vaziu e o JavaScript inicializa o app, geralmente com um framework tipo React, Vue ou Angular.
-  quem monta a interface agora é o navegador, não o servidor.
- Você tem uma experiencia fluida e interativa (tipo passar stories)
- mas acaba com o SEO e deixa o carregamento inicial mais lento

As duas são boas ideias, funcionam bem em contextos especificos, mas e se eu quiser ter o desempenho e seo do SSR com a simplicidade do CSR? Dai que vem o

## 💡 Static Site Generation (SSG)
>E se a gente não precisasse gerar o HTML a cada requisição (como no SSR)? Poderiamos gerar todos os HTMLs de forma antecipada, durante o build do projeto, e depois só servir esses arquivos estáticos

Ou seja, você gera as páginas com antecedência (em build time), salva os arquivos HTML prontos e depois serve direto como se fossem arquivos normais sem precisar de um servidor acessando banco de dados. 
- isso da uma vantagem de velocidade absurda por que o HTML já ta pronto, é só servir o arquivo. Da até pra hospedar no github pages vercel e tem um otimo SEO.
- o problema é que os dados ficam congelados no build que pode demorar bastante se o site tive muitas páginas, ou seja, não vale a pena se você tiver um cms que é atualizado toda hora.

Tipo imagina que você tem um cms com 10000 produtos, não da pra rebuildar toda hora. Ao invés disso podemos usar:

## Incremental Static Regeneration (ISR)

Imagina uma rota /produtos/camisa-verde. A primeira vez que alguém acessa essa rota, o servidor monta a página dinamicamente (SSR), salva ela em cache e, depois que o tempo de revalidação expira o próximo acesso dispara uma nova requisição ao servidor.

-É um SSG “preguiçoso”, atualizado com inteligência. Você da rebuild em páginas individuais e não no projeto todo. 
(repara que ainda sim é servless por que não tem um servidor ligado 24/7 o código da revalidação roda sob demanda numa Serverless Function )


## Compração entre SSR com edge functions e ISR com Next.js
(supondo que os 2 rodem em edge e o SSR é hono com tudo buildado)
Repara que o primeiro build, SSR sempre é mais rápido por que ele nao precisa gerar arquivos estáticos, só ler o cms e compilar o servidor, enquanto o next tem uma etapa a mais de compilar os arquivos pra html estático.

Mas, se você alterar um único dado no cms e tiver com a webhook configurada direitinho, o next faz fetch só do que mudou e rebuilda o html enquanto o SSR le o banco todo e recompila o servidor -- Aqui depende muito da aplicação. Se for um cms pequeno (como no caso desse projeto onde a home depende do cms), SSR ainda ganha por que o next não economiza quase nada e tem o tempo de rebuildar as páginas. Mas se o cms for muito grande ai o SSR fica atrás por que ele sempre faz fetch do banco todo.  