# conteudo
Atributo presente na classe **Vectorization.Matrix**, que permite "bloquear" todos os elementos presentes dentro da mesma, para impedir e barrar toda e qualquer possível manipulação dentro do objeto **Vectorization.Matrix**, possuindo um comportamento semelhante a uma constante, por não ser possível haver manipulações, conforme descrito.

# Exemplo
```javascript

var matrix = Vectorization.Matrix([
    [-5,   2,  3,  2 ],
    [ 1,  25,  1, 50 ],
    [ 2,  5,   3,  5 ],
    [ 1,  4,   4,  2 ]

], {
    //Paramêtro em questão
    bloqueado: true
});

console.log( matrix.raw() );

```

Voce pode visualizar o código fonte completo da classe Matrix aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)