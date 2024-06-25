/*
 * File Name: Vector.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Vector = function( config=[], classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Vector._translations || null;

    //Se o usuario tentar criar um vetor a partir de outro vetor, ele recria o propio vetor passado, mantendo a estrutura como ainda sendo um Vector
    if( Vectorization.Vector.isVector(config) && config.objectName == 'Vector' ){
        return Vectorization.Vector( config.values() );
    }

    let context = window.Vectorization.Base(classConfig);
    context.objectName = 'Vector';
    context.path = 'Vectorization.Vector';

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = context.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    //Aplica a tradução dos atributos também no config, EXCETO SE config FOR UM ARRAY
    if( config instanceof Object && !(config instanceof Array && (config instanceof Array || Vectorization.Vector.isVector(config) )) ){
        config = context.translateAttributes_andReturn(config, classConfig['translations']() );
    }

    context.initialColumnValue = config['fillValue'] || 0;
    context.content = [];

    context._update = function(){
        context.length = config.length;
    }

    //Se passar diretamente o conteudo
    if( config instanceof Array ){
        context.content = config;
        context.length = config.length;

    //Ou caso contrario
    }else{
        if( config instanceof Object && config['length'] ){
            context.length = config['length'];
        }

        //Inicializa o vetor
        for( let i = 0 ; i < context.length ; i++ )
        {
            context.content[i] = context.initialColumnValue;
        }
    }

    context.values = function(){
        return context.content;
    }

    context.toArray = function(){
        return context.content;
    }

    //Alias for context.toArray
    context.raw = context.toArray;

    //Alias for context.content
    context.conteudo = context.content;

    context.sizeOf = function(){
        return context.length;
    }

    context.tamanho = function(){
        return context.sizeOf();
    }

    context.push = function(element){
        context.content.push(element);
        context._update();
    }

    context.readIndex = function(i){
        return context.content[i];
    }

    context.sum = function(){
        let result = 0;
        for( let i = 0 ; i < context.length ; i++ )
        {   
            result = result + Number.parseFloat( context.readIndex( i ) );
        }

        return result;
    }

    context.soma = function(){
        return context.sum();
    }

    context.mean = function(){
        let sum = context.sum();
        return sum / context.length;
    }

    context.media = function(){
        return context.mean();
    }

    /**
    * Verifica se todos os elementos deste vetor são "true"
    * @returns {Boolean}
    */
    context.todosVerdadeiros = function(){
        let retorno = false;
        for( let i = 0 ; i < context.content.length ; i++ )
        {   
            if( context.content[i] == true ){
                retorno = true;
            }else{
                retorno = false;
                break;
            }
        }

        return retorno;
    }

    /**
    * Verifica se todos os elementos deste vetor são "false"
    * @returns {Boolean}
    */
    context.todosFalsos = function(){
        let retorno = false;
        for( let i = 0 ; i < context.content.length ; i++ )
        {   
            if( context.content[i] == false ){
                retorno = true;
            }else{
                retorno = false;
                break;
            }
        }

        return retorno;
    }

    /**
    * Verifica se todos os elementos deste vetor são iguais a um valor
    * @param {Number} valor - o valor
    * @returns {Boolean}
    */
    context.todosIguaisA = function(valor){
        let retorno = false;
        for( let i = 0 ; i < context.content.length ; i++ )
        {   
            if( context.content[i] == valor ){
                retorno = true;
            }else{
                retorno = false;
                break;
            }
        }

        return retorno;
    }

    /**
    * Verifica se este Vector é exatamente igual a outro Vector, no conteudo 
    */
    context.isExatamenteIgual = function(vectorB){
        let isIgual = false;

        if(!Vectorization.Vector.isVector(vectorB)){
            isIgual = false;
            return isIgual;
        }

        if( context.length != vectorB.length ){
            isIgual = false;
            return isIgual;
        }
        
        for( let i = 0 ; i < vectorB.length ; i++ )
        {
            if( vectorB.readIndex(i) == context.readIndex(i)){
                isIgual = true;
            }else{
                isIgual = false;
                break;
            }
        }

        return isIgual;
    }

    /**
    * Permite fatiar(ou recortar) este vetor
    * @param {linhaInicial} - inicio
    * @param {linhaFinal} - final
    * @param {intervalo} - intervalo
    * @returns {Vectorization.Vector} - o vetor recortado
    */
    context.slice = function(elementoInicial, elementoFinal, intervalo=1){
        let dadosRecortados = [];

        if( elementoInicial < 0 ){
            throw 'A elementoInicial precisa ser maior ou igual a zero!';
        }

        if( elementoFinal > context.length ){
            throw 'A elementoFinal precisa estar dentro da faixa de valores do Vector! valor muito alto!';
        }

        if( intervalo <= 0 ){
            throw 'O intervalo precisa ser maior que zero!';
        }

        for( let i = elementoInicial ; i < elementoFinal ; i = i + intervalo )
        {
            dadosRecortados.push( context.readIndex(i) );
        }

        return Vectorization.Vector(dadosRecortados);
    }

    /**
    * Percorre cada elemento do vetor, aplicando uma função de callback
    * @param {Function} callback(index, element, context)
    */
    context.forEach = function(callback){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            callback( i, context.content[i], context );
        }
    }

    /**
    * Percorre cada elemento do vetor, aplicando uma função de callback, retornando um resultado
    * @param {Function} callback(index, element, context)
    */
    context.map = function(callback){
        let novoVetor = [];

        for( let i = 0 ; i < context.content.length ; i++ )
        {
            novoVetor[i] = callback( i, context.content[i], context );
        }

        return novoVetor;
    }

    /**
     * Produto escalar entre dois vetores
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-vetor-com-vetor
     * 
     * @param {Vectorization.Vector} vectorA 
     * @param {Vectorization.Vector} vectorB
     * @returns {Vectorization.Scalar}
    */
    context.produtoEscalar = function(vectorB){
        let vectorA = context;

        if( vectorA.length != vectorB.length ){
            throw 'The number of elements in vector A must be exactly equal to the number of elements in vector B. Impossible to calculate!';
        }

        if( !vectorB instanceof Object ){
            throw 'vectorB must be a Object'
        }

        if( vectorB.objectName != 'Vector' ){
            throw 'vectorB must be a instance of ' + String( context.path );
        }

        //Inicializa a variavel que será usada para a soma ponderada da linha atual
        let produtoAtual = 0;
        //Percorre cada elemento do vetor B
        for( let colunaB = 0 ; colunaB < vectorB.length ; colunaB++ ){
            produtoAtual += ( vectorA.readIndex(colunaB) * vectorB.readIndex(colunaB) );
        }

        return Vectorization.Scalar(produtoAtual);
    }

    //Alias for produtoEscalar
    context.produtoEscalarVetor = context.produtoEscalar;

    /**
     * Produto escalar entre este vetor e uma matrix
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-vetor-com-matriz
     * @param {Vectorization.Vector} vectorA 
     * @param {Vectorization.Vector} vectorB
     * @returns {Vectorization.Vector}
    */
    context.produtoEscalarMatrix = function(matrixA){
        let vectorB = context.content;

        if( matrixA.rows != vectorB.length ){
            throw 'O número de linhas da matrixA deve ser exatamente igual ao numero de elementos do vetor. Impossivel calcular!';
        }
    
        let vetorResultado = [];
    
        //Percorre cada linha da matrix A
        for( let linha = 0 ; linha < matrixA.rows ; linha++ ){
    
            //Inicializa a variavel que será usada para a soma ponderada
            let produtoAtual = 0;
    
            //Percorre cada elemento do vetor B
            for( let colunaB = 0 ; colunaB < vectorB.length ; colunaB++ ){
                /*
                * Obtem os valores da linha atual da matrix A(nesse caso, a linha é na verdade a colunaB)
                * Pois, quando vamos calcular o produto escalar entre um vetor e uma matrix, acessamos os elementos de forma diferente: ao invez de acessar matrix[linha][coluna](como fazemos no produto escalar entre matrix e vetor), fazemos o contrário e acessamos matrix[coluna][linha], 
                * Ou seja, na matrix A, acessamos a coluna correspondente ao elemento atual do vetor B.
                * Ou seja, a nivel de código, na matrixA acessamos a colunaB que é o elemento atual do vetor, de modo que matrixA.content[colunaB] retornará um vetor(isto é, a variavel colunaB da matrixA), e ai em seguida nós acessamos a linha atual da matrixA, ou seja, literalmente matrixA.content[coluna][linha], e é assim que vamos fazer a soma ponderada.
                * É assim que vamos fazer a soma ponderada.
                */
                let valoresAtualMatrixNaPosicaoColunaB = matrixA.content[colunaB]; //Aqui a linha vai ser na verdade a coluna, no caso, a linha da colunaB, da matrix em questão
    
                produtoAtual += ( vectorB[colunaB] * valoresAtualMatrixNaPosicaoColunaB[linha] ); //E a coluna vai ser a linha
            }
    
            //Vai adicionando os resultados no vetor de resultado
            vetorResultado.push(produtoAtual);
        }
    
        return Vectorization.Vector(vetorResultado);
    }

    /**
     * Multiplica este vetor com outro vetor
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-vetores-elemento-a-elemento/codigo-principal.js
     * @param {Vectorization.Vector} vectorB_param
     * @returns {Vectorization.Vector}
    */
    context.multiplicarVetor = function(vectorB_param){
        if( vectorB_param.objectName != undefined && vectorB_param.objectName != 'Vector' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Vector. E não um ' + String(vectorB_param.objectName);
        }

        let vectorA = context.content;
        let vectorB = (vectorB_param.objectName && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let vetorResultado = [];

        if( vectorA.length != vectorB.length ){
            throw 'Os vetores precisam ser do mesmo tamanho!'
        }

        for( let i = 0 ; i < vectorA.length ; i++ )
        {   
            vetorResultado.push( vectorA[i] * vectorB[i] );
        }

        return Vectorization.Vector(vetorResultado);
    }

    /**
     * Multiplica este vetor por um número
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-vetores-por-um-numero-scalar/codigo-principal.js
     * @param {Number} numero
     * @returns {Vectorization.Vector}
    */
    context.multiplicarNumero = function(numero){
        let vetorResultado = [];
        let vectorA = context.content;

        for( let i = 0 ; i < vectorA.length ; i++ )
        {   
            vetorResultado.push( vectorA[i] * numero );
        }

        return Vectorization.Vector(vetorResultado);
    }

    /**
     * Multiplica este vetor com uma matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-por-um-vetor-linha-por-linha/codigo-principal.js
     * @param {Vectorization.Vector} vectorB
     * @returns {Vectorization.Matrix} 
     */
    context.multiplicarMatrix = function(matrixB){
        let matrixA = (matrixB.objectName != undefined && matrixB.objectName == 'Matrix') ? matrixB.content : matrixB;
        let vectorB = context.content;
        let matrixResultado = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                matrixResultado[i].push( vectorB[j] * matrixA[i][j] );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
     * Divide este vetor com uma matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-por-um-vetor-linha-por-linha/codigo-principal.js
     * @param {Vectorization.Vector} vectorB
     * @returns {Vectorization.Matrix} 
     */
    context.dividirMatrix = function(matrixB){
        let matrixA = (matrixB.objectName != undefined && matrixB.objectName == 'Matrix') ? matrixB.content : matrixB;
        let vectorB = context.content;
        let matrixResultado = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                matrixResultado[i].push( vectorB[j] / matrixA[i][j] );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
    * Faz a soma deste vetor com outro vetor
    * https://github.com/WilliamJardim/javascript-matematica/blob/main/soma-vetores/codigo-principal.js
    * @param {Vectorization.Vector} vectorB_param
    * @returns {Vectorization.Vector}
    */
    context.somarVetor = function(vectorB_param){
        if( vectorB_param.objectName != undefined && vectorB_param.objectName != 'Vector' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Vector. E não um ' + String(vectorB_param.objectName);
        }

        let vectorA = context.content; 
        let vectorB = (vectorB_param.objectName && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let novoVetor = [];
    
        if( vectorA.length != vectorB.length ){
            throw 'Os vetores precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = vectorA[i] + vectorB[i];
        }
    
        return Vectorization.Vector(novoVetor);
    }

    /**
     * Soma este vetor com um número
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/soma-vetores-por-um-numero-scalar/codigo-principal.js 
     * @param {Number} numero
     * @returns {Vectorization.Vector}
    */
    context.somarNumero = function(numero){
        let novoVetor = [];

        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = vectorA[i] + numero;
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
     * Soma este vetor com uma matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-por-um-vetor-linha-por-linha/codigo-principal.js
     * @param {Vectorization.Vector} vectorB
     * @returns {Vectorization.Matrix} 
     */
    context.somarMatrix = function(matrixB){
        let matrixA = (matrixB.objectName != undefined && matrixB.objectName == 'Matrix') ? matrixB.content : matrixB;
        let vectorB = context.content;
        let matrixResultado = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                matrixResultado[i].push( vectorB[j] + matrixA[i][j] );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
    * Faz a subtração deste vetor com outro vetor
    * https://github.com/WilliamJardim/javascript-matematica/blob/main/subtracao-vetores/codigo-principal.js
    * @param {Vectorization.Vector} vectorB_param
    * @returns {Vectorization.Vector}
    */
    context.subtrairVetor = function(vectorB_param){
        if( vectorB_param.objectName != undefined && vectorB_param.objectName != 'Vector' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Vector. E não um ' + String(vectorB_param.objectName);
        }

        let vectorA = context.content; 
        let vectorB = (vectorB_param.objectName && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let novoVetor = [];
    
        if( vectorA.length != vectorB.length ){
            throw 'Os vetores precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = vectorA[i] - vectorB[i];
        }
    
        return Vectorization.Vector(novoVetor);
    }

    /**
     * Subtrai este vetor com um número
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/subtracao-vetores-por-um-numero-scalar/codigo-principal.js
     * @param {Number} numero
     * @returns {Vectorization.Vector}
    */
    context.subtrairNumero = function(numero){
        let novoVetor = [];

        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = vectorA[i] - numero;
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
     * Subtrai este vetor com uma matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-por-um-vetor-linha-por-linha/codigo-principal.js
     * @param {Vectorization.Vector} vectorB
     * @returns {Vectorization.Matrix} 
     */
    context.subtrairMatrix = function(matrixB){
        let matrixA = (matrixB.objectName != undefined && matrixB.objectName == 'Matrix') ? matrixB.content : matrixB;
        let vectorB = context.content;
        let matrixResultado = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                matrixResultado[i].push( vectorB[j] - matrixA[i][j] );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
    * Faz a divisão deste vetor com outro vetor
    * https://github.com/WilliamJardim/javascript-matematica/blob/main/divisao-vetores/codigo-principal.js
    * @param {Vectorization.Vector} vectorB_param
    * @returns {Vectorization.Vector}
    */
    context.dividirVetor = function(vectorB_param){
        if( vectorB_param.objectName != undefined && vectorB_param.objectName != 'Vector' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Vector. E não um ' + String(vectorB_param.objectName);
        }

        let vectorA = context.content; 
        let vectorB = (vectorB_param.objectName && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let novoVetor = [];
    
        if( vectorA.length != vectorB.length ){
            throw 'Os vetores precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = vectorA[i] / vectorB[i];
        }
    
        return Vectorization.Vector(novoVetor);
    }

    /**
     * Divide este vetor com um número
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/divisao-vetores-por-um-numero-scalar/codigo-principal.js
     * @param {Number} numero
     * @returns {Vectorization.Vector}
    */
    context.dividirNumero = function(numero){
        let novoVetor = [];

        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = vectorA[i] / numero;
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
     * Eleva este vetor a um número
     * 
     * @param {Number} numero
     * @returns {Vectorization.Vector}
    */
    context.elevarNumero = function(numero){
        let novoVetor = [];

        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = Math.pow(vectorA[i], numero);
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
    * Eleva este vetor a outro vetor
    * 
    * @param {Vectorization.Vector} vectorB_param
    * @returns {Vectorization.Vector}
    */
    context.elevarVetor = function(vectorB_param){
        if( vectorB_param.objectName != undefined && vectorB_param.objectName != 'Vector' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Vector. E não um ' + String(vectorB_param.objectName);
        }

        let vectorA = context.content; 
        let vectorB = (vectorB_param.objectName && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let novoVetor = [];
    
        if( vectorA.length != vectorB.length ){
            throw 'Os vetores precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < vectorA.length ; i++ )
        {
            novoVetor[i] = Math.pow(vectorA[i], vectorB[i]);
        }
    
        return Vectorization.Vector(novoVetor);
    }

    /**
     * Eleva este vetor com uma matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-por-um-vetor-linha-por-linha/codigo-principal.js
     * @param {Vectorization.Vector} vectorB
     * @returns {Vectorization.Matrix} 
     */
    context.elevarMatrix = function(matrixB){
        let matrixA = (matrixB.objectName != undefined && matrixB.objectName == 'Matrix') ? matrixB.content : matrixB;
        let vectorB = context.content;
        let matrixResultado = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                matrixResultado[i].push( Math.pow(vectorB[j], matrixA[i][j]) );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
    * Obtem o vetor oposto
    * @returns {Vectorization.Vector}
    */
    context.vetorOposto = function(){
        let novoVetor = [];
        
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            novoVetor[i] = context.content[i] * -1;
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
    * Obtem o vetor absoluto
    * @returns {Vectorization.Vector}
    */
    context.abs = function(){
        let novoVetor = [];
        
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            novoVetor[i] = Math.abs(context.content[i]);
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
    * Obtem o vetor absoluto
    * @returns {Vectorization.Vector}
    */
    context.absoluto = function(){
        return context.abs();
    }

    /**
    * Obtem a raiz quadrada de cada elemento do vetor
    * @returns {Vectorization.Vector}
    */
    context.sqrt = function(){
        let novoVetor = [];
        
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            novoVetor[i] = Math.sqrt(context.content[i]);
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
    * Obtem o log2 de cada elemento do vetor
    * @returns {Vectorization.Vector}
    */
    context.log2 = function(){
        let novoVetor = [];
        
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            novoVetor[i] = Math.log2(context.content[i]);
        }

        return Vectorization.Vector(novoVetor);
    }

    context._doDefaultBaseAfterCreate();

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    //return context;
    //Cria um Proxy para permitir acessar os indices do vetor diretamente
    return new Proxy(context, {
        get: function(target, prop, receiver) {
          if (typeof prop === 'string' && !isNaN(prop)) {
            return target.content[Number(prop)];
          }
          return Reflect.get(target, prop, receiver);
        },

        set: function(target, prop, value) {
          if (typeof prop === 'string' && !isNaN(prop)) {
            target.content[Number(prop)] = value;
            return true;
          }
          return Reflect.set(target, prop, value);
        }
    });
}

/**
* Métodos estáticos
*/
window.Vectorization.Vector.isVector = function(obj){
    return ((obj.objectName != undefined && obj.objectName == 'Vector') || 
           Array.isArray(obj)) ? true : false;
}

window.Vectorization.Vector.isVectorizationVector = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Vector')
}