# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# conteudo
Atributo presente na classe **Vectorization.Vector**, que permite arredondar os valores definidos pelo usúario ou mesmo aleatórios gerados no vetor.

# Exemplo
```javascript

var vetor = Vectorization.Vector({
    numeros: [4.8888, 2.0, 9.16],
    arredondar: true 
});

console.log( vetor.raw() )

```

# Resultado do exemplo
```json
 [5, 2, 9]
```

# Outro exemplo 
```javascript

var vetor = Vectorization.Vector({
    aleatorio: true, 
    minimo: 0, 
    maximo: 5, 
    elementos: 5, 
    arredondar: true 
});

console.log( vetor.raw() )

```

# Resultado do exemplo
```json
 [3, 0, 5, 0, 4]
```

Voce pode visualizar o código fonte completo da classe Vector aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)