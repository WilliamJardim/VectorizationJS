# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# One Hot Colunas
Nesta página você pode encontrar informações sobre o método **oneHotColunas** do objeto **Vectorization.Matrix**. 

## Informações gerais
Esse método serve para aplicar uma codificação **One Hot Enconding** nas colunas que não são números ou que são categóricas, de um **Vectorization.Matrix**. E isso serve basicamente para fazer um pré processamento dos dados dessas colunas, convertendo cada valor possivel, de cada uma delas, em números binários, algo que possa ser interpretado pelo computador, que inicialmente não seria possível. 

## Exemplo de uso
```javascript

//Cria uma matriz
var matriz = Vectorization.Matrix([ 
                        ['peixe',  1], 
                        ['peixe',  2], 
                        ['peixe',  3], 
                        ['cavalo', 1], 
                        ['cavalo', 2], 
                        ['cavalo', 2], 
                        ['gato',   1], 
                        ['gato',   2], 
                        ['gato',   3]
                     ], 
                 {
                   flexibilidade: ['texto', 'numero']
                 });

//Aplica o One Hot Enconding
let matrizCodificada = matriz.oneHotColunas([0])
                             .obterMatrix()
                             .raw();
                             

//Imprime a matriz codificada
console.log( matrizCodificada );

``` 

# Resultado dessa divisão
```javascript
[
  [ 'peixe',   1,   1, 0, 0 ]
  [ 'peixe',   2,   1, 0, 0 ]
  [ 'peixe',   3,   1, 0, 0 ]
  [ 'cavalo',  1,   0, 1, 0 ]
  [ 'cavalo',  2,   0, 1, 0 ]
  [ 'cavalo',  2,   0, 1, 0 ]
  [ 'gato',    1,   0, 0, 1 ]
  [ 'gato',    2,   0, 0, 1 ]
  [ 'gato',    3,   0, 0, 1 ]
]

```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)
