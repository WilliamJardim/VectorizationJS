# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

## Filtrar Valores:
Nesta página você pode encontrar informações sobre o método **Filtrar Valores** do objeto **Vectorization.Vector**.

# Informações gerais
No **Vectorization.Vector**, o método **Filtrar Valores** serve para filtrar todos os números contidos dentro de um **Vectorization.Vector**, um por um. Aplicando a todos os números uma mesma condição/função de condição(a função você que vai definir).

O resultado vai ser um novo **Vectorization.Vector**, porém com apenas os valores que satisfazem exatamente a condição definida pela função(a função de condição você definiu) que você mandou rodar o **Filtrar Valores**. Nesse caso, a quantidade de elementos vai depender da quantidade de correspondencias para a condição definida.

# Exemplo de uso deste comando
```javascript

let meu_vetor = Vectorization.Vector([20,1,-5,1,1,0,50,80,90,50,10,22,25,1,6,100]);

let vetor_filtrado = meu_vetor.filtrarValores(
    function(indiceElemento, propioElemento, contextoVetor){
        if( propioElemento > 0 ){
           return 'manter';
        }
    }
);

console.log( vetor_filtrado.valores() );

```

**NOTA: Toda vez que você quiser manter um elemento você precisa retornar a string 'manter', e assim o método **Filtrar Valores** do Vectorization sabe que você quer manter aquele elemento na lista filtrada(o resultado).**

# Resultado deste exemplo
```json
 [20, 1, 1, 1, 50, 80, 90, 50, 10, 22, 25, 1, 6, 100]
```

Neste exemplo, deixamos apenas os números que são maiores do que zero. Porém, as possibilidades de uso são infinitas.

**NOTA: A funçao usada precisa estar preparada para receber os seguintes parêmtros:**
 - indiceElemento: o indice
 - propioElemento: o número
 - contextoVetor: o contexto do Vectorization.Vector

## Outros métodos similares
Você poderá encontrar uma lista desses métodos abaixo:

  - **[Veja paraCadaElemento](../ParaCadaElemento/page.md)** 
  - **[Veja paraCadaElementoReverso](../ParaCadaElementoReverso/page.md)**
  - **[Veja mapearValores](../MapearValores/page.md)**

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Vector**
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)