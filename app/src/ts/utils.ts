/**
 * Função de interpolação linear (lerp) entre dois pontos.
 * @param p1 - O primeiro ponto.
 * @param p2 - O segundo ponto.
 * @param t - O fator de interpolação (0 a 1).
 */
export function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

/**
 * Chama uma função após um atraso especificado, útil para redimensionamento.
 *
 * @param fn - A função que será chamada depois do atraso.
 * @param delay - O tempo de espera em milissegundos.
 */
//cria um tipo generico
export function debounce<T extends any[]>(
  fn: (...args: T) => void,// que é usado nos args da função pra não perder a typagem
  delay: number
): (...args: T) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/* 
Isso funciona por causa de um conceito chamado closure, que permite que uma função 
mantenha acesso ao escopo onde foi criada, mesmo quando é chamada fora desse escopo. Tipo:

function createCounter() {
  let count = 0; // variável privada
  return function() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1 
console.log(counter()); // 2 

Repara que quando você chama counter(), não está rodando a função createCounter() de novo, mas sim a função interna
que ele retornou, que ainda tem acesso à variável count, mesmo que a função createCounter já tenha terminado de executar.

No caso do debounce:
window.addEventListener("resize", debounce(() => {
  console.log("Redimensionado!");
}, 200));

É o mesmo que fazer:
const debouncedResize = debounce(() => {
  console.log("Redimensionado!");
}, 200);
window.addEventListener("resize", debouncedResize);

Na primeira definição, a função debounce é chamada criando a variável timeout dentro do escopo de debounce,
e quando o evento de redimensionamento é acionado, a função INTERNA é chamada, a que debounce retornou, então cada
chamada do debounce:
clearTimeout(timeout); // limpa o timeout anterior
timeout = setTimeout(() => fn(...args), delay); // define um novo timeout

Devido ao closure, a variável timeout é salva no escopo da função debounce (dentro de debouncedResize),
então cada vez que a função é chamada, ela pode acessar e modificar o mesmo timeout. 
*/

/**
 * Limita a frequência de chamadas de uma função, tipo um debounce, mais ele chama a função a cada x milesegundos
 * enquanto o debounce não chama a função até o evento parar de ser emitido por x segundos 
 * 
 * @param fn - A função que será limitada.
 * @param limit - O intervalo mínimo em milissegundos entre as chamadas.
 */
export function throttle<T extends any[]>(
  fn: (...args: T) => void,//pede pro typescript inferir o typo de args com generics
  limit: number
): (...args: T) => void {//retorna uma função de argumentos ...args de typo T que retorna void

  let lastCall = 0;
  //isso por que o retorno de setTimeout depende do ambiente, em  DOM é number e no node é NodeJS.Timeout
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    const now = performance.now();

    //se já passou limit segundos desde a ultima chamada
    if (now - lastCall >= limit) {
      if (timeoutId) {//limpa o timeout se existir
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn(...args);//e roda a função 
    } 
    // Se o o intervalo entre as chamadas for menor que limit e o timeout nao existir
    else if (!timeoutId) {
      timeoutId = setTimeout(() => {//seta um timeout pra rodar dps
        lastCall = performance.now();//atualiza lastCall
        timeoutId = null;//e timeoutId 
        fn(...args);
      }, limit - (now - lastCall));//tempo que falta pra atingir limit
    }
  };
}
/*é mais pro webgl, pra atualizar hovers e scroll ainda é melhor debounce */

export function isCSSVar(data: string): boolean {
  return /^--[a-zA-Z][\w-]*$/.test(data);
}

export function hexToRGB(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

// Tipo union para elementos que podem ser passados para as funções de will-change
type ElementOrElements = HTMLElement | NodeList | HTMLElement[];

/**
 * Adiciona will-change ao(s) elemento(s) especificado(s).
 * @param elements - O(s) elemento(s) ao qual a propriedade will-change será aplicada.
 * @param properties - A(s) propriedade(s) CSS do will-change.
 * @example
 * // Aplica will-change: transform a vários elementos
 * addWillChange(document.querySelectorAll('.my-elements'), 'transform');
 *
 * @example
 * // Aplica will-change: opacity a um único elemento
 * addWillChange(document.querySelector('.my-element'), 'opacity');
 */
export function addWillChange(elements: ElementOrElements, properties: string): void {
  if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
    (elements as NodeList | HTMLElement[]).forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.willChange = properties;
      }
    });
  } else if (elements instanceof HTMLElement) {
    elements.style.willChange = properties;
  }
}

/**
 * Remove a propriedade will-change de um ou mais elementos.
 * @param elements - O(s) elemento(s) do qual a propriedade will-change será removida.
 * @example
 * // Remove will-change de vários elementos
 * removeWillChange(document.querySelectorAll('.my-elements'));
 *
 * @example
 * // Remove will-change de um único elemento
 * removeWillChange(document.querySelector('.my-element'));
 */
export function removeWillChange(elements: ElementOrElements): void {
  if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
    (elements as NodeList | HTMLElement[]).forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.willChange = "";
      }
    });
  } else if (elements instanceof HTMLElement) {
    elements.style.willChange = "";
  }
}

/**
 * Cria uma função de interpolação cúbica Bezier.
 * @param x1 - Coordenada x do primeiro ponto de controle.
 * @param y1 - Coordenada y do primeiro ponto de controle.
 * @param x2 - Coordenada x do segundo ponto de controle.
 * @param y2 - Coordenada y do segundo ponto de controle.
 * @returns Uma função que recebe um valor t (0 a 1) e retorna o valor interpolado.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  // Bezier cúbica: P0=(0,0), P3=(1,1)
  const ax = 3 * x1 - 3 * x2 + 1, bx = -6 * x1 + 3 * x2, cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1, by = -6 * y1 + 3 * y2, cy = 3 * y1;

  const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u: number) => ((ay * u + by) * u + cy) * u;

  // Dado t (tempo), acha u tal que x(u)≈t e retorna y(u)
  return (t: number) => {
    t = Math.min(1, Math.max(0, t));
    // busca binária robusta (evita dependência de derivada)
    let u0 = 0, u1 = 1, u = t;
    for (let i = 0; i < 20; i++) {
      const x = sampleX(u) - t;
      if (Math.abs(x) < 1e-6) break;
      if (x > 0) u1 = u; else u0 = u;
      u = 0.5 * (u0 + u1);
    }
    return sampleY(u);
  };
}