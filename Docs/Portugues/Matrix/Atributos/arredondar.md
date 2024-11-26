# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# conteudo
Atributo presente na classe **VectorizationJS.Matrix**, que permite arredondar os valores definidos pelo usúario ou mesmo aleatórios gerados no vetor.

# Exemplo
```javascript

var matrix_definida = VectorizationJS.Matrix({ 
    numeros: [ 
                [3.436, 2.1, 3], 
                [4.444, 2.5] 
             ],

    arredondar: true 
});

console.log( matrix_definida.raw() );

```

# Resultado do exemplo
```json

[
  [3, 2, 3]
  [4, 3]
]

```

# Outro exemplo 
```javascript

var matrix_aleatoria = VectorizationJS.Matrix({ 
    aleatorio: true, 
    linhas: 5, 
    colunas: 2, 
    minimo: 0, 
    maximo: 10,
    arredondar: true 
});

console.log( matrix_aleatoria.raw() );

```

# Resultado do exemplo
```json

[
  [1, 7]
  [1, 1]
  [2, 6]
  [1, 5]
  [1, 10]
]

```

Voce pode visualizar o código fonte completo da classe Matrix aqui:
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)