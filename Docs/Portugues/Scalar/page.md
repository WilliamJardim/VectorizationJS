# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo256x256.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Scalar
Nesta página você pode encontrar informações sobre a classe Scalar

# Dados da classe:
 - **URL Arquivo**: [https://github.com/WilliamJardim/Vectorization/blob/main/src/Scalar.js] 
 - Localizado em: **src/Scalar.js**
 - Namespace: **Vectorization**
 - Nome da classe: **Scalar**
 - Path: **Vectorization.Scalar**

# Descrição geral
Na matemática, escalares são basicamente números. Simplismente isso. Por exemplo, os números 2, 3, -5, 0, 10, 50, 1000, etc, todos eles são chamados de escalares. Em algebra linear e em vetores, cada elemento do vetor é um escalar **(Veja [Vectorization.Vector](../Vector/page.md))**. Esse termo é muito usado em algebra linear, e em matrizes **(Veja  [Vectorization.Matrix](../Matrix/page.md))**, vetores, tensores, etc. Todos eles fazem uso do conceito de escalares.

# Escalares no Vectorization
No Vectorization, existe uma classe que serve especificamente para representar números(escalares). 

```javascript
var meu_numero_10 = Vectorization.Scalar(10);

var meu_numero_2 = Vectorization.Scalar(2);

var meu_numero_3 = Vectorization.Scalar(3);
```

A única diferença de um **Vectorization.Scalar** para um número normal, é que a classe escalar possui alguns métodos e atributos. Ou seja, ela serve para representar números, e faz isso de uma forma personalizada. O objeto **Vectorization.Scalar** é usado internamente pelo Vectorization, em situações especificas, como por exemplo, quando fazemos certas operações como produto escalar em vetores, o resultado vai ser um objeto do tipo **Vectorization.Scalar**, ou seja um escalar.

# Criando escalares aleatórios
Também é possivel criar um **Vectorization.Scalar** contendo um número aleatório.
Veja um exemplo disso abaixo:

```javascript

var meu_numero_aleatorio = Vectorization.Scalar({ 
    aleatorio: true, 
    minimo: 0, 
    maximo: 5, 
    sementeAleatoria: 45 
});

```

Também é possivel passar o parametro **arredondar**, que permite arredondar o número gerado para cima, ou para baixo, etc.

Para gerar o número aleatório, o Vectorization usa a classe interna **Vectorization.Random**.

# Métodos e atributos
O objeto **Vectorization.Scalar** possui alguns poucos métodos e atributos(propriedades). Você pode se aprofundar neles clicando nos links abaixo:
- [Métodos](Metodos/page.md)
- [Atributos](Atributos/page.md)

Voce pode visualizar o código fonte completo da classe Scalar aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Scalar.js)

# Navegação
* [Voltar para página anterior](../page.md)