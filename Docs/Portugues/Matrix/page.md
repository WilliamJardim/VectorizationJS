# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Matrizes
Nesta página você pode encontrar informações sobre a classe Matrix

# Dados da classe:
 - **URL Arquivo**: [https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js] 
 - Localizado em: **src/Matrix.js**
 - Namespace: **Vectorization**
 - Nome da classe: **Matrix**
 - Path: **Vectorization.Matrix**

# Descrição geral
Uma matriz é uma estrutura matemática que possui linhas e colunas. Essa estrutura permite organizar os elementos desta forma. Matrizes são semelhantes a uma tabela, que também possui linhas e colunas. Tantos as linhas quanto as colunas possuem indices, que podem ser usados para acessar seus elementos. Dentro de uma matriz podemos ter quantas linhas e colunas quisermos.

# Linhas
A matriz por si só ja é um vetor. E, as linhas também são vetores, **Veja [Vectorization.Vector](../Vector/page.md)**. Na verdade, cada linha é um vetor. Isso por que a matriz é na realidade um vetor de vetores, ou seja, em outras palavras, matrizes são vetores dentro de vetores. Numa matriz podemos ter quantas linhas quisermos.

# Colunas
Cada coluna é um número. Ou seja, as colunas são valores numéricos, que na matemática também são chamados de escalares. **Veja [Vectorization.Scalar](../Scalar/page.md)**. Cada linha possui colunas, e podemos ter quantas colunas quisermos.

# Exemplos de criação de matrizes no Vectorization
```javascript

//Matrix com vetor
var matrix1 = Vectorization.Matrix([
    [ 3, 8, 6,  50 ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5,   5 ],
    [ 1, 2, 2,   2 ]
]);

```

# Outro exemplo de criação de matrizes no Vectorization

```javascript

var matrix2 = Vectorization.Matrix([
    [ -5, 2, 3, 2  ],
    [ 1, 25, 1, 50 ],
    [ 2, 5,  3, 5  ],
    [ 1, 4,  4, 2  ]
]);

```

Também é possivel criar matrizes atravez de um objeto json, com paramêtros a atributos especificos. 

# Criando matrizes usando objetos com paramêtros
```javascript

var matrix3 = Vectorization.Matrix({ 
    valorPreencher: 10, 
    linhas: 4, 
    colunas: 2 
});

```

# Criando uma **Vectorzation.Matrix** com números aleatórios:
Também é possivel criar um **Vectorzation.Matrix** que possui números aleatórios.

```javascript
var matrix_aleatoria = Vectorization.Matrix({ 
    aleatorio: true, 
    linhas: 5, 
    colunas: 2, 
    minimo: 0, 
    maximo: 10,
    arredondar: false 
});

console.log( matrix_aleatoria.raw() );

```

# Resultado deste exemplo
```json

[
  [ 6.313131313131311,      0.16957574000013775  ]
  [ 1.116577480298845,      0.007806790753657415 ]
  [ 3.472124638023443,      9.977419943538564    ]
  [ 0.033758713105568425,   4.314524075105381    ]
  [ 0.0018483338151345631,  2.3148148148148144   ]
]

```

Também é possivel passar o parametro **arredondar**, que permite arredondar os números gerados para cima, ou para baixo, etc.

Para gerar os números aleatórios, o Vectorization usa a classe interna **Vectorization.Random**.

# Métodos e atributos
O objeto **Vectorization.Matrix** possui varios métodos e atributos(propriedades). Você pode se aprofundar nelas clicando nos links abaixo:
- [Métodos](Metodos/page.md)
- [Atributos](Atributos/page.md)

Voce pode visualizar o código fonte completo da classe Matrix aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)