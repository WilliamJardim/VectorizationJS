# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
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

# Resultado dessa codificação
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

Note que o método **oneHotColunas** adicionou 3 novas colunas na **Vectorization.Matrix**.
Pra ficar mais facil entender, você pode imaginar que essas 3 colunas representam "3 perguntas" que o algoritmo vai fazendo para os dados de cada linha. Perguntas assim: "Essa amostra, ela é um peixe?", depois "Essa amostra, ela é um cavalo?" e por fim, a terceira e última pergunta: "Essa amostra, ela é um gato?", todas são do tipo verdadeiro ou falso, e são representados em binário como 0 ou 1. A ideia das perguntas foi uma análogia, mais ajuda a visualizar o que está sendo feito por baixo dos panos. Não importa quantos valores possíveis existam na coluna. Ele sempre vai seguir essa mesma abordagem.

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)
