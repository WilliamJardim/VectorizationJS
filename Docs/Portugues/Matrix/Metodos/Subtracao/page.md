# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo256x256.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Subtração elemento a elemento
Nesta página você pode encontrar informações sobre o método **Subtração elemento a elemento** do objeto **Vectorization.Matrix**. 

## Informações gerais
Na matemática, podemos subtrair uma matriz com outra matriz. Essa é a subtração elemento a elemento, ou seja, cada item da primeira matriz vai ser subtraido com os seus respectivos correspondentes da segunda matriz. Ou seja, vamos casar com os índices. Basicamente o processo envolvido, ou seja, a lógica, o passo a passo para realizar uma subtração de uma matriz com outra, é praticamente o mesmo da multiplicação de matrizes. O passo a passo que vamos seguir é o mesmo da **Multiplicação elemento a elemento**, com uma única diferença: ao invés de multiplicar cada elemento da primeira matriz com os correspondentes da segunda matrix, vamos subtrair. Ou seja, em outras palavras, se você seguir o passo a passo descrito em **Multiplicação elemento a elemento** **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)** e ao invés de aplicar a operação de multiplicação voce aplicar uma subtração, você estará executando corretamente a subtração de matrizes.

Nesse processo também possui variações, pois assim como na **Multiplicação elemento a elemento**, podemos subtrair uma matriz com outra matriz, ou então, subtrair uma matriz com um vetor, ou então até mesmo subtrair uma matriz com um número(escalar). Vamos ver esses três casos a seguir:

## Subtraindo duas matrizes no Vectorization
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

var resultado = matrix1.subtrairMatrix(matrix2);

console.log("\nMatrix com outra Matrix", resultado.raw())

``` 

# Resultado dessa soma
```json

[
  [ 8,    6,  3,  48 ]
  [ 0,  -23,  1,  50 ]
  [ 2,    0,  2,  0  ]
  [ 0,   -2, -2,  0  ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 - -5**, e o resultado é **8**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 - 2**, e o resultado é **6**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Subtraindo uma matriz com um vetor
Na **Subtração elemento a elemento**, de uma **Matriz** com um **Vetor**, nós vamos basicamente subtrair cada elemento da matriz com o vetor, nas suas respectivas posições correspondentes. O passo a passo a ser seguido é exatamente o mesmo da **Multiplicação elemento a elemento** quando vamos multiplicar elemento a elemento uma matriz por um vetor **Veja [Multiplicação elemento a elemento](../Multiplicacao/page.md)**. A única diferença é que aqui estamos subtraindo.

# Subtraindo uma matriz com um vetor no Vectorization
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var vetor = Vectorization.Vector( [ 12, 5, 11, 8.5 ] );

var resultado = matrix.subtrairVetor(vetor);

console.log("\nMatrix com vetor", resultado.raw())
```

# Resultado deste exemplo
```json

[
  [ -9,   3, -5,  41.5 ]
  [ -11, -3, -9,  91.5 ]
  [ -8,   0, -6,  -3.5 ]
  [ -11, -3, -9,  -6.5 ]
]

```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 - 12**, e o resultado é **-9**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 - 5**, e o resultado é **3**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Subtraindo uma matriz com um número(um escalar)
Também podemos subtrair uma matriz por um número. E o processo se torna mais simples. Para fazer isso, basta subtrair cada elemento da matriz pelo número. Ou seja, todos os elementos da matriz serão subtraidos pelo mesmo numero. E o resultado precisa ser uma matriz com exatamente a mesma quantidade de linhas e a exatamente a mesma quantidade de colunas da matriz usada.

# Subtraindo uma matriz com um número no Vectorization
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var numero = 8;

var resultado = matrix.subtrairNumero(numero);

console.log( resultado.raw() )

```

# Resultado deste exemplo
```json

[
  [ -5,   0, -2,  42 ]
  [ -7,  -6, -6,  92 ]
  [ -4,  -3, -3,  -3 ]
  [ -7,  -6, -6,  -6 ]
]

```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

* [Voltar para página anterior](../page.md)
