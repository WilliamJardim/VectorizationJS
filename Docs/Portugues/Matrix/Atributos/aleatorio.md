# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# conteudo
Atributo presente na classe **Vectorization.Matrix**, que permite dizer que a Matrix vai conter apenas números aleatórios em seu contéudo.

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

Também é possivel passar o parametro **arredondar**, que permite arredondar os números gerados para cima, ou para baixo, etc. **[Veja arredondar](arredondar.md)**

Para gerar o número aleatório, o Vectorization usa a classe interna **Vectorization.Random**.

Voce pode visualizar o código fonte completo da classe Matrix aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)