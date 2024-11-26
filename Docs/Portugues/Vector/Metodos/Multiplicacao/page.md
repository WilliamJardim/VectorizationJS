# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

## Multiplicação elemento a elemento:
Nesta página você pode encontrar informações sobre o método **Multiplicação elemento a elemento** do objeto **VectorizationJS.Vector**. 

## Informações gerais
Diferente do produto escalar, na multiplicação elemento a elemento, nós literalmente multiplicamos cada elemento, ou seja, cada número, um por um, em suas posições correspondentes. Existem variações dessa técnica matemática. Por exemplo, ao multiplicar elemento a elemento um vetor por outro vetor temos um passo a passo a ser seguido. Porém, ao multiplicar um vetor com uma matriz, temos outro passo a passo diferente. Vamos ver alguns deles. Lembrando que o método **Multiplicação elemento a elemento** do objeto **VectorizationJS.Vector** é diferente do método **Produto Escalar**, **Veja [VectorizationJS.Vector/Produto Escalar](../ProdutoEscalar/page.md)**.

## Multiplicação de um vetor com outro vetor
Na **Multiplicação elemento a elemento**, de um **Vetor** com outro **Vetor**, nós vamos basicamente multiplicar cada elemento do primeiro vetor com o do segundo vetor, nas suas respectivas posições correspondentes, ou seja, para calcular o primeiro elemento do vetor de resultado, vamos multiplicar o primeiro elemento do primeiro vetor **com** o primeiro elemento do segundo vetor, ou seja, aqui as posições seriam no indice 1. **NOTA: Neste tipo de multiplicação, a quantidade de elementos dos dois vetores precisam ser exatamente iguais.**. E o resultado deve obrigatóriamente ser um vetor, com exatamente a mesma quantidade de elementos dos vetores usados. 

Neste caso, a **Multiplicação elemento a elemento** de um **Vetor** com outro **Vetor** é extremamente semelhante ao **Produto Escalar** de um vetor com outro vetor. A única diferença importante é que no **Produto Escalar** de um **Vetor** com outro **Vetor**, nós somamos as multiplicações, e na **Multiplicação elemento a elemento** de um **Vetor** com outro **Vetor**, essa soma não ocorre, retornando um vetor ao invés de um número. **Veja [VectorizationJS.Vector/Produto Escalar](../ProdutoEscalar/page.md)**.

# Exemplo de uso desse caso
```javascript

var vetor1 = VectorizationJS.Vector( [ 5, 10, 5,  6 ] );

var vetor2 = VectorizationJS.Vector( [ 2, 8, -5, -10 ] );

var resultado = vetor1.multiplicarVetor(vetor2);

console.log("\nVetor com Vetor", resultado.raw())
```

# Resultado do exemplo
```json
[ 10, 80, -25, -60 ]
```

# Exemplo manual aplicando a fórmula matemática
Reforçando o conceito matemático descrito no parágrafo anterior, sobre multiplicação elemento a elemento de um vetor com outro vetor, para obtermos o primeiro elemento do vetor de resultado, precisamos fazer o seguinte: **5 * 2**, e o resultado vai ser **10**.

Da mesma forma, para obtermos o segundo elemento do vetor de resultado, precisamos fazer o seguinte: **10 * 8**, e o resultado vai ser **80**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Multiplicação de um vetor com um número(escalar)
Também podemos multiplicar um **Vetor** com um número(também chamado de escalar, similar ao que é implementado na classe **VectorizationJS.Scalar**). Para fazer isso, basta multiplicar cada elemento do vetor com o número, ou seja, todos os elementos do vetor serão multiplicados com o mesmo número(escalar). E como resultado, nós vamos ter um outro vetor, que é o resultado dessas multiplicações pelo número.

# Exemplo de uso desse caso
```javascript

var vetor = VectorizationJS.Vector( [ 5, 10, 5,  6 ] );

var numero = 8;

var resultado = vetor.multiplicarNumero(numero);

console.log("\nVetor com Vetor", resultado.raw())
```

# Resultado do exemplo
```json
[ 40, 80, 40, 48 ]
```

# Exemplo manual aplicando a fórmula matemática
Aqui neste exemplo, o que foi feito é basicamente uma multiplicação de cada elemento do vetor pelo número 8. Então foi feito 5 * 8 que deu 40, depois 10 * 8, que deu 80, etc.

Você poderá ver o código fonte dessas operações dentro da classe **VectorizationJS.Vector**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)