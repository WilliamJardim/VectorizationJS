# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo256x256.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# valorPreencher
Atributo presente na classe **Vectorization.Vector**, que permite definir um valor para ser preenchido na hora de criar o vetor. Este atributo só irá funcionar caso você esteja usando a inicialização usando um objeto com paramêtros.

# Exemplo 
```javascript

var vetor = Vectorization.Vector({ 
    valorPreencher: 5, 
    elementos: 10 
});

console.log( vetor.raw() );

```

# Resultado do exemplo
```json
 [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ]
```

Ou seja, neste exemplo acima, criamos um vetor que possui 10 elementos, e todos eles são o número 5.

Voce pode visualizar o código fonte completo da classe Vector aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

* [Voltar para página anterior](../page.md)