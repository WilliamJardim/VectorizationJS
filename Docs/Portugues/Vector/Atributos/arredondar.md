# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# conteudo
Atributo presente na classe **Vectorization.Vector**, que permite arredondar os valores aleatórios gerados no vetor.

**NOTA: Este atributo não arredonda os números do vetor durante a criação. Ele só funciona quando voce escolhe criar um vetor aleatório.**Para mais informações **[Veja aleatorio](aleatorio.md)**

# Exemplo 
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