# Revisão de TypeScript

Outra coisa que eu não mexo faz muito tempo, então vale a pena revisar a sintaxe.

Lembrando que a principal vantagem do TypeScript é que ele te força a considerar "sad paths", ou seja, casos onde nem tudo sai como o esperado, fazendo você escrever código de uma maneira mais defensiva, assumindo que problemas podem ocorrer.  
Assim, com a tipagem, você pega muitos erros em desenvolvimento antes deles chegarem à produção, o que é essencial para projetos grandes e facilita o trabalho com outras pessoas.

---

## Interfaces

Geralmente são usadas pra tipar objetos.  
Exemplo:

```typescript
interface Usuario {
  nome: string;
  idade: number;
  admin?: boolean; // opcional
}

const u: Usuario = {
  nome: "Davi",
  idade: 16,
};
```

---

## Non-null assertion `!`

É usado em 2 casos principais:

**1. Após uma variável que pode ser null ou undefined (non-null assertion)**  
Quando você tem certeza que não vai ser null, tipo:

```typescript
const el = document.querySelector('canvas')!;
```
É como se você dissesse pro TS:  
> “Confia que isso não é null.”

**2. Em propriedades de classe (definite assignment)**  
Quando você declara uma propriedade mas não inicializa no constructor, o TS reclama:

```typescript
class App {
  container: HTMLDivElement; // Erro: não está definitivamente atribuído no construtor.
}
```

Mas você pode usar `!` pra dizer que ela vai ser inicializada depois:

```typescript
class App {
  container!: HTMLDivElement;

  iniciar() {
    this.container = document.querySelector('#root')!;
  }
}
```

## Optional Chaining (`?.`)

Imagina que você quer acessar uma propriedade aninhada, tipo: `this.gl.canvas.parentNode`.  
Se **qualquer uma** dessas partes for `undefined` ou `null`, você toma o erro:  
`Cannot read property of undefined`.

Tipo, nesse `destroy`:

```ts
if (this.gl?.canvas?.parentNode) {
  this.gl.canvas.parentNode.removeChild(this.gl.canvas);
}
```
O `this.gl?.canvas?.parentNode` garante que se qualquer parte da cadeia não existir, o codigo não quebre. O que é benéfico nesse caso, já que o resultado final é o mesmo (o canvas deixa de existir) e o código fica mais seguro e à prova de chamadas duplicadas.

## Spread Operator (`...`)

Adiciona as propriedades de um objeto em outro; se elas já estiverem definidas, reescreve:

```typescript
interface WebGLOptions {
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  preserveDrawingBuffer?: boolean;
  dpr?: number;
}

constructor(options: WebGLOptions = {}) {
  this.options = {
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
    dpr: Math.min(window.devicePixelRatio, 2),
    ...options // o operador ...options sobrescreve os anteriores
  };
}
```

Nesse caso, `...options` reescreve as propriedades padrões se elas estiverem definadas em `options`.

**Exemplo:**

```typescript
const padrao = { cor: "azul", volume: 50 };
const config = { volume: 20 };

const final = {
  ...padrao,
  ...config,
};

console.log(final); // { cor: "azul", volume: 20 }
```
- Quem vem depois reescreve o outro.


## Generics 

Imagina que você quer criar uma função que retorne o que você passar pra ela:

```ts
function identity(arg: any): any {
  return arg;
}
```

O problema é que com `any` vc perde o tipo, o autocomplete, a verificação e todo sentido de usar typescript ¯\\_(ツ)_/¯, ao invés disso:

```ts
function identity<T>(arg: T): T {
  return arg;
}
// `T` é um parâmetro que captura o tipo genérico,  
// `identity<T>` é uma função genérica.  
// Ao usar `identity`, o TypeScript deduz o tipo de `T`.
```
Uma função generica poderia te ajudar a manter a tipagem.

```ts
const result = identity("Hello"); // result: string
const num = identity(123);        // num: number
```

Parece inútil mas olha esse outro exemplo:

- Você tem várias rotas na API que retornam dados de tipos diferentes  
- e quer criar uma função genérica pra pegar esses dados

---

### Sem generics ->

```ts
async function fetchData(url: string): Promise<any> {
  const res = await fetch(url);
  return await res.json();
}

const users = await fetchData("/users"); // tipo: any
users[0].name; // sem autocomplete, sem verificação, aqui vc acaba com o sentido do ts
```

* Aqui não tem nada explícito, vc não sabe que `users` é um array, nem que propriedades os objetos dentro de `users` têm, mass:

---

### Com generics ->
Você pode definir os tipos, deixar claro que que user e product são arrays com objetos dentro, definir quais são as propriedades do objeto e tipar elas. 

```ts
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return await res.json();
}

type User = { id: number; name: string };
type Product = { id: number; price: number };

const users = await fetchData<User[]>("/users");
const products = await fetchData<Product[]>("/products");

users[0].name;    // ✅ autocompletado como string
products[0].price // ✅ autocompletado como number
```

> OBS: Repara que em `fetchData<User[]>` o `User[]` é porque a API retorna um array de usuários (objetos), tipo:

```json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
```

Aproveitando o gancho... 

## Async, Await e Promise

Pega esse exemplo denovo, vamo quebrar o que ta acontecendo ai:

```ts
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return await res.json();
}
```

Primeiro usamos **async** para definir que a função roda de forma **assíncrona, fora de sincronia**.  
*(Isso não significa que ela roda em paralelo, o js por padrão roda uma coisa por vez [single-threaded])*  
Isso muda automaticamente o tipo de retorno da função pra uma **Promise** o que nos permitir trabalhar com operações que **não acontecem instantaneamente**.

E é justamente isso que a **Promise (Promessa)** representa, algo que **ainda não aconteceu mas vai acontecer no futuro**. Tipo:  
> **"Vou te dar os dados, mas não agora".**

Pra obter o valor real da promessa (esperando seu resultado), você usa **await (esperar)** — aí o código **pausa só essa função até a Promise ser resolvida** enquanto o resto do programa continua rodando normalmente. Tipo:

```ts
console.log("1");

async function exemplo() {
  console.log("2");
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("3");
}

exemplo();
console.log("4");
```

🧾Resultado ->
```text
1  
2  
4  
3 (1 segundo depois de console.log("4"))
```

> **OBS:** Só dá pra usar `await` dentro de uma função se ela for `async`

Mas se fosse 

```ts
console.log("1");

async function exemplo() {
  console.log("2");
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("3");
}

exemplo();
console.log("4");
```

🧾Resultado ->
```text
1  
2  
3 (1 segundo depois)
4
```
## map reduce e foreach

o JS é naturalmente mais funcional, então ao invés de fazer fors temos:

map-> pra quando você quer manipular uma array

```ts
const numeros = [1, 2, 3];
const dobrados = numeros.map(n => n * 2); // [2, 4, 6]
```