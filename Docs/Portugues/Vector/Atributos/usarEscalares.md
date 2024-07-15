# conteudo
Atributo presente na classe **Vectorization.Vector**, que permite "forçar" todos os elementos presentes dentro da mesma a serem objetos do tipo **Vectorization.Scalar**
**. [Veja Vectorization.Scalar](../../Scalar/page.md)**

# Exemplo
```javascript

var vetor_qualquer = Vectorization.Vector({ 
    numeros: [4, 10, 8, 10],
    usarEscalares: true
});

console.log( vetor_qualquer.raw() );

```

Voce pode visualizar o código fonte completo da classe Vector aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)