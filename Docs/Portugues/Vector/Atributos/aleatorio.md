# conteudo
Atributo presente na classe **Vectorization.Vector**, que permite dizer que um vetor vai conter apenas números aleatórios em seu contéudo.

# Criando vetores contendo números aleatórios
Também é possivel criar um **Vectorization.Vector** contendo números aleatórios.
Veja um exemplo disso abaixo:

```javascript

var vetor_aleatorio = Vectorization.Vector({ 
    aleatorio: true, 
    minimo: 0, 
    maximo: 5, 
    elementos: 5
});

console.log( vetor_aleatorio.raw() );

```

Também é possivel passar o parametro **arredondar**, que permite arredondar os números gerados para cima, ou para baixo, etc. **[Veja arredondar](arredondar.md)**

Para gerar o número aleatório, o Vectorization usa a classe interna **Vectorization.Random**.

Voce pode visualizar o código fonte completo da classe Vector aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)