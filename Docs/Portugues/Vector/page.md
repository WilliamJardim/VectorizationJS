# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Vetores
Nesta página você pode encontrar informações sobre a classe Vector

# Dados da classe:
 - **URL Arquivo**: [https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js] 
 - Localizado em: **src/Vector.js**
 - Namespace: **Vectorization**
 - Nome da classe: **Vector**
 - Path: **Vectorization.Vector**

# Descrição geral
Vetores são estruturas matemáticas que permitem organizar elementos, em forma de lista. A grosso modo vetores são apenas listas. Essas listas possuem inicio, meio, final, etc. Elas possuem elementos. São uma sequencia de elementos. Por exemplo pense na sua lista de compras, cada nome de um produto é um elemento. E o nome do primeiro produto seria o produto número 1. 

# Índices
Os vetores possuem identificadores para seus elementos, basicamente números, que na matemática são chamados de índices. Como no exemplo forncecido, o nome do primeiro produto na sua lista de compras seria o elemento de índice 1, ou seja o primeiro elemento.

# Elementos
Os elementos de um vetor podem ser qualquer coisa. Mais geralmente, como no caso de vetores na física e na matemática, os elementos são números, podendo ser inteiros ou decimais. Mais também podemos chamar cada elemento de escalar. **Veja [Vectorization.Scalar](../Scalar/page.md).**

# Criação de vetores no Vectorization
```javascript
var vetor = Vectorization.Vector( [ 12, 5, 11, 8.5 ] );

console.log(vetor);
```

Para criar um vetor no Vectorization, podemos simplismente chamar a classe **Vectorization.Vector**, passando como paramêtro a lista de números, podendo ser eles inteiros ou decimais, é você quem escolhe.

Além disso, também é possivel criar um vetor a partir de um objeto com paramêtros.

# Criação de um vetor com objeto de paramêtros
```javascript

var vetor = Vectorization.Vector({ 
    valorPreencher: 5, 
    elementos: 10 
});

console.log( vetor.raw() );

```

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

Também é possivel passar o parametro **arredondar**, que permite arredondar os números gerados para cima, ou para baixo, etc.

Para gerar o número aleatório, o Vectorization usa a classe interna **Vectorization.Random**.

# Métodos e atributos
O objeto **Vectorization.Vector** possui varios métodos e atributos(propriedades). Você pode se aprofundar neles clicando nos links abaixo:
- [Métodos](Metodos/page.md)
- [Atributos](Atributos/page.md)

Voce pode visualizar o código fonte completo da classe Vector aqui:
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)