# Documentação oficial do Vectorization
Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Produto escalar:
Nesta página você pode encontrar informações sobre o método **Produto Escalar** do objeto **Vectorization.Matrix**.

# Informações gerais
Produto escalar é o nome de uma operação matemática que serve basicamente para realizar a multiplicação de matrizes, e também de vetores. Existem variações dessa operação, que vão depender muito de quais são os termos envolvidos na operação. Por exemplo, o procedimento para realizar o produto escalar entre uma matriz e um vetor vai ser diferente do procedimento para realizar o produto escalar entre duas matrizes, e também, vai ser diferente caso seja um vetor com outro vetor. Ou seja, existem casos diferentes, que são realizados de maneira diferente.

## Produto escalar de uma matrix com outra matrix
Quando estamos querendo fazer o produto escalar de uma matriz com outra matriz, o procedimento que precisamos seguir é o seguinte: vamos multiplicar as linhas da primeria matriz com as colunas da segunda matriz, elemento a elemento. Regra: percorre na vertical a matrixB, para cada coluna. Exemplo teórico: Coluna 1 da matrixB com Linha 1 da matrixA, depois Coluna 2 da matrixB com linha 1 da matrixA, e assim continua. **NOTA: Neste caso, a quantidade colunas da primeira matriz precisa ser exatamente igual ao número de linhas da segunda matriz**, caso contrário, não será possível realizar esta operação, **neste caso onde temos uma matriz com outra matriz.**

# Exemplo de uso desse caso
```javascript

//Matrix com matrix
var matrix1 = Vectorization.Matrix([
    [3, 8, 6, 50 ],
    [1, 2, 2, 100],
    [4, 5, 5, 5  ],
    [1, 2, 2, 2  ]
]);

var matrix2 = Vectorization.Matrix([
    [-5, 2, 3, 2 ],
    [1, 25, 1, 50],
    [2, 5, 3,  5 ],
    [1, 4, 4,  2 ]
]);

var resultado = matrix1.produtoEscalar(matrix2);

console.log("\nMatrix matrix1 com Matrix matrix2", resultado.raw())
```

# Resultado do exemplo
```json
[ 
  [55,  436,  235,  536 ]
  [101, 462,  411,  312 ]
  [0,   178,  52,   293 ]
  [3,   70,   19,   116 ] 
]
```

## Produto escalar de uma matrix com um vetor
Quando estamos querendo fazer o produto escalar de uma matriz com um vetor, as coisas são um pouco diferentes, se tornam até mesmo mais simples. Nesse cenário, vamos precisar multiplicar cada linha da matriz com o mesmo vetor, isso mesmo, neste caso será um único vetor. Porém, **note que a quantidade de elementos do vetor precisa ser exatamente igual a quantidade de colunas da matriz**, caso contrário, não será possível realizar esta operação, **neste caso em específico onde temos uma matriz com um vetor.**

# Exemplo de uso desse caso
```javascript
//Matrix com vetor
var matrix = Vectorization.Matrix([
    [3,8,6,50],
    [1,2,2,100],
    [4,5,5,5],
    [1,2,2,2]
]);

var vector = Vectorization.Vector([12, 5, 11, 8.5]);

var resultado = matrix.produtoEscalar(vector);

console.log("\nMatrix com vetor", resultado.raw())
```

# Resultado do exemplo
```json
[567, 894, 170.5, 61]
```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

## Outros casos possíveis de produto escalar 
Além disso, o contrário também é possivel. Ou seja, também podemos realizar o produto escalar de um vetor com outro vetor, e também de um vetor com uma matriz. As condições e requisitos são semelhantes, porém o método a ser seguido vai mudar um pouco também, e os resultados serão diferentes, pois a ordem importa. Ou seja, o resultado de fazer o produto escalar de uma matriz com um vetor vai ser matematicamente diferente de fazer o produto escalar de um vetor com uma matriz. Porém este tópico sobre produto escalar vai cobrir apenas os produtos escalares que podem ser realizados no contexto da matriz. Se você desejar aprender sobre produto escalar para vetores e seus casos, essa informação estará presente no tópico sobre produto escalar dos vetores, em outra página desta mesma documentação.

