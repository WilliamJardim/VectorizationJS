# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo256x256.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

## Multiplicação elemento a elemento:
Nesta página você pode encontrar informações sobre o método **Multiplicação elemento a elemento** do objeto **Vectorization.Matrix**. 

## Informações gerais
Diferente do produto escalar, na multiplicação elemento a elemento, nós literalmente multiplicamos cada elemento, ou seja, cada número, um por um, em suas posições correspondentes. Existem variações dessa técnica matemática. Por exemplo, ao multiplicar elemento a elemento uma matriz pela outra temos um passo a passo a ser seguido. Porém, ao multiplicar uma matriz com um vetor, temos outro passo a passo diferente. Vamos ver alguns deles. Lembrando que o método **Multiplicação elemento a elemento** do objeto **Vectorization.Matrix** é diferente do método **Produto Escalar**, **Veja [Vectorization.Matrix/Produto Escalar](../ProdutoEscalar/page.md)**.

## Multiplicação de matriz com outra matriz
Na **Multiplicação elemento a elemento**, de uma **Matriz** com outra **Matriz**, nós vamos basicamente multiplicar cada elemento da primeira matriz com a segunda matriz, nas suas respectivas posições correspondentes, ou seja, para calcular o primeiro elemento da matriz de resultado, vamos multiplicar o primeiro elemento da primeira linha da primeira matriz **com** o primeiro elemento da primeira linha da segunda matriz, ou seja, aqui as posições seriam linha 1, na coluna 1. **NOTA: Neste tipo de multiplicação, a quantidade de linhas e a quantidade de colunas de ambas as matrizes precisam ser exatamente iguais.**. E o resultado deve obrigatóriamente ser uma matriz, com exatamente a mesma quantidade de linhas e colunas.

# Multiplicação de matriz com outra matriz no Vectorization
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

var resultado = matrix1.multiplicarMatrix(matrix2);

console.log("\nMatrix com outra Matrix", resultado.raw())
```

# Resultado deste exemplo
```json
[
  [ -15,  16, 18, 100  ]
  [   1,  50, 2,  5000 ]
  [   8,  25, 15, 25   ]
  [   1,  8,  8,  4    ]
]
```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 * -5**, e o resultado é **-15**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 * 2**, e o resultado é **16**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.


## Multiplicação de matriz com um vetor
Na **Multiplicação elemento a elemento**, de uma **Matriz** com um **Vetor**, nós vamos basicamente multiplicar cada elemento da matriz com o vetor, nas suas respectivas posições correspondentes, ou seja, para calcular o primeiro elemento do vetor de resultado, vamos multiplicar o primeiro elemento da matriz com o primeiro elemento do vetor. **NOTA: Neste tipo de multiplicação, a quantidade de colunas da matriz precisa ser exatamente igual a quantidade de elementos do vetor.**. E o resultado deve obrigatóriamente ser uma matrix, com exatamente a mesma quantidade de linhas e a mesma quantidade de colunas da matriz usada.

# Multiplicação de matriz com um vetor no Vectorization
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var vetor = Vectorization.Vector( [ 12, 5, 11, 8.5 ] );

var resultado = matrix.multiplicarVetor(vetor);

console.log("\nMatrix com vetor", resultado.raw())
```

# Resultado deste exemplo
```json
[
  [ 36,  40,  66,  425  ]
  [ 12,  10,  22,  850  ]
  [ 48,  25,  55,  42.5 ] 
  [ 12,  10,  22,  17   ]
]
```

# Exemplos manuais aplicando a fórmula matemática
Para reforçar o exemplo matemático, para obtermos o primeiro elemento da linha 1 da matriz de resultado, fazemos o seguinte: **3 * 12**, e o resultado é **36**.

Da mesma forma, para obtermos o segundo elemento da linha 1 da matriz de resultado, fazemos o seguinte: **8 * 5**, e o resultado é **40**.

É possível identificar esses elementos na matriz de resultado acima. Assim você consegue comprovar os cálculos.

## Multiplicação de matriz com um número(um escalar)
Também podemos multiplicar uma matriz por um número. E o processo se torna mais simples. Para fazer isso, basta multiplicar cada elemento da matriz pelo número. Ou seja, todos os elementos da matriz serão multiplicados pelo mesmo numero. E o resultado precisa ser uma matriz com exatamente a mesma quantidade de linhas e a exatamente a mesma quantidade de colunas da matriz usada.

# Multiplicação de matriz com um número no Vectorization
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var numero = 8;

var resultado = matrix.multiplicarNumero(numero);

console.log( resultado.raw() )

```

# Resultado deste exemplo
```json
[
  [ 24,  64,  48,  400 ]
  [  8,  16,  16,  800 ] 
  [ 32,  40,  40,  40  ] 
  [  8,  16,  16,  16  ]
]
```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

* [Voltar para página anterior](../page.md)

