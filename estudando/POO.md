## Revisando a ideia básica de POO (Programação Orientada a Objetos)

Quando você tem muitas funções interdependentes, mudar uma delas pode quebrar várias outras. É o famoso "spaghetti code". Tipo:

```ts
let saldo = 100;

function sacar(valor: number) {
  saldo -= valor;
}

function aplicarDesconto() {
  saldo -= 20;
}

function mostrarSaldo() {
  console.log("Saldo atual:", saldo);
}

// Em outro arquivo ou parte do código...
sacar(50);
aplicarDesconto();
mostrarSaldo(); // Esperado: 30, mas...
```

BUMM! O estagiário mudou aplicarDesconto sem avisar😱:

```ts
function aplicarDesconto() {
  saldo -= 60; // ups! trocaram de 20 pra 60
}
```

Resultado:
```ts
// saldo era 100
// -50 do saque
// -60 do desconto (sem querer)
// saldo agora: -10 ❌
```

---

Com POO:

```ts
class ContaBancaria {
  private saldo: number;

  constructor(saldoInicial: number) {
    this.saldo = saldoInicial;
  }

  sacar(valor: number): void {
    if (valor <= this.saldo) {
      this.saldo -= valor;
    } else {
      console.log("Erro: Saldo insuficiente!");
    }
  }

  aplicarDesconto(valor: number): void {
    if (valor <= this.saldo) {
      this.saldo -= valor;
    } else {
      console.log("Erro: desconto maior que o saldo!");
    }
  }

  mostrarSaldo(): void {
    console.log("Saldo atual:", this.saldo);
  }
}
```

Repara que agora tudo que tem a ver com a conta tá encapsulado, e ninguém pode fazer:

```ts
conta.saldo = 99999; // ❌ proibido
```

Porque `saldo` é um valor privado da classe. Além disso, fica muito mais fácil:

- Rastrear quem está mexendo nos valores.
- Garantir que as regras do negócio sejam sempre respeitadas.

---
Isso nos leva ao primeiro princípio:
### Encapsulamento
que nos permite:

✅ Proteger dados sensíveis (como `saldo`) com `private`  (só pode ser alterado pela propria classe)
✅ Controlar o acesso aos dados com métodos públicos como `sacar`, `depositar`, etc. 
✅ Separar a lógica interna (privada) da lógica exposta (pública)

---

Essa ideia de separar o que é interno e externo nos leva a outro princípio:
### Abstração (simplicicação)

Devemos mostrar só o necessário pra quem usa o objeto. Tipo:

```ts
class MaquinaDeSuco {
  private ligarMotor() {
    console.log("Motor ligado");
  }

  private processarIngredientes() {
    console.log("Processando frutas...");
  }

  private desligarMotor() {
    console.log("Motor desligado");
  }

  fazerSuco(): void {
    this.ligarMotor();
    this.processarIngredientes();
    this.desligarMotor();
    console.log("🍹 Suco pronto!");
  }
}
```

Quem usa a classe só precisa chamar `fazerSuco()`. Não precisa nem deveria saber dos detalhes como `ligarMotor` ou `processarIngredientes`.

E você pode até pensar:

💭 "Se tudo fosse público, qual o problema? Afinal, o código é meu XD."

Masss:

- Outras pessoas vão mexer no código (O você do futuro que ficou um ano sem mecher no projeto conta como outra pessoa).
- Se tem 20 métodos públicos mas só 3 deveriam ser usados, não tem como saber isso sem estar explicito.
- Quando for mudar algo depois, só precisa se preocupar com os métodos públicos. Os métodos privados podem mudar à vontade, porque ninguém de fora pode acessar eles.

📌 Ou seja:

> Tudo que não precisa ser público, deve ser privado!

---

Mass e se você tivesse várias máquinas de suco:

- Máquina Comum: cobra taxa para fazer o suco.
- Máquina Premium: não cobra taxa.
- Máquina Empresarial: tem limite especial de sucos por dia.

Ao invés de copiar e colar o código várias vezes para cada tipo de máquina, podemos usar o próximo princípio:

### Herança

Criamos uma **classe base** com tudo que as máquinas têm em comum, e depois  **classes filhas** que modificam só o que for diferente ou especial. Ex:

```ts
class MaquinaDeSuco {
  protected taxa: number = 2;
  protected sucosFeitosHoje: number = 0;
  protected limiteSucosPorDia: number = Infinity;

  fazerSuco(): void {
    if (this.sucosFeitosHoje >= this.limiteSucosPorDia) {
      console.log("Limite diário de sucos atingido.");
      return;
    }

    console.log(`Fazendo suco com taxa de R$${this.taxa}`);
    this.sucosFeitosHoje++;
  }
}

class MaquinaPremium extends MaquinaDeSuco {
  taxa = 0; // sem taxa

  fazerSuco(): void {
    console.log("Máquina Premium - sem taxa!");
    super.fazerSuco(); // chama o método da classe base
  }
}

class MaquinaEmpresarial extends MaquinaDeSuco {
  limiteSucosPorDia = 100;

  fazerSuco(): void {
    console.log("Máquina Empresarial - limite diário aplicado");
    super.fazerSuco();
  }
}

// Uso

const comum = new MaquinaDeSuco();
comum.fazerSuco(); // Fazendo suco com taxa de R$2

const premium = new MaquinaPremium();
premium.fazerSuco(); // Máquina Premium - sem taxa! Fazendo suco com taxa de R$0

const empresarial = new MaquinaEmpresarial();
empresarial.fazerSuco(); // Máquina Empresarial - limite diário aplicado Fazendo suco com taxa de R$2
```

**OBS:**

- **private**: só a própria classe pode acessar aquela propriedade ou método.
- **protected**: só a própria classe e as classes que herdam dela podem acessar.

Repara que `super` é uma referência à classe pai e pode ser usado para chamar métodos.  
`super()` chama o construtor da classe pai.
``
OBS: Quando você não define um `constructor` numa classe filha extends pai, o JavaScript cria automaticamente um constructor assim: 
```ts
constructor(...args) {
  super(...args);
}
```
Mas se você definir um constructor pra classe filho, é obrigado a chamar super 
---

### Polimorfismo

Essa ideia de criar uma classe base e especializar ela com classes filhas nos leva ao próximo princípio:

> Um mesmo método pode ter comportamentos diferentes dependendo de quem o implementa.

Tipo: se você tem várias máquinas de suco. Todas têm o método `fazerSuco()`, mas cada uma pode fazer suco do seu jeito:

```ts
class MaquinaDeSuco {
  fazerSuco(): void {
    console.log("Fazendo suco comum 🍊");
  }
}

class MaquinaPremium extends MaquinaDeSuco {
  fazerSuco(): void {
    console.log("Fazendo suco premium 🥭 sem taxa!");
  }
}

class MaquinaEmpresarial extends MaquinaDeSuco {
  fazerSuco(): void {
    console.log("Fazendo suco empresarial 🍍 com limite especial!");
  }
}
```

🧠 Isso é o Polimorfismo em ação:  
Um mesmo método (`fazerSuco`)…
…com várias formas de agir, dependendo do tipo real do objeto.

---

Isso ajuda a evitar ifs tipo:

```ts
if (tipo === "comum") {
  ...
} else if (tipo === "premium") {
  ...
}
```

Em vez disso, você só chama:

```ts
objeto.fazerSuco();
```

E cada um sabe o que fazer. ✨

---

E aí você se pergunta:

> "Qual o sentido de manter o método `fazerSuco` na classe principal se as outras reescrevem ele?"

Primeiro que isso garante que todas as máquinas (filhas) vão ter o método `fazerSuco()`.  
O código que usa essas classes não precisa se preocupar com qual tipo ela é.

```ts
function rodarMaquina(m: MaquinaDeSuco) {
  m.fazerSuco(); // funciona com qualquer tipo de máquina
}
```

E tem o detalhe de que **nem sempre você precisa reescrever o método**.  
Se o comportamento genérico já funciona, você pode deixar do jeito que tá:

```ts
class MaquinaEconomica extends MaquinaDeSuco {
  // Não sobrescreve fazerSuco()
  // Usa o comportamento padrão da classe mãe
}
```

## bind()
Olha esse exemplo:
```ts
class Unicorn {
  public name : String;
  
	constructor(name : string) {
		this.name = name;
	}

	message() {
		return `${this.name} is awesome!`;
	}
}

const unicorn = new Unicorn("Name");
const mensage = unicorn.message;
console.log(mensage());
```
Aqui você vai tomar um erro "TypeError: Cannot read property 'name' of undefined"
Isso por que, quando você faz const mensage = unicorn.message; ta criando uma função solta, separada do objeto que não tem o contexto this. 

Pra não perder o contexto você pode usar bind no constructor, tipo: (não recomendado)
```ts 
this.messageBound = this.message.bind(this);
```
Ou, fora da classe:
```ts 
const mensage = unicorn.message.bind(unicorn);
```

Mas o ideal é ter uma outra variavel dentro do constructor tipo:
```ts 
class Unicorn {
    public name : String;
    public boundMensage = this.message.bind(this); 
  
	constructor(name : string) {
		this.name = name;
	}

	message() {
		return `${this.name} is awesome!`;
	}
}

const unicorn = new Unicorn("Name");
const mensage = unicorn.boundMensage;
console.log(mensage());
```
