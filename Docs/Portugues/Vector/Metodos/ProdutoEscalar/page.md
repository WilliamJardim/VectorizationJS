# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Produto escalar:
Nesta página você pode encontrar informações sobre o método **Produto Escalar** do objeto **Vectorization.Vector**.

# Informações gerais
Em vetores do **Vectorization.Vector**, o produto escalar se trata de uma operação matemática que permite fazer a multiplicação de um vetor por outro vetor, ou então até mesmo de um vetor por uma matriz. Existem variações dos métodos. O processo para realizar o produto escalar de um vetor com outro vetor vai ser diferente do procedicemento para realizar o produto escalar de um vetor com uma matriz por exemplo. Vamos ver alguns tipos de produto escalar envolvendo vetores.

## Produto escalar de um vetor com outro vetor
Para fazer o produto escalar de um **Vetor** com outro **Vetor**, a regra é a seguinte: (1) nós multiplicamos elemento a elemento um vetor pelo outro vetor, ou seja, seguindo as suas respectivas posições correspondentes, e (2) depois disso, vamos somar o resultado essas multiplicações. Ou seja, obrigatóriamente o resultado vai ser um número(ou também chamdado de escalar). Mais especificamente, o VectorizationJS vai retornar um objeto do tipo **Vectorization.Scalar(Veja [Vectorization.Scalar](../../../Scalar/page.md))**, que basicamente representa um número. **NOTA: A quantidade de elementos do primeiro vetor precisa ser exatamente igual a quantidade de elementos do segundo vetor.**

# Exemplo de uso desse caso
```javascript

var vetor1 = Vectorization.Vector( [ 5, 10, 5,  6 ] );

var vetor2 = Vectorization.Vector( [ 2, 8, -5, -10 ] );

var resultado = vetor1.produtoEscalarVetor(vetor2);

console.log("\nVetor com Vetor", resultado.raw())
```

# Resultado do exemplo
```json
5
```

# Exemplo manual aplicando a fórmula matemática
Reforçando o conceito matemático descrito no parágrafo anterior, sobre produto escalar de um vetor com um vetor, para chegar no mesmo resultado, precisamos fazer o seguinte: **(5 * 2) + (10 * 8) + (5 * -5) + (6 * -10)**, e o resultado vai ser **5**.

## Produto escalar de um vetor com uma matriz
Para fazer o produto escalar de um **Vetor** com uma **Matriz**, o processo é muito semelhante ao Produto Escalar de uma **Matriz** com um **Vetor**, **Veja [Vectorization.Matrix/Produto Escalar](../../../Matrix/Metodos/ProdutoEscalar/page.md)**. Uma das principais diferenças é que mudou a ordem, então vamos multiplicar o vetor pelo matriz. Porém um detalhe importante é o seguinte: **Na hora de realizar o somatório, ao invez de acessar a matriz por linha e coluna(como fazemos no produto escalar entre matriz e vetor), fazemos o contrário e acessamos a  matrix por coluna e linha**. Essa diferença fica bem clara no código, e as semelhanças também. Nesse caso, o resultado precisa obrigatóriamente ser um vetor.

# Exemplo de uso desse caso
```javascript

var vetor = Vectorization.Vector( [ 5, 10, 5,  6 ] );

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var resultado = vetor.produtoEscalarMatrix(matrix);

console.log("\nVetor com Matriz", resultado.raw())
```

# Resultado do exemplo
```json
[ 51, 97, 87, 1287 ]
```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Vector**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)