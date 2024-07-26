
    /*
    * How to import Vectorization in NodeJS
    * Como importar o Vectorization no NodeJS
    *
    * require('../src/Vectorization/ClassName.js');
    */

    const Vectorization = require('./Vectorization-builded-4node');

    //Matrix com vetor
    var matrix1 = Vectorization.Matrix([
        [3,8,6,50],
        [1,2,2,100],
        [4,5,5,5],
        [1,2,2,2]
    ]);

    var vector = Vectorization.Vector([12, 5, 11, 8.5]);

    var result = matrix1.produtoEscalarVetor(vector);

    console.log('Matrix com Vector', result.values());
