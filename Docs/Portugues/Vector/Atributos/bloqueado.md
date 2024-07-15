# conteudo
Atributo presente na classe **Vectorization.Vector**, que permite "bloquear" todos os elementos presentes dentro da mesma, para impedir e barrar toda e qualquer possível manipulação dentro do objeto **Vectorization.Vector**, possuindo um comportamento semelhante a uma constante, por não ser possível haver manipulações, conforme descrito.

# Exemplo
```javascript

var vetor_qualquer = Vectorization.Vector({ 
    numeros: [4, 10, 8, 10],
    bloqueado: true
});

console.log( vetor_qualquer.raw() );

```

Voce pode visualizar o código fonte completo da classe Vector aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)