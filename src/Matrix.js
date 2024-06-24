/*
 * File Name: Matrix.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Matrix = function( config, classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Matrix._translations || null;

    //Se o usuario tentar criar uma matrix a partir de outra matrix, ele recria a propio matrix passada, mantendo a estrutura como ainda sendo uma Matrix
    if( Vectorization.Matrix.isMatrix(config) && config.objectName == 'Matrix' ){
        return Vectorization.Matrix( config.raw() );
    }

    let context = window.Vectorization.Base(classConfig);
    context.objectName = 'Matrix';
    context.path = 'Vectorization.Matrix';

    context.rows = config['rows'];
    context.columns = config['columns'];
    context.initialColumnValue = config['fillValue'] || 0;
    context.content = [];

    //Alguns atributos uteis
    context.isTransposta = classConfig['isTransposta'] || false;
    context.isOposta = classConfig['isOposta'] || false;
    context.isIdentidade = classConfig['isIdentidade'] || false;
    context.isAdvancedMatrix = classConfig['advanced'] || true;

    //Se passar diretamente o conteudo
    if( config instanceof Array && (config[0] instanceof Array || Vectorization.Vector.isVector(config[0]) ) ){

        //Se as linhas forem vetores do pacote Vectorization
        if( Vectorization.Vector.isVectorizationVector( config[0] ) == true ){
            context.content = config;
            context.rows = config.length;
            context.columns = config[0].length;

        //Se as linhas forem vetores normais
        }else{
            context.content = config;
            context.rows = config.length;
            context.columns = config[0].length;
        }

    //Ou caso contrario
    }else{
        //Inicializa a matrix
        for( let i = 0 ; i < context.rows ; i++ )
        {
            context.content[i] = [];
            for( let j = 0 ; j < context.columns ; j++ )
            {
                context.content[i][j] = context.initialColumnValue;
            }
        }
    }

    /**
    * Método que converte a matrix para uma matrix avançada, onde cada linha é um Vector 
    */
    context._matrix2Advanced = function(vectorClassConfig={}){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            const extraPropsOfLine = {... vectorClassConfig};
            extraPropsOfLine['index'] = i;

            context.content[i] = Vectorization.Vector(context.content[i], extraPropsOfLine);
        }
        context.isAdvancedMatrix = true;
    }

    /**
    * Calcula a forma (shape) da matrix
    * @returns {Array} - A forma da matrix.
    */
    context.calcTamanhos = function() {
        let dadosMatrix = context.content || [];
        let formato = [];
        let nivelAtual = [... dadosMatrix.copyWithin()];

        while ( Vectorization.Vector.isVector(nivelAtual) ) 
        {
            formato.push(nivelAtual.length);
            nivelAtual = nivelAtual[0];
            if(nivelAtual == undefined){
                break;
            }
        }

        return Vectorization.Vector(formato);
    }

    //Alias for calcTamanhos
    context.calcSizes = context.calcTamanhos;
    context.calcShape = context.calcTamanhos;
    context.calcFormato = context.calcTamanhos;
    context.getFormato = context.calcTamanhos;

    /*
    Calcula o formato da matrix e armazena no objeto sizes
    Por padrão o formato vai ser [qtdeLinhas, qtdeColunas]
    */
    context.sizes = context.calcTamanhos();
    context.formato = context.sizes;

    context.tamanho = function(){
        return context.sizes;
    }

    /**
    * Verifica se esta matrix possui exatamente o mesmo formato de outra matrix
    * @param {Vectorization.Matrix} matrixB - A outra matrix.
    * @returns {Boolean} - Verdadeiro se as formas forem iguais, falso caso contrário.
    */
    context.isExatoMesmoTamanho = function(matrixB){
        if( context.calcTamanhos().isExatamenteIgual( matrixB.calcTamanhos() ) ){
            return true;
        }

        return false;
    }

    //Alias for isExatoMesmoTamanho
    context.isExatamenteMesmoTamanho = context.isExatoMesmoTamanho;
    context.isExatamenteMesmoFormato = context.isExatoMesmoTamanho;
    context.isMesmoTamanhoDe = context.isExatoMesmoTamanho;
    context.isMesmoFormatoDe = context.isExatoMesmoTamanho;
    context.isSameSizes = context.isExatoMesmoTamanho;

    /**
    * Compara se o contéudo desta matrix é exatamente igual ao contéudo da outra matrix  
    * Ele faz isso comparando linha por linha.
    * @param {Vectorization.Matrix} matrixB - A outra matrix
    * @returns {Boolean} - Se o contéudo é exatamente igual ou não
    */
    context.isExatamenteMesmoConteudo = function(matrixB){
        //Verifica se cada linha da matrixB é exatamente igual a linha correspondende da matrix atual
        const mappedVector = Vectorization.Vector( context.map(function(i, valor, selfContext){
            const linhaAtual = i;
            return matrixB.getLinha(linhaAtual).isExatamenteIgual( context.getLinha(linhaAtual) );
        }) );

        //Verifica os resultados de mappedMatrix, se todos são verdadeiros
        return mappedVector.todosVerdadeiros();
    }

    /**
    * Compara se esta matrix é exatamente igual a outra matrix, tanto em formato quanto em contéudo
    * @param {Vectorization.Matrix} matrixB - A outra matrix
    * @returns {Boolean} - Se são iguais ou não
    */
    context.isIgual = function(matrixB){
        return (context.isExatamenteMesmoTamanho(matrixB) == true && 
                context.isExatamenteMesmoConteudo(matrixB) == true);
    }

    //Alias for isIgual
    context.isEquals = context.isIgual;

    context.valueOf = function(){
        return context.content;
    }

    context.toString = function(){
        return String(context.content);
    }

    context.get = function(linha, coluna){
        return context.content[linha][coluna];
    }

    context.getLinha = function(linha){
        return context.content[linha];
    }

    //Alias for getLinha
    context.getLine = context.getLinha;

    context.values = function(){
        return context.content;
    }

    context.rawValues = function(){
        let rawValues = [];

        for( let i = 0 ; i < context.rows ; i++ )
        {
            rawValues[i] = context.content[i].values();
        }

        return rawValues;
    }

    context.raw = function(){
        return context.rawValues();
    }

    context.mostrarTabela = function(){
        console.table( context.rawValues() );
    }

    context.mostrar = function(){
        console.log( context.rawValues() );
    }

    context.push = function(element){
        if( context.isAdvancedMatrix ){
            context.content.push( element.objectName != undefined && element.objectName == 'Vector' ? element : Vectorization.Vector(element) );

        }else{
            context.content.push(element);
        }
    }

    /**
    * Permite fatiar(ou recortar) a matrix
    * @param {linhaInicial} - inicio
    * @param {linhaFinal} - final
    * @param {intervalo} - intervalo
    * @returns {Vectorization.Matrix} - a matriz recortada
    */
    context.slice = function(linhaInicial, linhaFinal, intervalo=1){
        let dadosRecortados = [];

        for( let i = linhaInicial ; i < linhaFinal+1 ; i = i + intervalo )
        {
            dadosRecortados.push( context.getLinha(i).raw() );
        }

        return Vectorization.Matrix(dadosRecortados);
    }

    /**
    * Percorre cada linha da matrix, aplicando uma função de callback
    * @param {Function} callback(index, element, context)
    */
    context.forEach = function(callback){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            callback( i, context.content[i], context );
        }
    }

    /**
    * Percorre cada linha da matrix, aplicando uma função de callback, retornando um resultado
    * @param {Function} callback(index, element, context)
    * @returns {Vectorization.Vector or Vectorization.Matrix}
    */
    context.map = function(callback){
        let novaMatrix = [];

        for( let i = 0 ; i < context.content.length ; i++ )
        {
            novaMatrix[i] = callback( i, context.content[i], context );
        }

        //Se a função de callback ao ser aplicada resultar numa matrix, então ele converte resultado para Matrix
        if( Vectorization.Vector.isVector( novaMatrix[0] ) ){
            return Vectorization.Matrix(novaMatrix);
        }else{
            return Vectorization.Vector(novaMatrix);
        }
    }

    /**
     * Produto escalar de uma matriz com um vetor ou outra matriz
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-matriz-com-vetor
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-matrizes
     * 
     * @param {Vectorization.Matrix} matrixA
     * @param {Object} matrixB
     * @returns {Object}
    */
    context.produtoEscalar = function( matrixB ){
        let matrixA = context;
        /**
        * Regra: percorre na vertical a matrixB, para cada coluna:
        * Coluna1 matrixB com linha1 matrixA, depois Coluna2 da matrixB com linha1 da matrixA.
        */

        if( !matrixB.objectName || (matrixB.objectName != 'Matrix' && matrixB.objectName != 'Vector') ){
            throw 'matrixB must be a Vectorization.Matrix';
        }

        if( matrixA.rows != (matrixB.columns || matrixB.length) ){
            throw 'The number of rows in matrixA must be exactly equal to the number of columns in matrixB. Impossible to calculate!';
        }

        //Se o segundo parametro for uma matrix
        if( matrixB.objectName == 'Matrix' ){
            let resultMatrix = [];
            let ordemColunasB = [];

            //Esse trecho é semelhante a uma transposição de matriz, pra tornar possivel os calculos
            for( let coluna = 0 ; coluna < matrixB.columns ; coluna++ ){

                //Extrair os valores da coluna atual da matrixB
                let valoresColunaBAtual = [];
                for( let linha = 0 ; linha < matrixB.rows ; linha++ ){
                    valoresColunaBAtual.push( matrixB.content[linha][coluna] );
                }

                //Salva isso numa lista, em ordem certa para os calculos abaixo no proximo bloco a seguir:
                ordemColunasB.push( valoresColunaBAtual );

            }   

            //Proxima etapa: percorre cada linha da matrix A
            for( let linha = 0 ; linha < matrixA.rows ; linha++ ){

                //Obtem os valores da linha atual da matrix A
                let valoresLinhaAtual = matrixA.content[linha];

                //Cria um array vazio para a linha. Esse array vai ser usado para armazenar os produtos feitos com os valores da linha abaixo:
                resultMatrix[linha] = [];
                
                //Percorre cada "fileira"(ou melhor dizendo, cada fileira é um vetor contendo cada valor da colunaB atual, ou seja, em sentido vertical) da matrix B
                for( let colunaB = 0 ; colunaB < ordemColunasB.length ; colunaB++ ){

                    //Obtem a fileira atual da matrix B(o vetor atual)
                    let valoresColunaBAtual = ordemColunasB[colunaB];

                    //Inicializa a variavel que será usada para a soma ponderada
                    let produtoAtual = 0;
                    //Percorre cada indice dos valores da fileira atual da matrix B
                    for( let indexValor = 0 ; indexValor < valoresColunaBAtual.length ; indexValor++ ){
                        produtoAtual += ( valoresLinhaAtual[indexValor] * valoresColunaBAtual[indexValor] );
                    }

                    //Atribui o produto dentro da linha atual da matriz resultante, isso é feito em ordem sequencial
                    resultMatrix[linha].push( produtoAtual );

                    //... vai pro próximo produto [...], permanecendo na linha atual da matrixA

                }
            }

            return Vectorization.Matrix(resultMatrix);

        //Se o segundo objeto for um Vector
        }else if( matrixB.objectName == 'Vector' ){
            if( matrixA.rows != matrixB.length ){
                throw 'The number of lines in matrixA must be exactly equal to the number of elements in the vector. Impossible to calculate!';
            }
        
            let vetorResultado = [];
        
            //Percorre cada linha da matrix A
            for( let linha = 0 ; linha < matrixA.rows ; linha++ ){
        
                //Obtem os valores da linha atual da matrix A
                let valoresLinhaAtual = matrixA.content[linha];
        
                //Inicializa a variavel que será usada para a soma ponderada da linha atual
                let produtoAtual = 0;
        
                //Percorre cada elemento do vetor B
                for( let colunaB = 0 ; colunaB < matrixB.length ; colunaB++ ){
                    produtoAtual += ( valoresLinhaAtual[colunaB] * matrixB.readIndex(colunaB) );
                }
        
                //Vai adicionando os resultados no vetor de resultado
                vetorResultado.push(produtoAtual);
            }
        
            return Vectorization.Vector(vetorResultado);
        }
    }

    /**
     * Produto escalar de uma matriz com outra matriz
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-matriz-com-vetor
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-matrizes
     * 
     * @param {Vectorization.Matrix} matrixA
     * @param {Vectorization.Matrix} matrixB
     * @returns {Vectorization.Matrix}
    */
    context.produtoEscalarMatrix = function( matrixB ){
        let matrixA = context;
        /**
        * Regra: percorre na vertical a matrixB, para cada coluna:
        * Coluna1 matrixB com linha1 matrixA, depois Coluna2 da matrixB com linha1 da matrixA.
        */

        if( !matrixB.objectName || (matrixB.objectName != 'Matrix' && matrixB.objectName != 'Vector') ){
            throw 'matrixB must be a Vectorization.Matrix';
        }

        if( matrixA.rows != (matrixB.columns || matrixB.length) ){
            throw 'The number of rows in matrixA must be exactly equal to the number of columns in matrixB. Impossible to calculate!';
        }

        //Se o segundo parametro for uma matrix
        if( matrixB.objectName == 'Matrix' ){
            let resultMatrix = [];
            let ordemColunasB = [];

            //Esse trecho é semelhante a uma transposição de matriz, pra tornar possivel os calculos
            for( let coluna = 0 ; coluna < matrixB.columns ; coluna++ ){

                //Extrair os valores da coluna atual da matrixB
                let valoresColunaBAtual = [];
                for( let linha = 0 ; linha < matrixB.rows ; linha++ ){
                    valoresColunaBAtual.push( matrixB.content[linha][coluna] );
                }

                //Salva isso numa lista, em ordem certa para os calculos abaixo no proximo bloco a seguir:
                ordemColunasB.push( valoresColunaBAtual );

            }   

            //Proxima etapa: percorre cada linha da matrix A
            for( let linha = 0 ; linha < matrixA.rows ; linha++ ){

                //Obtem os valores da linha atual da matrix A
                let valoresLinhaAtual = matrixA.content[linha];

                //Cria um array vazio para a linha. Esse array vai ser usado para armazenar os produtos feitos com os valores da linha abaixo:
                resultMatrix[linha] = [];
                
                //Percorre cada "fileira"(ou melhor dizendo, cada fileira é um vetor contendo cada valor da colunaB atual, ou seja, em sentido vertical) da matrix B
                for( let colunaB = 0 ; colunaB < ordemColunasB.length ; colunaB++ ){

                    //Obtem a fileira atual da matrix B(o vetor atual)
                    let valoresColunaBAtual = ordemColunasB[colunaB];

                    //Inicializa a variavel que será usada para a soma ponderada
                    let produtoAtual = 0;
                    //Percorre cada indice dos valores da fileira atual da matrix B
                    for( let indexValor = 0 ; indexValor < valoresColunaBAtual.length ; indexValor++ ){
                        produtoAtual += ( valoresLinhaAtual[indexValor] * valoresColunaBAtual[indexValor] );
                    }

                    //Atribui o produto dentro da linha atual da matriz resultante, isso é feito em ordem sequencial
                    resultMatrix[linha].push( produtoAtual );

                    //... vai pro próximo produto [...], permanecendo na linha atual da matrixA

                }
            }

            return Vectorization.Matrix(resultMatrix);

        //Se o segundo objeto for um Vector
        }else if( matrixB.objectName == 'Vector' ){
            throw 'O segundo parametro precisa ser uma Matrix!';
        }
    }

    /**
     * Produto escalar de uma matriz com um vetor
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-matriz-com-vetor
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/produto-escalar-matrizes
     * 
     * @param {Vectorization.Matrix} matrixA
     * @param {Vectorization.Vector} matrixB
     * @returns {Vectorization.Vector}
    */
    context.produtoEscalarVetor = function( matrixB ){
        let matrixA = context;
        /**
        * Regra: percorre na vertical a matrixB, para cada coluna:
        * Coluna1 matrixB com linha1 matrixA, depois Coluna2 da matrixB com linha1 da matrixA.
        */

        if( !matrixB.objectName || (matrixB.objectName != 'Matrix' && matrixB.objectName != 'Vector') ){
            throw 'matrixB must be a Vectorization.Matrix';
        }

        if( matrixA.rows != (matrixB.columns || matrixB.length) ){
            throw 'The number of rows in matrixA must be exactly equal to the number of columns in matrixB. Impossible to calculate!';
        }

        //Se o segundo parametro for uma matrix
        if( matrixB.objectName == 'Matrix' ){
            throw 'O segundo parametro precisa ser um Vector!';

        //Se o segundo objeto for um Vector
        }else if( matrixB.objectName == 'Vector' ){
            if( matrixA.rows != matrixB.length ){
                throw 'The number of lines in matrixA must be exactly equal to the number of elements in the vector. Impossible to calculate!';
            }
        
            let vetorResultado = [];
        
            //Percorre cada linha da matrix A
            for( let linha = 0 ; linha < matrixA.rows ; linha++ ){
        
                //Obtem os valores da linha atual da matrix A
                let valoresLinhaAtual = matrixA.content[linha];
        
                //Inicializa a variavel que será usada para a soma ponderada da linha atual
                let produtoAtual = 0;
        
                //Percorre cada elemento do vetor B
                for( let colunaB = 0 ; colunaB < matrixB.length ; colunaB++ ){
                    produtoAtual += ( valoresLinhaAtual[colunaB] * matrixB.readIndex(colunaB) );
                }
        
                //Vai adicionando os resultados no vetor de resultado
                vetorResultado.push(produtoAtual);
            }
        
            return Vectorization.Vector(vetorResultado);
        }
    }

    /**
     * Multiplica esta matrix com outra, de maneira elemento a elemento
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-elemento-a-elemento/codigo-principal.js
     * 
     * @param {Vectorization.Matrix} matrixB_param
     * @returns {Vectorization.Matrix}
    */
    context.multiplicarMatrix = function(matrixB_param){
        if( matrixB_param.objectName != undefined && matrixB_param.objectName != 'Matrix' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Matrix. E não um ' + String(matrixB_param.objectName);
        }

        let matrixA = context.content;
        let matrixB = (matrixB_param.objectName && matrixB_param.objectName == 'Matrix') ? matrixB_param.content : matrixB_param;
        let matrixResultado = [];

        if( matrixA.length != matrixB.length || matrixA[0].length != matrixB[0].length ){
            throw 'As matrizes precisam ser do mesmo tamanho!'
        }

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                matrixResultado[i].push( matrixA[i][j] * matrixB[i][j] );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
     * Multiplica esta matrix por um número
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-por-um-numero-scalar/codigo-principal.js
     * @param {Number} numero
     * @returns {Vectorization.Matrix}
     */
    context.multiplicarNumero = function(numero){
        let matrixA = context.content;
        let matrixResultado = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];
    
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                matrixResultado[i].push( matrixA[i][j] * numero );
            }
        }
    
        return Vectorization.Matrix(matrixResultado);
    }

    /**
     * Multiplica esta matrix por um vetor
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/multiplicar-matrizes-por-um-vetor-linha-por-linha/codigo-principal.js
     * @param {Vectorization.Vector} vectorB_param
     * @returns {Vectorization.Matrix} 
     */
    context.multiplicarVetor = function(vectorB_param){
        let matrixA = context.content;
        let vectorB = (vectorB_param.objectName != undefined && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let matrixResultado = [];

        if( matrixA[0].length != vectorB.length ){
            throw 'A quantidade de elementos do vetor precisa ser a quantidade de colunas da matrix';
        }

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                matrixResultado[i].push( matrixA[i][j] * vectorB[j] );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
     * Faz a transposta da matrix
     * https://github.com/WilliamJardim/javascript-matematica/tree/main/matriz-transposta
     *
     * @returns {Vectorization.Matrix}
    */
    context.transposta = function(){
        let novaMatrix = [];

        for( let j = 0 ; j < context.content[0].length ; j++ ){
            novaMatrix[j] = [];

            for( let i = 0 ; i < context.content.length ; i++ ){
                novaMatrix[j].push( context.content[i][j] );
            }
        }

        const extraProps = {
            isTransposta: !context.isTransposta ? true : false
        }

        return Vectorization.Matrix(novaMatrix, extraProps);
    }

    /**
     * Obtem a matrix oposta
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/matriz-oposta/codigo-principal.js
     * @returns {Vectorization.Matrix}
     */
    context.matrixOposta = function(){
        let matrixA = context.content;
        let novaMatrix = [];
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] * -1;
            }
        }

        const extraProps = {
            isOposta: !context.isOposta ? true : false
        }
    
        return Vectorization.Matrix(novaMatrix, extraProps);
    }

    /**
     * Obtem a matrix absoluta
     * 
     * @returns {Vectorization.Matrix}
     */
    context.abs = function(){
        let matrixA = context.content;
        let novaMatrix = [];
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = Math.abs(matrixA[i][j]);
            }
        }

        const extraProps = {
            isOposta: !context.isOposta ? true : false
        }
    
        return Vectorization.Matrix(novaMatrix, extraProps);
    }

    context.modulo = function(){
        return context.abs();
    }

    context.absoluto = function(){
        return context.abs();
    }

    /**
     * Obtem a raiz quadrada, de cada elemento da matrix 
     * @returns {Vectorization.Matrix}
     */
    context.sqrt = function(){
        let matrixA = context.content;
        let novaMatrix = [];
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = Math.sqrt(matrixA[i][j]);
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Obtem o log2, de cada elemento da matrix 
     * @returns {Vectorization.Matrix}
     */
    context.log2 = function(){
        let matrixA = context.content;
        let novaMatrix = [];
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = Math.log2(matrixA[i][j]);
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
    * Tenta obter a matrix de identidade de ordem desta matrix 
    */
    context.identidade = function(){
        if( context.rows != context.columns ){
            throw 'A matrix precisa ser quadrada de ordem X'
        }
        
        return window.Vectorization.matrixIdentidade( context.rows );
    }

    /**
     * Soma esta matrix com outra matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/soma-matrizes/codigo-principal.js
     * @param {Vectorization.Matrix} matrixB_param 
     * @returns {Vectorization.Matrix}
    */
    context.somarMatrix = function(matrixB_param){
        if( matrixB_param.objectName != undefined && matrixB_param.objectName != 'Matrix' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Matrix. E não um ' + String(matrixB_param.objectName);
        }

        let matrixA = context.content;
        let matrixB = (matrixB_param.objectName != undefined && matrixB_param.objectName == 'Matrix') ? matrixB_param.content : matrixB_param;
        let novaMatrix = [];
    
        if( matrixA.length != matrixB.length || matrixA[0].length != matrixB[0].length ){
            throw 'As matrizes precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] + matrixB[i][j];
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
    * Soma esta matrix com um número
    * https://github.com/WilliamJardim/javascript-matematica/blob/main/soma-matrizes-por-um-numero-scalar/codigo-principal.js
    * @param {Number} numero
    * @returns {Vectorization.Matrix}
    */
    context.somarNumero = function(numero){
        let matrixA = context.content;
        let novaMatrix = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] + numero;
            }
        }

        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Soma esta matrix com um vetor
     * 
     * @param {Vectorization.Matrix} vectorB_param 
     * @returns {Vectorization.Matrix}
    */
    context.somarVetor = function(vectorB_param){
        let vectorB = (vectorB_param.objectName != undefined && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;

        if( vectorB.objectName != undefined && vectorB.objectName != 'Vector' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Vector. E não um ' + String(vectorB.objectName);
        }
        
        let matrixA = context.content;

        if( matrixA[0].length != vectorB.length ){
            throw 'A quantidade de elementos do vetor precisa ser a quantidade de colunas da matrix';
        }

        //let matrixB = (vectorB.objectName != undefined && vectorB.objectName == 'Vector') ? vectorB.content : vectorB;
        let novaMatrix = [];
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] + vectorB[j];
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Subtrai esta matrix com outra matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/subtracao-matrizes/codigo-principal.js
     * @param {Vectorization.Matrix} matrixB_param 
     * @returns {Vectorization.Matrix}
    */
    context.subtrairMatrix = function(matrixB_param){
        if( matrixB_param.objectName != undefined && matrixB_param.objectName != 'Matrix' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Matrix. E não um ' + String(matrixB_param.objectName);
        }

        let matrixA = context.content;
        let matrixB = (matrixB_param.objectName != undefined && matrixB_param.objectName == 'Matrix') ? matrixB_param.content : matrixB_param;
        let novaMatrix = [];
    
        if( matrixA.length != matrixB.length || matrixA[0].length != matrixB[0].length ){
            throw 'As matrizes precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] - matrixB[i][j];
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Subtrai esta matrix com um número
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/subtracao-matrizes-por-um-numero-scalar/codigo-principal.js
     * @param {Vectorization.Matrix} matrixB_param 
     * @returns {Vectorization.Matrix} 
    */
    context.subtrairNumero = function(numero){
        let matrixA = context.content;
        let novaMatrix = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] - numero;
            }
        }

        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Subtrai esta matrix com um vetor
     * 
     * @param {Vectorization.Matrix} vectorB_param 
     * @returns {Vectorization.Matrix}
    */
    context.subtrairVetor = function(vectorB_param){
        let vectorB = (vectorB_param.objectName != undefined && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;

        if( vectorB.objectName != undefined && vectorB.objectName != 'Vector' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Vector. E não um ' + String(vectorB.objectName);
        }
        
        let matrixA = context.content;

        if( matrixA[0].length != vectorB.length ){
            throw 'A quantidade de elementos do vetor precisa ser a quantidade de colunas da matrix';
        }

        //let matrixB = (vectorB.objectName != undefined && vectorB.objectName == 'Vector') ? vectorB.content : vectorB;
        let novaMatrix = [];
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] - vectorB[j];
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Divide esta matrix com outra matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/divisao-matrizes/codigo-principal.js
     * @param {Vectorization.Matrix} matrixB_param 
     * @returns {Vectorization.Matrix}
    */
    context.dividirMatrix = function(matrixB_param){
        if( matrixB_param.objectName != undefined && matrixB_param.objectName != 'Matrix' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Matrix. E não um ' + String(matrixB_param.objectName);
        }
        
        let matrixA = context.content;
        let matrixB = (matrixB_param.objectName != undefined && matrixB_param.objectName == 'Matrix') ? matrixB_param.content : matrixB_param;
        let novaMatrix = [];
    
        if( matrixA.length != matrixB.length || matrixA[0].length != matrixB[0].length ){
            throw 'As matrizes precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] / matrixB[i][j];
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Divide esta matrix por um número
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/divisao-matrizes-por-um-numero-scalar/codigo-principal.js
     * @param {Number} numero 
     * @returns {Vectorization.Matrix}
     */
    context.dividirNumero = function(numero){
        let matrixA = context.content;
        let novaMatrix = [];
        
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] / numero;
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    /**
    * Divide esta matrix por um vetor, aplicando o vetor a cada linha desta matrix 
    * https://github.com/WilliamJardim/javascript-matematica/blob/main/divisao-matrizes-por-um-vetor-linha-por-linha/codigo-principal.js
    * @param {Vectorization.Vector} vectorB_param
    * @returns {Vectorization.Matrix}
    */
    context.dividirVetor = function(vectorB_param){
        let matrixA = context.content;
        let vectorB = (vectorB_param.objectName != undefined && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let novaMatrix = [];

        if( matrixA[0].length != vectorB.length ){
            throw 'A quantidade de elementos do vetor precisa ser igual a quantidade de colunas da matrix!'
        }

        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                novaMatrix[i][j] = matrixA[i][j] / vectorB[j];
            }
        }

        return Vectorization.Matrix(novaMatrix);
    }

    /**
    * Eleva esta matrix a um número
    * 
    * @param {Number} numero
    * @returns {Vectorization.Matrix}
    */
    context.elevarNumero = function(numero){
        let matrixA = context.content;
        let novaMatrix = [];

        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = Math.pow(matrixA[i][j], numero);
            }
        }

        return Vectorization.Matrix(novaMatrix);
    }

    /**
     * Eleva esta matrix a um vetor
     * 
     * @param {Vectorization.Vector} vectorB_param
     * @returns {Vectorization.Matrix} 
     */
    context.elevarVetor = function(vectorB_param){
        let matrixA = context.content;
        let vectorB = (vectorB_param.objectName != undefined && vectorB_param.objectName == 'Vector') ? vectorB_param.content : vectorB_param;
        let matrixResultado = [];

        if( matrixA[0].length != vectorB.length ){
            throw 'A quantidade de elementos do vetor precisa ser a quantidade de colunas da matrix';
        }

        for( let i = 0 ; i < matrixA.length ; i++ )
        {   
            matrixResultado[i] = [];

            for( let j = 0 ; j < vectorB.length ; j++ )
            {
                matrixResultado[i].push( Math.pow(matrixA[i][j], vectorB[j]) );
            }
        }

        return Vectorization.Matrix(matrixResultado);
    }

    /**
     * Eleva esta matrix a outra matrix
     * https://github.com/WilliamJardim/javascript-matematica/blob/main/divisao-matrizes/codigo-principal.js
     * @param {Vectorization.Matrix} matrixB_param 
     * @returns {Vectorization.Matrix}
    */
    context.elevarMatrix = function(matrixB_param){
        if( matrixB_param.objectName != undefined && matrixB_param.objectName != 'Matrix' ){
            throw 'O segundo parametro precisa obrigatoriamente ser um Matrix. E não um ' + String(matrixB_param.objectName);
        }
        
        let matrixA = context.content;
        let matrixB = (matrixB_param.objectName != undefined && matrixB_param.objectName == 'Matrix') ? matrixB_param.content : matrixB_param;
        let novaMatrix = [];
    
        if( matrixA.length != matrixB.length || matrixA[0].length != matrixB[0].length ){
            throw 'As matrizes precisam ser do mesmo tamanho!'
        }
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = Math.pow(matrixA[i][j], matrixB[i][j]);
            }
        }
    
        return Vectorization.Matrix(novaMatrix);
    }

    context._doDefaultBaseAfterCreate();

    //Se a opção advanced estiver ativa, ele roda um método adicional após criar a matrix
    if( context.isAdvancedMatrix == true ){
        context._matrix2Advanced();
    }

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.translateMethods( context._translations() );
    }

    //return context;
    //Cria um Proxy para permitir acessar os indices da matrix diretamente
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
window.Vectorization.Matrix.isMatrix = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Matrix');
}