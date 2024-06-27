//Compatibilidade com NodeJS
if( typeof window === 'undefined' ){
    global.window = global; 

    require('./src/Root');
    require('./src/Matrix');
    require('./src/Matrix-translation');
    require('./src/Vector');
    require('./src/Vector-translation');
    require('./src/Scalar');
    
//Se for navegador
}else{
    globalThis.module = {};
}

if(!window.Vectorization){ window.Vectorization = {} };

//Vetor com vetor
var vec1 = Vectorization.Vector([5,10,5,6])
var vec2 = Vectorization.Vector([2,8,-5,-10])

var result = vec1.produtoEscalar( vec2 );

console.log("\nVetor vec1 com vetor vec2", result);




//Matrix com vetor
var matrix1 = Vectorization.Matrix([
    [3,8,6,50],
    [1,2,2,100],
    [4,5,5,5],
    [1,2,2,2]
]);

var vec3 = Vectorization.Vector([12, 5, 11, 8.5]);

var result = matrix1.produtoEscalar(vec3);

console.log("\nMatrix matrix1 com vec3", result.values())




//Matrix com matrix
var matrix1 = Vectorization.Matrix([
    [3,8,6,50],
    [1,2,2,100],
    [4,5,5,5],
    [1,2,2,2]
]);

var matrix2 = Vectorization.Matrix([
    [-5,2,3,2],
    [1,25,1,50],
    [2,5,3,5],
    [1,4,4,2]
]);

var result = matrix1.produtoEscalar(matrix2);

console.log("\nMatrix matrix1 com matrix matrix2", result.values())


var resultMultiplicar = matrix1.multiplicarMatrix(matrix2);
console.log("\nMULTIPLICAR ELEMENTO A ELEMENTO A Matrix matrix1 com matrix matrix2", resultMultiplicar.values())