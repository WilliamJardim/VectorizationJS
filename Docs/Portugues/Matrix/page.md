# Documentação oficial do Vectorization
Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Matrizes
# Dados da classe:
 - **URL Arquivo**: [https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js] 
 - Localizado em: **src/Matrix.js**
 - Namespace: **Vectorization**
 - Nome da classe: **Matrix**
 - Path: **Vectorization.Matrix**

# Descrição geral
Uma matriz é uma estrutura matemática que possui linhas e colunas. Essa estrutura permite organizar os elementos desta forma. Matrizes são semelhantes a uma tabela, que também possui linhas e colunas. Tantos as linhas quanto as colunas possuem indices, que podem ser usados para acessar seus elementos. Dentro de uma matriz podemos ter quantas linhas e colunas quisermos.

# Linhas
A matriz por si só ja é um vetor. E, as linhas também são vetores. Na verdade, cada linha é um vetor. Isso por que a matriz é na realidade um vetor de vetores, ou seja, em outras palavras, matrizes são vetores dentro de vetores. Numa matriz podemos ter quantas linhas quisermos.

# Colunas
Cada coluna é um número. Ou seja, as colunas são valores numéricos, que na matemática também são chamados de escalares. Cada linha possui colunas, e podemos ter quantas colunas quisermos.

# Exemplos de criação de matrizes no Vectorization
```javascript

//Matrix com vetor
var matrix1 = Vectorization.Matrix([
    [3,8,6,50],
    [1,2,2,100],
    [4,5,5,5],
    [1,2,2,2]
]);

```

# Outro exemplo de criação de matrizes no Vectorization

```javascript

var matrix2 = Vectorization.Matrix([
    [-5,2,3,2],
    [1,25,1,50],
    [2,5,3,5],
    [1,4,4,2]
]);

```

# O objeto **Vectorization.Matrix** possui varios métodos e atributos(propriedades). Você pode se aprofundar nelas clicando nos links abaixo:
- [Métodos](Metodos/page.md)
- [Atributos](Atributos/page.md)

# Voce pode visualizar o código fonte completo da classe Matrix aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

* [Voltar para página anterior](../Matrix/page.md)