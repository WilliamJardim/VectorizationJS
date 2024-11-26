# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

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
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)