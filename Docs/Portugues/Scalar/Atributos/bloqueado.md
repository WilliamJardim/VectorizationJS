# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# conteudo
Atributo presente na classe **Vectorization.Scalar**, que permite "bloquear" o mesmo, para impedir e barrar toda e qualquer possível manipulação dentro do objeto **Vectorization.Scalar**, possuindo um comportamento semelhante a uma constante, por não ser possível haver manipulações, conforme descrito.

# Exemplo
```javascript

var escalar_qualquer = Vectorization.Scalar(
    10,

    {
      bloqueado: true
    }
);

console.log( escalar_qualquer );

```

Voce pode visualizar o código fonte completo da classe Vectorization.Scalar aqui:
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Scalar.js)

# Navegação
* [Voltar para página anterior](../page.md)