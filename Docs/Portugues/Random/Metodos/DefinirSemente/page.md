# VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Método Vectorization.Random.definirSemente:
Nesta página você pode encontrar informações sobre o método **Vectorization.Random.definirSemente** da classe **Vectorization.Random**.

O método **Vectorization.Random.definirSemente** é usado para definir um ponto de partida para o algoritmo de geração de números aleatórios usados pela classe **Vectorization.Random**. Isso é extremamente útil para garantir que toda vez que executarmos métodos como o **Vectorization.Random.gerarNumeroAleatorio**, sempre vamos obter exatamente e estritamente a mesma sequência de números aleatórios, pois o ponto de partida foi o mesmo, em todas as vezes que executamos o método.

# O algoritmo das sementes no VectorizationJS
A classe **Vectorization.Random** possúi um "escolhedor" de pontos de partida, que são basicamente conjunto de paramêtros e configurações que vão determinar o comportamento, e inclinação dos valores a serem gerados. Eles mantém um histórico do valor anterior, e alguns pontos fixos(um vetor com 19 números) de base, que são usados para dar inicio e posterior continuidade no processo de geraçao de novos valores aleatórios, por meio de somas, multiplicações, e outros tipos de cálculos e verificações lógicas.

# Mais detalhes
**Veja [Vectorization.Random.gerarNumeroAleatorio](GerarNumeroAleatorio/page.md)**

Voce pode visualizar o código fonte completo da classe Random aqui:
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Random.js)

O algoritmo para interpretar as sementes está dentro desse arquivo também.

# Navegação
* [Voltar para página anterior](../page.md)