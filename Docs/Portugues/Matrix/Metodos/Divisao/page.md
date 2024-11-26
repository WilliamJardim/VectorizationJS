# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Divisão elemento a elemento
Nesta página você pode encontrar informações sobre o método **Divisão elemento a elemento** do objeto **Vectorization.Matrix**. 

## Informações gerais
Na matemática, podemos dividir uma matriz com outra matriz. Essa é a divisão elemento a elemento, ou seja, cada item da primeira matriz vai ser dividido com os seus respectivos correspondentes da segunda matriz. Ou seja, vamos casar com os índices. Basicamente o processo envolvido, ou seja, a lógica, o passo a passo para realizar uma divisão de uma matriz com outra, é praticamente o mesmo da multiplicação de matrizes. O passo a passo que vamos seguir é o mesmo da **Multiplicação elemento a elemento**, com uma única diferença: ao invés de multiplicar cada elemento da primeira matriz com os correspondentes da segunda matrix, vamos dividir. Ou seja, em outras palavras, se você seguir o passo a passo descrito em **Multiplicação elemento a elemento** **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)** e ao invés de aplicar a operação de multiplicação voce aplicar uma divisão, você estará executando corretamente a divisão de matrizes.

Nesse processo também possui variações, pois assim como na **Multiplicação elemento a elemento**, podemos dividir uma matriz com outra matriz, ou então, dividir uma matriz com um vetor, ou então até mesmo dividir uma matriz com um número(escalar). Vamos ver esses três casos a seguir:

## Dividindo duas matrizes no VectorizationJS
```javascript

var matrix1 = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var matrix2 = Vectorization.Matrix([
    [ -5,  2,  3, 2  ],
    [  1,  25, 1, 50 ],
    [  2,  5,  3, 5  ],
    [  1,  4,  4, 2  ]
]);

var resultado = matrix1.dividirMatrix(matrix2);

console.log("\nMatrix com outra Matrix", resultado.raw())

``` 

# Resultado dessa divisão
```json

[
  [ -0.6,    4,    2,                 25 ]
  [ 1,    0.08,    2,                  2 ]
  [ 2,       1,    1.6666666666666667, 1 ]
  [ 1,       0.5,  0.5,                1 ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 / -5**, e o resultado é **-0.6**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 / 2**, e o resultado é **4**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Dividindo uma matriz com um vetor
Na **Divisão elemento a elemento**, de uma **Matriz** com um **Vetor**, nós vamos basicamente dividir cada elemento da matriz com o vetor, nas suas respectivas posições correspondentes. O passo a passo a ser seguido é exatamente o mesmo da **Multiplicação elemento a elemento** quando vamos multiplicar elemento a elemento uma matriz por um vetor **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)**. A única diferença é que aqui estamos dividindo.

# Dividindo uma matriz com um vetor no VectorizationJS
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var vetor = Vectorization.Vector( [ 12, 5, 11, 8.5 ] );

var resultado = matrix.dividirVetor(vetor);

console.log("\nMatrix com vetor", resultado.raw())
```

# Resultado deste exemplo
```json

[
  [ 0.25,                 1.6,   0.5454545454545454,    5.882352941176471   ]
  [ 0.08333333333333333,  0.4,   0.18181818181818182,  11.764705882352942   ]
  [ 0.3333333333333333,     1,   0.45454545454545453,   0.5882352941176471  ]
  [ 0.08333333333333333,  0.4,   0.18181818181818182,   0.23529411764705882 ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 / 12**, e o resultado é **0.25**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 / 5**, e o resultado é **1.6**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Dividindo uma matriz com um número(um escalar)
Também podemos dividir uma matriz por um número. E o processo se torna mais simples. Para fazer isso, basta dividir cada elemento da matriz pelo número. Ou seja, todos os elementos da matriz serão divididos pelo mesmo numero. E o resultado precisa ser uma matriz com exatamente a mesma quantidade de linhas e a exatamente a mesma quantidade de colunas da matriz usada.

# Dividindo uma matriz com um número no VectorizationJS
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var numero = 8;

var resultado = matrix.dividirNumero(numero);

console.log( resultado.raw() )

```

# Resultado deste exemplo
```json

[
  [ 0.375,  1,      0.75,   6.25  ]
  [ 0.125,  0.25,   0.25,   12.5  ]
  [ 0.5,    0.625,  0.625,  0.625 ]
  [ 0.125,  0.25,   0.25,   0.25  ]
]

```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)
