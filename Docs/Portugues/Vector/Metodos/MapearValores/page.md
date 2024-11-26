# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

## Mapear Valores:
Nesta página você pode encontrar informações sobre o método **Mapear Valores** do objeto **Vectorization.Vector**.

# Informações gerais
No **Vectorization.Vector**, o método **Mapear Valores** serve para modificar todos os números contidos dentro de um **Vectorization.Vector**, um por um. Aplicando a todos os números uma mesma fórmula/função(a função você que vai definir).

O resultado vai ser um novo **Vectorization.Vector**, com a mesma quantidade de elementos de antes, porém com os valores transformados/modificados pela função(a função você definiu) que você mandou rodar o **Mapear Valores**.

# Exemplo de uso deste comando
```javascript

let meu_vetor = Vectorization.Vector([20,1,-5,1,1,0,50,80,90,50,10,22,25,1,6,100]);

let vetor_mapeado = meu_vetor.mapearValores(
    function(indiceElemento, propioElemento, contextoVetor){
        return propioElemento / 100;
    }
);

console.log( vetor_mapeado.valores() );

```

# Resultado deste exemplo
```json
 [0.2, 0.01, -0.05, 0.01, 0.01, 0, 0.5, 0.8, 0.9, 0.5, 0.1, 0.22, 0.25, 0.01, 0.06, 1]
```

**NOTA: A funçao usada precisa estar preparada para receber os seguintes parêmtros:**
 - indiceElemento: o indice
 - propioElemento: o número
 - contextoVetor: o contexto do Vectorization.Vector

## Outros métodos similares
Você poderá encontrar uma lista desses métodos abaixo:

  - **[Veja paraCadaElemento](../ParaCadaElemento/page.md)** 
  - **[Veja paraCadaElementoReverso](../ParaCadaElementoReverso/page.md)**
  - **[Veja filtrarValores](../FiltrarValores/page.md)**

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Vector**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)