# Documentação oficial do Vectorization
![Logo do projeto](https://github.com/WilliamJardim/Vectorization/blob/main/imagens/logo256x256.png)

Seja bem vindo!. Está é a documentação da biblioteca Vectorization.
Aqui você poderá encontrar informações a respeito desta biblioteca, e dos métodos e atributos que a acompanham.

# Matriz transposta:
Nesta página você pode encontrar informações sobre o método **Transposta** para uso na classe **Vectorization.Matrix**.

Na matemática, transpor uma matriz significa basicamente inverter a ordem da estrutura da matriz: Voce vai basicamente colocar as linhas no lugar das colunas, e as colunas no lugar das linhas, ou seja, uma troca de lugar. **NOTA: Isso não pode afetar os valores da matriz, apenas a estrutura, a organização, que foi trocada. Porém os valores da matriz vão permanecer os mesmos, apenas vão ficar em uma ordem diferente das que estavam antes da transposição, seguindo essa explicação sobre transposição.**

# Transpondo uma matriz no Vectorization
```javascript

var matrix = Vectorization.Matrix([
    [ 3, 8, 6, 50  ],
    [ 1, 2, 2, 100 ],
    [ 4, 5, 5, 5   ],
    [ 1, 2, 2, 2   ]
]);

var transpondo_matrix = matrix.obterTransposta();

```

Você poderá ver o código fonte dessas operações dentro da classe **Vectorization.Matrix**
* [Código fonte](https://github.com/WilliamJardim/Vectorization/blob/main/src/Matrix.js)

* [Voltar para página anterior](../page.md)