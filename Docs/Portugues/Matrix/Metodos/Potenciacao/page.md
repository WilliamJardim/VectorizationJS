# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Potenciação elemento a elemento
Nesta página você pode encontrar informações sobre o método **Potenciação elemento a elemento** do objeto **Vectorization.Matrix**. 

## Informações gerais
Na matemática, podemos elevar uma matriz com outra matriz. Essa é a potenciação elemento a elemento, ou seja, cada item da primeira matriz vai ser elevado a os seus respectivos correspondentes da segunda matriz. Ou seja, vamos casar com os índices. Basicamente o processo envolvido, ou seja, a lógica, o passo a passo para realizar uma potenciação de uma matriz com outra, é praticamente o mesmo da multiplicação de matrizes. O passo a passo que vamos seguir é o mesmo da **Multiplicação elemento a elemento**, com uma única diferença: ao invés de multiplicar cada elemento da primeira matriz com os correspondentes da segunda matrix, vamos elevar. Ou seja, em outras palavras, se você seguir o passo a passo descrito em **Multiplicação elemento a elemento** **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)** e ao invés de aplicar a operação de multiplicação voce aplicar uma potenciação, você estará executando corretamente a potenciação de matrizes.

Nesse processo também possui variações, pois assim como na **Multiplicação elemento a elemento**, podemos elevar uma matriz com outra matriz, ou então, elevar uma matriz com um vetor, ou então até mesmo elevar uma matriz com um número(escalar). Vamos ver esses três casos a seguir:

## Elevando duas matrizes no VectorizationJS
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

var resultado = matrix1.elevarMatrix(matrix2);

console.log("\nMatrix com outra Matrix", resultado.raw())

``` 

# Resultado dessa soma
```json

[
  [  0.00411522633744856,  64,       216,     2500   ]
  [  1,                    33554432, 2,       1e+100 ]
  [ 16,                    3125,     125,     3125   ]
  [  1,                    16,       16,         4   ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 ^ -5**, e o resultado é **0.00411522633744856**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 ^ 2**, e o resultado é **64**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Elevando uma matriz com um vetor
Na **Potenciação elemento a elemento**, de uma **Matriz** com um **Vetor**, nós vamos basicamente elevar cada elemento da matriz com o vetor, nas suas respectivas posições correspondentes. O passo a passo a ser seguido é exatamente o mesmo da **Multiplicação elemento a elemento** quando vamos multiplicar elemento a elemento uma matriz por um vetor **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)**. A única diferença é que aqui estamos aplicando uma potenciação.

# Elevando uma matriz com um vetor no VectorizationJS
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var vetor = Vectorization.Vector( [ 12, 5, 11, 8.5 ] );

var resultado = matrix.elevarVetor(vetor);

console.log("\nMatrix com vetor", resultado.raw())
```

# Resultado deste exemplo
```json

[
  [   531441,    32768,  362797056,    276213586400995.12   ]
  [        1,       32,       2048,    100000000000000000   ]
  [ 16777216,     3125,   48828125,    873464.0537108553    ]
  [        1,       32,       2048,    362.0386719675123    ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 ^ 12**, e o resultado é **531441**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 ^ 5**, e o resultado é **32768**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Elevando uma matriz com um número(um escalar)
Também podemos elevar uma matriz por um número. E o processo se torna mais simples. Para fazer isso, basta elevar cada elemento da matriz pelo número. Ou seja, todos os elementos da matriz serão elevados ao mesmo numero. E o resultado precisa ser uma matriz com exatamente a mesma quantidade de linhas e a exatamente a mesma quantidade de colunas da matriz usada.

# Elevando uma matriz com um número no VectorizationJS
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var numero = 8;

var resultado = matrix.elevarNumero(numero);

console.log( resultado.raw() )

```

# Resultado deste exemplo
```json

[
   [  6561,   16777216,   1679616,      39062500000000 ]
   [     1,        256,       256,   10000000000000000 ]
   [ 65536,     390625,    390625,              390625 ]
   [     1,        256,       256,                 256 ]
]

```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)
