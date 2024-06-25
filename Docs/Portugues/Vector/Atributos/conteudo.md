# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo256x256.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# conteudo
Atributo presente na classe **Vectorization.Vector**, que permite acessar todo o contéudo do vetor. Todo o contéudo do vetor fica armazenado dentro 'context.conteudo' internamente dentro da classe. De modo que 'context.conteudo' é um Array padrão do JavaScript.

# Exemplo 
```javascript

var vetor = Vectorization.Vector( [ 12, 5, 11, 8.5 ] );

console.log( vetor.conteudo )

```

# Resultado do exemplo
```json
 [ 12, 5, 11, 8.5 ]
```