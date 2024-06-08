/*
 * File Name: Matrix.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Matrix = function( config, classConfig={} ){
    let context = window.Vectorization.Base(classConfig);
    context.objectName = 'Matrix';
    context.path = 'Vectorization.Matrix';

    context.rows = config['rows'] || 2;
    context.columns = config['columns'] || 2;
    context.initialColumnValue = config['fillValue'] || 0;
    context.content = [];

    //Alguns atributos uteis
    context.isTransposta = classConfig['isTransposta'] || false;

    //Se passar diretamente o conteudo
    if( config instanceof Array && config[0] instanceof Array ){
        context.content = config;
        context.rows = config.length;
        context.columns = config[0].length;

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

    context.valueOf = function(){
        return context.content;
    }

    context.toString = function(){
        return String(context.content);
    }

    context.values = function(){
        return context.content;
    }

    context.push = function(element){
        context.content.push(element);
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

    context._doDefaultBaseAfterCreate();

    return context;
}