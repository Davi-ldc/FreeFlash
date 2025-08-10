## 🌐 WebGL

WebGL é uma **API JavaScript** que tem como objetivo **renderizar gráficos no navegador dentro de um `<canvas>`**. Ele é baseado no **OpenGL ES 2.0** (Open Graphics Library for Embedded Systems), uma versão reduzida e otimizada do OpenGL, feita especialmente para dispositivos móveis — o que o torna perfeito para uso em browsers.

> 💡 Resumindo:  
> **WebGL é uma camada que traduz comandos JavaScript em instruções que a GPU entende.**

---
O problema é que a API do WebGL puro é **muito verbosa**, tipo OpenGL ou vulkan (100 linhas pra botar um triangulo na tela 🙄) e é ai que entra o **OGL** como uma **camada de abstração**.  

A ideia é oferecer uma **abstração fina**, que:

- Facilita tarefas repetitivas (criar geometrias, carregar texturas, gerenciar shaders)
- Mas **sem te afastar demais** do funcionamento real do WebGL
-  **meio-termo** entre o Three.js (alto nível) e o WebGL puro

O que é **ideal pra esse projeto**, já que eu só preciso aplicar shaders efeitos em planos que substituem imagens html .

---

### Por que não é feito em js

Porque JavaScript **não tem acesso direto à GPU**. e roda em **single-threaded** mas tarefas gráficas rodam na gpu em paralelo.

> 💡 Curiosidade:
> 
> -  JS pode mover 100 objetos por frame com esforço
> - A GPU move 100.000 numa boa. 

---

## GLSL

*Parecido com C/C++, roda na GPU. Você divide eles em 
vertex.glsl-> Calcula a posição dos vertex
fragment.glsl-> Colori os pixels

A sintaxe é relativamente simples, vc tem: 
attributes (só no vextex) -> Posição, uv... Dados unicos por vertice definidos pelo js e enviados como buffers (loco de memória na GPU)
uniforms -> constante pra todos os vértices/pixels, definido pelo js 
varying-> Enviado do vertex pro fragment shader
