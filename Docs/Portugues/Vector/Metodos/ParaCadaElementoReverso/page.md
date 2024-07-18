# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

## Para cada elemento:
Nesta página você pode encontrar informações sobre o método **Para cada elemento reverso** do objeto **Vectorization.Vector**.

# Informações gerais
No **Vectorization.Vector**, o método **Para cada elemento reverso** serve para criar um laço de repetição, que permite executar um mesmo código(função) quantas vezes forem necessárias dentro do contexto do **Vectorization.Vector**, e de seus elementos. NOTA: Porém diferente do **Para cada elemento**, o **Para cada elemento reverso** faz isso de forma contrária, ou seja, ele vai percorrer os elementos começando pelo último elemento e indo até chegar no primeiro elemento, onde ele termina.

Ou seja, o laço criado pelo método **Para cada elemento reverso** vai percorrer cada elemento do **Vectorization.Vector** em questão, deis do último até o primeiro.

# Exemplo de uso deste comando
```javascript

let meu_vetor = Vectorization.Vector([20,1,-5,1,1,0,50,80,90,50,10,22,25,1,6,100]);

meu_vetor.paraCadaElementoReverso(function(indiceElemento, propioElemento, contextoVetor){
    console.log(`${propioElemento} - Este é o item de indice ${indiceElemento}`);
});

```

# Outro exemplo usando matemática
```javascript
let meu_vetor = Vectorization.Vector([20,1,-5,1,1,0,50,80,90,50,10,22,25,1,6,100]);
let vetor_vazio = Vectorization.Vector([]);

meu_vetor.paraCadaElementoReverso(function(indiceElemento, propioElemento, contextoVetor){
    //Adicionando os elementos deste vetor ao vetor_vazio, porém elevados ao quadrado
    vetor_vazio.adicionarElemento( propioElemento ** 2 );
});

console.log( vetor_vazio.valores() );
```

# Resultado deste ultimo exemplo
```json
 [10000, 36, 1, 625, 484, 100, 2500, 8100, 6400, 2500, 0, 1, 1, 25, 1, 400]
```

## Controles mais avançados
Também é possivel exercer mais controle sobre este método. Por exemplo, você pode informar ao seu laço de repetição do **Para cada elemento reverso** que você quer parar o loop. Ou então, que você quer pular para determinada iteração, ou até mesmo reiniciar o loop inteiro novamente. Tudo isso é possivel.

Por exemplo: Suponha que você por algum motivo queira interromper este loop quando o número for igual a 10

# Exemplo interrompendo o loop
```javascript
let meu_vetor = Vectorization.Vector([20,1,-5,1,1,0,50,80,90,50,10,22,25,1,6,100]);
let vetor_vazio = Vectorization.Vector([]);

meu_vetor.paraCadaElementoReverso(function(indiceElemento, propioElemento, contextoVetor){
    //Adicionando os elementos deste vetor ao vetor_vazio, porém elevados ao quadrado
    vetor_vazio.adicionarElemento( propioElemento ** 2 );

    if( propioElemento == 10 ){

        //IMPORTANTE
        return {
            acao: 'parar_loop'
        }

    }
    
});

console.log( vetor_vazio.valores() );
```

# Resultado deste ultimo exemplo
```json
 [10000, 36, 1, 625, 484, 100]
```

Note que o loop só fez 11 elementos ao quadrado. Mais parou quando um elemento foi igual a 10.

**Esse tipo de coisa é útil quando percebemos que continuar a iteração vai ser desnecessário, consumindo recursos computacionais desnecessários. Então podemos cortar isso.**

**NOTA: A funçao usada precisa estar preparada para receber os seguintes parêmtros:**
 - indiceElemento: o indice
 - propioElemento: o número
 - contextoVetor: o contexto do Vectorization.Vector

Existem um outro tipo de laço de repetição, além do **Para cada elemento reverso**.
E também, outros métodos que são semelhantes ao **Para cada elemento reverso**.

## Outros métodos similares
Você poderá encontrar uma lista desses métodos abaixo:

  - **[Veja paraCadaElemento](../ParaCadaElemento/page.md)**
  - **[Veja mapearValores](../MapearValores/page.md)**
  - **[Veja filtrarValores](../FiltrarValores/page.md)**

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Vector**
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Vector.js)

# Navegação
* [Voltar para página anterior](../page.md)