# Documentação oficial do VectorizationJS
![Logo do projeto](https://github.com/WilliamJardim/VectorizationJS/blob/main/imagens/logo512x512.png)

Seja bem vindo!. Está é a documentação da biblioteca VectorizationJS
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Matriz transposta:
Nesta página você pode encontrar informações sobre o método **Transposta** para uso na classe **Vectorization.Matrix**.

Na matemática, transpor uma matriz significa basicamente inverter a ordem da estrutura da matriz: Voce vai basicamente colocar as linhas no lugar das colunas, e as colunas no lugar das linhas, ou seja, uma troca de lugar. **NOTA: Isso não pode afetar os valores da matriz, apenas a estrutura, a organização, que foi trocada. Porém os valores da matriz vão permanecer os mesmos, apenas vão ficar em uma ordem diferente das que estavam antes da transposição, seguindo essa explicação sobre transposição.**

# Transpondo uma matriz no VectorizationJS
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var transpondo_matrix = matrix.obterTransposta();

console.log( transpondo_matrix.raw() );

```

# Resultado deste exemplo
```json

[
  [ 3,  1,   4, 1 ]
  [ 8,  2,   5, 2 ]
  [ 6,  2,   5, 2 ]
  [ 50, 100, 5, 2 ]
]

```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/VectorizationJS/blob/main/src/Matrix.js)

# Navegação
* [Voltar para página anterior](../page.md)