# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# conteudo
Atributo presente na classe **Vectorization.Matrix**, que permite arredondar os valores aleatórios gerados no vetor.

**NOTA: Este atributo não arredonda os números da Matrix durante a criação. Ele só funciona quando voce escolhe criar uma Matrix aleatória.**Para mais informações **[Veja aleatorio](aleatorio.md)**

# Exemplo 
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
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)