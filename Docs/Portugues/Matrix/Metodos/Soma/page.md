# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Soma elemento a elemento
Nesta página você pode encontrar informações sobre o método **Soma elemento a elemento** do objeto **Vectorization.Matrix**. 

## Informações gerais
Na matemática, podemos somar uma matriz com outra matriz. Essa é a soma elemento a elemento, ou seja, cada item da primeira matriz vai ser somado com os seus respectivos correspondentes da segunda matriz. Ou seja, vamos casar com os índices. Basicamente o processo envolvido, ou seja, a lógica, o passo a passo para realizar uma soma de uma matriz com outra, é praticamente o mesmo da multiplicação de matrizes. O passo a passo que vamos seguir é o mesmo da **Multiplicação elemento a elemento**, com uma única diferença: ao invés de multiplicar cada elemento da primeira matriz com os correspondentes da segunda matrix, vamos somar. Ou seja, em outras palavras, se você seguir o passo a passo descrito em **Multiplicação elemento a elemento** **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)** e ao invés de aplicar a operação de multiplicação voce aplicar uma adição, você estará executando corretamente a soma de matrizes.

Nesse processo também possui variações, pois assim como na **Multiplicação elemento a elemento**, podemos somar uma matriz com outra matriz, ou então, somar uma matriz com um vetor, ou então até mesmo somar uma matriz com um número(escalar). Vamos ver esses três casos a seguir:

## Somando duas matrizes no VectorizationJS
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

var resultado = matrix1.somarMatrix(matrix2);

console.log("\nMatrix com outra Matrix", resultado.raw())

``` 

# Resultado dessa soma
```json

[
  [ -2,  10, 9, 52  ]
  [  2,  27, 3, 150 ]
  [  6,  10, 8, 10  ]
  [  2,  6,  6, 4   ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 + -5**, e o resultado é **-2**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 + 2**, e o resultado é **10**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Somando uma matriz com um vetor
Na **Soma elemento a elemento**, de uma **Matriz** com um **Vetor**, nós vamos basicamente somar cada elemento da matriz com o vetor, nas suas respectivas posições correspondentes. O passo a passo a ser seguido é exatamente o mesmo da **Multiplicação elemento a elemento** quando vamos multiplicar elemento a elemento uma matriz por um vetor **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)**. A única diferença é que aqui estamos somando.

# Somando uma matriz com um vetor no VectorizationJS
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var vetor = Vectorization.Vector( [ 12, 5, 11, 8.5 ] );

var resultado = matrix.somarVetor(vetor);

console.log("\nMatrix com vetor", resultado.raw())
```

# Resultado deste exemplo
```json

[
  [ 15,  13, 17, 58.5  ]
  [ 13,  7,  13, 108.5 ]
  [ 16,  10, 16, 13.5  ]
  [ 13,  7,  13, 10.5  ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 + 12**, e o resultado é **15**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 + 5**, e o resultado é **13**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Somando uma matriz com um número(um escalar)
Também podemos somar uma matriz por um número. E o processo se torna mais simples. Para fazer isso, basta somar cada elemento da matriz pelo número. Ou seja, todos os elementos da matriz serão somandos pelo mesmo numero. E o resultado precisa ser uma matriz com exatamente a mesma quantidade de linhas e a exatamente a mesma quantidade de colunas da matriz usada.

# Somando uma matriz com um número no VectorizationJS
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var numero = 8;

var resultado = matrix.somarNumero(numero);

console.log( resultado.raw() )

```

# Resultado deste exemplo
```json

[
  [ 11,  16,  14,  58  ]
  [  9,  10,  10,  108 ]
  [ 12,  13,  13,  13  ]
  [  9,  10,  10,  10  ]
]

```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)
