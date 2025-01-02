/*
 * File Name: Matrix.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: MIT
*/

//Compatibilidade com NodeJS
if( typeof window === 'undefined' ){
    global.window = global; 
    require('./Root');
    require('./Scalar');
    require('./Vector');
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Matrix = function( config, classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Matrix._translations || null;

    let classeBaseMatrix = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseMatrix.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    //Se o usuario tentar criar uma matrix a partir de outra matrix, ele recria a propio matrix passada, mantendo a estrutura como ainda sendo uma Matrix
    if( Vectorization.Matrix.isMatrix(config) && config.objectName == 'Matrix' ){
        return Vectorization.Matrix( config.raw() );
    }

    let context = window.Vectorization.Base(classConfig);
    context.objectName = 'Matrix';
    context.path = 'Vectorization.Matrix';
    
    context.configRecebidaUsuario = config;

    context.storedClassConfig = classConfig || {};

    //Aplica a tradução dos atributos, pra ser capaz de entender nomes de atributos em outros idiomas
    //classConfig = context.translateAttributes_andReturn(classConfig, classConfig['translations']() );
    
    //Aplica a tradução dos atributos também no config, EXCETO SE config FOR UM ARRAY
    if( config instanceof Object && !(config instanceof Array && (config[0] instanceof Array || Vectorization.Vector.isVector(config[0]) || Vectorization.BendableVector.isVectorizationBendableVector(config[0]) )) ){
        config = context.translateAttributes_andReturn(config, classConfig['translations']() );
    }


    context.rows = config['rows'];
    context.columns = config['columns'];
    context.initialColumnValue = config['fillValue'] || 0;
    context.flexivel = config['flexibilidade'] || classConfig['flexibilidade'] || null;

    //Mais opções de flexibilidade
    if( context.flexivel != undefined && 
        config.length > 0 && 
        config[0] != undefined 
    ){
        //Se for apenas um texto, com o nome do tipo, ele trata isso aqui
        if( typeof context.flexivel == 'string' ){
            context.flexivel = [ context.flexivel ];
        }

        //Se o usuario passar um array contendo apenas um elemento, ele vai usar ele como tipo para todos os elementos deste Vectorization.BendableVector
        if( context.flexivel instanceof Array && context.flexivel.length == 1 && config[0].length > 1 )
        {
            
            for( let i = 0 ; i < config[0].length-1 ; i++ )
            {
                //Completa com o tipo que veio
                context.flexivel.push(context.flexivel[0]);
            }

        }
    }

    context.isFlexivelNasColunas = context.flexivel != undefined && context.flexivel != null ? true : false;

    context.content = [];

    context.permitirDesbloquear = (classConfig['permitirDesbloquear'] != undefined) ? (classConfig['permitirDesbloquear']) : true;
    context.permitirBloquear = (classConfig['permitirBloquear'] != undefined) ? (classConfig['permitirBloquear']) : true;

    context._isBloqueado = function(){
        if( context.bloqueado != undefined && context.bloqueado == true ){
            return true;
        }
        return false;
    }

    context.bloquearModificacoes = function(){
        if( context.permitirBloquear == true ){
            context.bloqueado = true;

            if(context.isAdvancedMatrix == true)
            {
                //Bloquear também os filhos Vectorization.Vector dentro deste Vectorization.Matrix
                context.paraCadaLinha(function(i, elementoVetorLinhaMatrix){
                    elementoVetorLinhaMatrix.bloquearModificacoes();
                });
            }

        }else{
            throw 'Ação não permitida para este Vectorization.Matrix!';
        }
    }

    context.desbloquearModificacoes = function(){
        if( context.permitirDesbloquear == true ){
            context.bloqueado = false;

            if(context.isAdvancedMatrix == true)
            {
                //Desbloquear também os filhos Vectorization.Vector dentro deste Vectorization.Matrix
                context.paraCadaLinha(function(i, elementoVetorLinhaMatrix){
                    elementoVetorLinhaMatrix.desbloquearModificacoes();
                });
            }
        }else{
            throw 'Ação não permitida para este Vectorization.Matrix!';
        }
    }

    /**
    * Atualiza a quantidade de linhas e colunas
    */
    context.atualizarQuantidadeColunasLinhas = function(){
        //Atualiza a quantidade das colunas
        context.columns = context.calcTamanhos().lerIndice(1);
        context.colunas = context.columns;

        //Atualiza a quantidade de linhas
        context.rows    = context.content.length; 
        context.linhas  = context.rows;
    }

    //Alguns atributos uteis
    context.isTransposta = classConfig['isTransposta'] || false;
    context.isOposta = classConfig['isOposta'] || false;
    context.isIdentidade = classConfig['isIdentidade'] || false;
    context.isAdvancedMatrix = classConfig['advanced'] || true;

    if( classConfig['advanced'] == false ){
        context.isAdvancedMatrix = false;
    }

    //Se passar diretamente o conteudo
    if( config instanceof Array && (config[0] instanceof Array || Vectorization.Vector.isVector(config[0]) || Vectorization.BendableVector.isVectorizationBendableVector(config[0]) ) ){

        //Se as linhas forem vetores do pacote Vectorization
        if( Vectorization.Vector.isVectorizationVector( config[0] ) == true ||
            Vectorization.BendableVector.isVectorizationBendableVector( config[0] ) == true
        ){
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

        /**
        * 25/07/2024 16:55 PM
        *  BUG CORRIGIDO:
        *    se o objeto for uma lista de objetos Vectorization.Vector, da certo
        *    AGORA se o objeto for um Vectorization.Vector que contem outros Vectorization.Vector
        *    dava erro na linha 251
        */
        //Se a matrix nao foi inicializada E SE FOR UM VETOR DO VECTORIZATION QUE CONTEM OUTROS VETORES DO VECTORIZATION
        if( context.rows == undefined && Vectorization.Vector.isVectorizationVector(config) ){
            context.content = config.raw();
            context.rows = config.length;
            context.columns = config.lerIndice(0).length;
        }
    }


    //Também, se o config for um objeto(NÂO FOR UM ARRAY)
    if( config instanceof Object && !(config instanceof Array && (config instanceof Array || Vectorization.Vector.isVector(config) )) ){
        context.aleatorio = config['aleatorio'] || false;

        if( config['aleatorio'] != undefined &&
            config['numeros'] != undefined
        ){
            throw 'Voce não pode criar um Vectorization.Matrix com contéudo definido, e ao mesmo tempo sendo aleatório!';
        }
        
        if( context.aleatorio == true ){
            context.content = []; // Zero o conteudo

            //Se tem outros detalhes
            if( config['minimo'] != undefined && 
                config['maximo'] != undefined && 
                config['linhas'] != undefined &&
                config['colunas'] != undefined &&
                typeof config['minimo'] == 'number' &&
                typeof config['maximo'] == 'number' &&
                typeof context.rows == 'number' &&
                typeof context.columns == 'number'
            ){
                //Grava os parametros
                context.minimoAleatorio = config['minimo'];
                context.maximoAleatorio = config['maximo'];

                //Se tiver um número base
                if( config['sementeAleatoria'] != undefined &&
                    typeof config['sementeAleatoria'] == 'number'
                ){
                    context.sementeAleatoria = config['sementeAleatoria'];
                }else{
                    context.sementeAleatoria = Vectorization.Random._sementeDefinida;
                }

                //Vai gerando os valores aleatorios enquanto não terminar a quantidade de elementos
                Vectorization.Vector({
                    valorPreencher: 1,
                    elementos: context.rows

                }).paraCadaElemento(function(iLinhaMatrix, linhaMatrix){
                    let objLinhaMatrix = linhaMatrix;
                    context.content[iLinhaMatrix] = [];

                    Vectorization.Vector({
                        valorPreencher: 1,
                        elementos: context.columns

                    }).paraCadaElemento(function(jColunaMatrix, colunaMatrix){
                        let objColunaMatrix = colunaMatrix;
                        
                        let numeroAleatorioGeradoParaOIndice = Vectorization.Random.gerarNumeroAleatorio( Number(context.minimoAleatorio), Number(context.maximoAleatorio), context.sementeAleatoria );
                        context.content[iLinhaMatrix][jColunaMatrix] = numeroAleatorioGeradoParaOIndice;
                    });
                });

                //Se o programador quiser arredondar
                if( config['arredondar'] != undefined ){
                    Vectorization.Vector({
                        valorPreencher: 1,
                        elementos: context.rows
    
                    }).paraCadaElemento(function(iLinhaMatrix, linhaMatrix){
                        let objLinhaMatrix = context.content[iLinhaMatrix];

                        if( Vectorization.Vector.isVector(objLinhaMatrix) &&
                            Vectorization.Vector.isVectorizationVector(objLinhaMatrix)
                        ){
                           objLinhaMatrix.aplicarArredondamento(config['arredondar']);

                        }else{
                            if( Vectorization.Vector.isVector(objLinhaMatrix) )
                            {
                                let valoresObtidos = Vectorization.Vector(objLinhaMatrix).getValoresArredondados(config['arredondar']);
                                
                                for( let i = 0 ; i < valoresObtidos.tamanho() ; i++ )
                                {
                                    objLinhaMatrix[i] = valoresObtidos.readIndex(i);
                                }
                            }
                        }
                    });
                }

            }else{
                if( typeof config['minimo'] != 'number' ||
                    typeof config['maximo'] != 'number' ||
                    typeof context.rows != 'number' || 
                    typeof context.columns != 'number'
                ){
                    throw 'Os valores minimo, máximo e quantidade de elementos das linhas e colunas precisam ser números!. Tipo não permitido.'
                
                }else{
                    throw 'Para criar uma Matrix aleatório voce precisar passar a faixa de valores e a quantidade de elementos nas linhas e colunas!';
                }
            }

        }else if(context.aleatorio == false){
        
            if( config['numeros'] != undefined &&
                Vectorization.Vector.isVector(config['numeros'])
            ){
                if( config['aleatorio'] != undefined ){
                    throw 'Voce não pode criar um Vectorization.Matrix com contéudo definido, e ao mesmo tempo sendo aleatório!';
                }

                context.content = config['numeros'] != undefined ? 
                                  (Vectorization.Matrix.isVectorizationMatrix(config['numeros']) ? config['numeros'].valores() : 
                                   config['numeros']) : [];
            }

            context.conteudo = context.content;

            if( config['numeros'] != undefined )
            {
                context.rows = config['numeros'].length;
                context.columns = config['numeros'][0].length;

            }else{
                context.rows = context.content.length;
                
                if( context.content[0] != undefined ){
                    context.columns = context.content[0].length;
                }else{
                    context.columns = 0;
                }
            }
        }
    }


    //Alias em portugues
    context.linhas = context.rows;
    context.colunas = context.columns;
    context.conteudo = context.content;

    //Uma matriz simples nunca vai ser profunda
    context.matrixProfunda = false;

    /**
    * Método que converte a matrix para uma matrix avançada, onde cada linha é um Vector 
    */
    context._matrix2Advanced = function(vectorClassConfig={}){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            const extraPropsOfLine = {... vectorClassConfig};
            extraPropsOfLine['index'] = i;
            extraPropsOfLine['_pai']  = context; 

            if( context.isFlexivelNasColunas == true ){
                if( Vectorization.Vector.isVector(context.flexivel) ){
                    extraPropsOfLine['flexibilidade'] = [... context.flexivel];

                }else{
                    extraPropsOfLine['flexibilidade'] = context.flexivel;
                }

                context.content[i] = Vectorization.BendableVector(context.content[i], extraPropsOfLine);

            }else{
                context.content[i] = Vectorization.Vector(context.content[i], extraPropsOfLine);
            }

        }
        context.isAdvancedMatrix = true;
    }

    context.adicionarVetorComoColuna = function(vectorAdicionar){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        if( context.isAdvancedMatrix ){
            if( context.isFlexivelNasColunas == false ){
                context.content.push( vectorAdicionar );

            }else{
                context.content.push( vectorAdicionar );
            }

        }else{
            if( context.isFlexivelNasColunas == false ){
                context.content.push( vectorAdicionar );

            }else{
                context.content.push( vectorAdicionar );
            }
        }

        if( context.content != undefined ){
            context.rows = context.content.length;
        }

        if( context.content != undefined && 
            context.columns[0] != undefined
        ){
            context.columns = context.columns[0].length;
        }
    }

    /**
    * Obtem uma nova matriz exatamente igual a esta matrix.
    * Ou seja, faz um copia do propio objeto, identico, porém sem manter as referencias. 
    * @returns {Vectorization.Matrix}
    */
    context.duplicar = function(){
        let novaMatrix = [];
        let novaMatrix_Matrix = null; //Se for necessario

        if( context.isFlexivelNasColunas == true ){
            //Nesse caso foi necessario usar o novaMatrix_Matrix como Vectorization.Matrix
            novaMatrix_Matrix = Vectorization.Matrix([], {
                flexibilidade: context.flexivel
            });
        }

        for( let i = 0 ; i < context.rows ; i++ )
        {
            if( context.isFlexivelNasColunas == false ){
                novaMatrix.push( Vectorization.Vector(context.getLinha(i)).clonar() );

            }else{
                novaMatrix_Matrix.adicionarVetorComoColuna( Vectorization.BendableVector(context.getLinha(i), {
                    flexibilidade: context.flexivel
                }).clonar() );
            }
        }

        return context.isFlexivelNasColunas == false ? Vectorization.Matrix(novaMatrix) : 
                                                       novaMatrix_Matrix;
    }

    //Alias for duplicar
    context.clonar = context.duplicar;

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

    context.rawProfundo = function(){
        let rawValues = [];

        for( let i = 0 ; i < context.rows ; i++ )
        {
            rawValues[i] = context.content[i].rawProfundo();
        }

        return rawValues;
    }

    context.rawValues = function(){
        let rawValues = [];

        //Se for um Vectorization.Matrix com essa opcao especifica ativa, usa por padrao o profundo
        if( context.isFlexivelNasColunas == true ){
            return context.rawProfundo();
        }

        for( let i = 0 ; i < context.rows ; i++ )
        {
            rawValues[i] = context.content[i].values();
        }

        return rawValues;
    }

    context.raw = function(){
        return context.rawValues();
    }

    /**
    * Verifica se algum elemento está presente nesta Vectorization.Matrix
    * @param {Object} valor 
    * @returns {Boolean}
    */
    context.have = function( valor ){
        let tem = false;

        for( let i = 0 ; i < context.rows ; i++ ){
            if( (context.getLinha( i ).have || context.getLinha( i ).includes)( valor ) ){
                tem = true;
                break;
            }
        }

        return tem;
    }

    context.mostrarTabela = function(){
        console.table( context.rawValues() );
    }

    context.mostrar = function(){
        console.log( context.rawValues() );
    }

    context.push = function(element){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        if( context.isAdvancedMatrix ){
            if( context.isFlexivelNasColunas == true ){
                context.content.push( element.objectName != undefined && element.objectName == 'Vector' ? element : Vectorization.BendableVector(element, context._config) );

            //Se não tem flexibilidade
            }else{
                context.content.push( element.objectName != undefined && element.objectName == 'Vector' ? element : Vectorization.Vector(element) );
            }

        }else{
            context.content.push(element);
        }

        //Atualiza a quantidade de linhas e colunas
        context.atualizarQuantidadeColunasLinhas();
    }

    context.obterTiposRapido = function(includeNamespace=false){
        let tiposUsados = [];
        context.paraCadaLinha(function(i, elementoAtual){
            tiposUsados.push( elementoAtual.obterTiposRapido(includeNamespace) );
        });

        return tiposUsados;
    }

    context.identificarTiposColuna = function(numeroColuna){
        const resultado = Vectorization.Base({
            tipos: Vectorization.Vector([], {usarEscalares: false})
        });

        context.percorrerColuna(numeroColuna, function(iColuna, valorColuna){
            resultado.tipos.adicionarElemento( window.Vectorization.identificarTipo( valorColuna ) );
        });

        resultado.tiposUnicos = resultado.tipos.valoresUnicos();
        resultado.raw = function(){
            return resultado.tipos.raw();
        }

        return resultado;
    }
    context.getTiposColuna = context.identificarTiposColuna;
    context.obterTiposColuna = context.identificarTiposColuna;

    /**
    * Permite fatiar(ou recortar) a matrix
    * @param {linhaInicial} - inicio
    * @param {linhaFinal} - final
    * @param {intervalo} - intervalo
    * @returns {Vectorization.Matrix} - a matriz recortada
    */
    context.slice = function(linhaInicial, linhaFinal, intervalo=1){
        let dadosRecortados = [];

        if( linhaInicial < 0 ){
            throw 'A linhaInicial precisa ser maior ou igual a zero!';
        }

        if( linhaFinal > context.rows ){
            throw 'A linhaFinal precisa estar entre as linhas da matriz! valor muito alto!';
        }

        if( intervalo <= 0 ){
            throw 'O intervalo precisa ser maior que zero!';
        }

        for( let i = linhaInicial ; i < linhaFinal ; i = i + intervalo )
        {
            dadosRecortados.push( context.getLinha(i).raw() );
        }

        if( context.flexibilidade ){
            return Vectorization.Matrix(dadosRecortados, {
                flexibilidade: context.flexibilidade || []
            });
        }

        return Vectorization.Matrix(dadosRecortados);
    }

    context.recortarLinhas = context.slice;
    context.sliceLinhas = context.slice;

    /**
     * Similar ao context.slice, porém executado nas colunas
     * @param {Number} colunaInicial 
     * @param {Number} colunaFinal 
     * @param {Number} intervaloLinhas 
     * @param {Number} intervaloColunas 
     * @returns {Vectorization.Matrix}
     */
    context.recortarColunas = function(colunaInicial, colunaFinal='nao_definida', intervaloLinhas=1, intervaloColunas=1){
        let dadosRecortados = [];

        if( colunaFinal == 'nao_definida' ){
            colunaFinal = context.columns + 1;
        }

        if( colunaInicial < 0 ){
            throw 'A colunaInicial precisa ser maior ou igual a zero!';
        }

        if( colunaFinal > context.rows ){
            throw 'A colunaFinal precisa estar entre as linhas da matriz! valor muito alto!';
        }

        for( let i = 0 ; i < context.rows ; i = i + intervaloLinhas )
        {
            dadosRecortados[ i ] = context.getLinha(i)
                                          .slice( colunaInicial, colunaFinal, intervaloColunas );
        }

        return Vectorization.Matrix(dadosRecortados);
    }

    /**
     * Similar ao context.slice, porém executado nas colunas
     * @param {Number} colunaInicial 
     * @param {Number} colunaFinal 
     * @param {Number} intervaloLinhas 
     * @param {Number} intervaloColunas 
     * @returns {Vectorization.Matrix}
     */
    context.sliceColunas = context.recortarColunas;

    /**
     * Similar ao context.slice, porém executado nas linhas e também nas colunas
     * @param {Number} linhaInicial 
     * @param {Number} linhaFinal 
     * @param {Number} colunaInicial 
     * @param {Number} colunaFinal 
     * @param {Number} intervaloLinhas 
     * @param {Number} intervaloColunas 
     * @returns {Vectorization.Matrix}
     */
    context.recortarRegiao = function(linhaInicial, linhaFinal, colunaInicial, colunaFinal='nao_definida', intervaloLinhas=1, intervaloColunas=1){
        let dadosRecortados = [];

        if( linhaInicial < 0 ){
            throw 'A linhaInicial precisa ser maior ou igual a zero!';
        }

        if( linhaFinal > context.rows ){
            throw 'A linhaFinal precisa estar entre as linhas da matriz! valor muito alto!';
        }

        if( colunaFinal == 'nao_definida' ){
            colunaFinal = context.columns + 1;
        }

        if( colunaInicial < 0 ){
            throw 'A colunaInicial precisa ser maior ou igual a zero!';
        }

        if( colunaFinal > context.rows ){
            throw 'A colunaFinal precisa estar entre as linhas da matriz! valor muito alto!';
        }

        for( let i = linhaInicial ; i < linhaFinal ; i = i + intervaloLinhas )
        {
            dadosRecortados[ i ] = context.getLinha(i)
                                          .slice( colunaInicial, colunaFinal, intervaloColunas );
        }

        return Vectorization.Matrix(dadosRecortados);
    }

    /**
    * Similar ao context.slice, porém executado nas linhas e também nas colunas
    * @param {Number} linhaInicial 
    * @param {Number} linhaFinal 
    * @param {Number} colunaInicial 
    * @param {Number} colunaFinal 
    * @param {Number} intervaloLinhas 
    * @param {Number} intervaloColunas 
    * @returns {Vectorization.Matrix}
    */
    context.slice2 = context.recortarRegiao;

    /**
    * Permite extrair valores de uma coluna especifica
    * @param {Number} indiceColuna - o indice da coluna que queremos extrair os valores
    * @returns {Vectorization.Vector || Array}
    */
    context.extrairValoresColuna = function(indiceColuna){
        let valoresColuna = [];
        for( let i = 0 ; i < context.rows ; i++ )
        {
            valoresColuna.push( Vectorization.Vector(context.getLinha(i)).readIndex(indiceColuna) );
        }

        if( context.isAdvancedMatrix ){
            if( context.isFlexivelNasColunas == true ){
                let extraPropsOfLine = {};

                //Cada coluna pode ter o seu
                if( Vectorization.Text.isText( valoresColuna[0] ) ){
                    extraPropsOfLine['flexibilidade'] = Vectorization.Vector({
                        usarEscalares: false,
                        valorPreencher: 'Texto',
                        elementos: valoresColuna.length
                    });

                }else if( Vectorization.Scalar.isScalar( valoresColuna[0] ) ){
                    extraPropsOfLine['flexibilidade'] = Vectorization.Vector({
                        usarEscalares: false,
                        valorPreencher: 'Numero',
                        elementos: valoresColuna.length
                    });
                }

                return Vectorization.BendableVector( valoresColuna, extraPropsOfLine );

            }else if (context.isFlexivelNasColunas == false ){
                return Vectorization.Vector( valoresColuna );
            }

        }else{
            return valoresColuna;
        }
    }

    /**
    * Subfatiar esta matriz em varias partes, cada uma com uma CERTA QUANTIDADE FIXA DE AMOSTRAS
    *  
    * Agrupa sequencialmente amostras, de acordo com O TAMANHO DA FATIA , por exemplo, se for uma fatia de 7 amostras, então, ele vai dividir o dataset em subgrupos, cada um tendo 7 amostras cada.
    * Ou seja, o dataset seria dividido de 7 em 7 amostras. Ou seja, cada fatia teria 7 amostras.
    * 
    * NOTA: Cada parte vai ser uma nova Vectorization.Matrix, contendo Vectorization.Vector(s) dentro. Ou seja, cada Vectorization.Vector dentro dessa matrix resultado, vai ser uma amostra.
    * 
    * @param {Number} tamanhoFatia - O tamanho das fatias(quantidade de amostras por fatia)
    * @param {Number} iniciarEm - O indice que ele vai iniciar o fatiamento
    * 
    * @returns { Vectorization.Envelope }
    */
    context.subfatiar = function( tamanhoFatia, iniciarEm=0 ){
        if(!tamanhoFatia){
            throw 'Voce precisa definir uma quantidade de amostras para as fatias!';
        }
        if( tamanhoFatia > context.linhas ){
            console.warn(`O tamanho de fatia ${tamanhoFatia} é maior do que a quantidade de linhas da matrix`);
        }

        let fatiasFeitas = [];
        let indiceFinalFatia = (tamanhoFatia - iniciarEm);

        for( let indiceAtual = iniciarEm ; indiceAtual < context.linhas ; indiceAtual += tamanhoFatia ){

            const sliceAtual = context.clonar()
                                      .slice( indiceAtual, indiceFinalFatia );

            indiceFinalFatia = indiceFinalFatia + tamanhoFatia;

            fatiasFeitas.push( sliceAtual );
        }

        return Vectorization.Envelope(fatiasFeitas);
    }

    /**
    * Cria varias "áreas deslizantes". Cada área vai ter <N> números.
    * Pode ser usado para calcular médias móveis, desvio padrão movel, variancia movel, etc. 
    * 
    * Em outras palavras, O método 'deslizes' serve para gerar vários deslizes por assim dizer, ou seja, vai deslizando as linhas desta Matrix, gerando outras sub Matrizes com uma mesma quantidade fixa de linhas, cada parte contendo seu slice atual da posição atual ATÈ a posição atual MAIS O TAMANHO DO PEDAÇO. 
    * O método retorna um objeto Envelope.
    * 
    * @returns {Vectorization.Envelope}
    */
    context.deslizes = function( quantidadeDeslizes=4, iniciarEm=0 ){
        let deslizesProntos = Vectorization.Envelope([]);

        if( String(quantidadeDeslizes).indexOf('.') != -1 ){
            throw `O parametro quantidadeDeslizes tem valor '${quantidadeDeslizes}', porém ele precisa ser inteiro!. `;
        }

        if( iniciarEm < 0 ){
            throw `O parametro 'iniciarEm' tem valor ${ iniciarEm }. Porém, ele precisa ser positivo!`;
        }

        if( quantidadeDeslizes < 0 ){
            throw `O parametro 'quantidadeDeslizes' tem valor ${ quantidadeDeslizes }. Porém, ele precisa ser positivo!`;
        }

        if( quantidadeDeslizes == 0 ){
            throw `O parametro 'quantidadeDeslizes' tem valor ${ quantidadeDeslizes }. Porém, ele precisa ser maior que zero!`;
        }

        for( let i = iniciarEm ; i < context.linhas ; i++ ){

            //Se a proxima iteração for ultrapassar os limites(a ultima linha desta Matrix), interompe, pois ja terminou
            if( i + quantidadeDeslizes > context.linhas ){
                break;
            }

            const sliceAtual = context.clonar()
                                      .slice( i, i + quantidadeDeslizes );

            deslizesProntos.adicionarObjeto( sliceAtual );
        }

        return deslizesProntos;
    }

    context.extrairValoresLinha = context.getLinha;

    context._definirValorLinha = function(indice, indiceAdicionar, vetorDaLinha){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        context.getLinha(indice)
               .definirElementoNoIndice(indiceAdicionar, vetorDaLinha);
    }

    /**
    * 
    * @param {Number} indice - O indice da linha
    * @param {Number} indiceAdicionar - O indice da coluna
    * @param {Array} vetorDaLinha 
    */
    context.definirValorLinha = function(indice, indiceAdicionar, vetorDaLinha){
        context._definirValorLinha(indice, indiceAdicionar, vetorDaLinha);
    }

    //Cria uma nova coluna nesta Vectorization.Matrix
    context.adicionarColuna = function(valoresNovaColuna){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        let isVetorVectorization = (
            Vectorization.Vector.isVector(valoresNovaColuna || []) == true &&
            Vectorization.Vector.isVectorizationVector(valoresNovaColuna || []) 
        ) == true;
           
        let valoresNovaColuna_Vector = isVetorVectorization == true ? valoresNovaColuna : Vectorization.Vector(valoresNovaColuna || []);
        let tamanhoVetorNovo = valoresNovaColuna_Vector.tamanho();
        let quantidadeLinhasMatrix = context.getRows();

        if( typeof valoresNovaColuna_Vector == 'object' &&
            tamanhoVetorNovo == quantidadeLinhasMatrix
        ){
            //Para cada linha
            Vectorization.Vector({
                valorPreencher: 1,
                elementos: quantidadeLinhasMatrix

            }).paraCadaElemento(function(iLinha){
                let valoresDaLinhaObtidos = context.getLinha(iLinha);

                switch( Vectorization.Vector.isVectorizationVector(valoresDaLinhaObtidos) || 
                        Vectorization.BendableVector.isVectorizationBendableVector(valoresDaLinhaObtidos) 
                ){
                    case true:
                        valoresDaLinhaObtidos.adicionarElemento( valoresNovaColuna[iLinha] );
                        break;

                    case false:
                        let novoVetorVectorization = Vectorization.Vector(valoresDaLinhaObtidos).adicionarElemento( valoresNovaColuna[iLinha] )
                        context._definirValorLinha(iLinha, valoresDaLinhaObtidos.length, [... novoVetorVectorization.valores()] );
                        break;
                }
            });

            //Atualiza a quantidade das colunas
            context.columns = context.calcTamanhos().lerIndice(1);
            context.colunas = context.columns;

        }else{
            throw 'Não da pra adicionar uma nova coluna se a quantidade de elementos não bater com a quantidade de linhas!. Não permitido.';
        }
    }

    //Remove uma coluna nesta Vectorization.Matrix e retorna uma nova Vectorization.Matrix
    context.removerColuna = function( indiceColuna ){
        let matrixNova = [];
        //Para cada linha
        for( let i = 0 ; i < context.linhas ; i++ )
        {
            const LinhaVector = context.getLinha(i);
            const NovaVector  = Vectorization.Vector([]);

            //Para cada elemento no LinhaVector
            LinhaVector.forEach(function( indiceElemento, valorElemento, contextoLinhaVector ){
                //Se o indice não for o indice que estamos ignorando
                if( indiceElemento != indiceColuna ){
                    NovaVector.push( valorElemento );
                }
            });

            matrixNova.push(NovaVector.raw());
        }

        return Vectorization.Matrix(matrixNova);
    }     
    
    //Remove varias coluna nesta Vectorization.Matrix e retorna uma nova Vectorization.Matrix
    context.removerColunas = function( VectorIndiceColuna=[] ){
        let matrixNova = [];
        //Para cada linha
        for( let i = 0 ; i < context.linhas ; i++ )
        {
            const LinhaVector = context.getLinha(i);
            const NovaVector  = Vectorization.Vector([]);

            //Para cada elemento no LinhaVector
            LinhaVector.forEach(function( indiceElemento, valorElemento, contextoLinhaVector ){
                //Se o indice não for o indice que estamos ignorando
                if( VectorIndiceColuna.includes(indiceElemento) == false ){
                    NovaVector.push( valorElemento );
                }
            });

            matrixNova.push(NovaVector.raw());
        }

        return Vectorization.Matrix(matrixNova);
    }  

    context.zerarColuna = function(indiceColuna, valorDefinirNoLugar=0){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        let quantidadeLinhasMatrix = context.getLinhas();

        //Para cada linha
        Vectorization.Vector({
            valorPreencher: 1,
            elementos: quantidadeLinhasMatrix

        }).paraCadaElemento(function(iLinha){
            context._definirValorLinha(iLinha, indiceColuna, valorDefinirNoLugar );
        });
    }

    /**
    * @param {Number} indiceColuna 
    * @param {Number} valorDefinirNoLugar 
    * @param {Number} funcaoDeCondicao - a função(indiceDaLinhaAtual, indiceDaColunaEmQuestao, vetorDaLinhaAtual, valoresBrutosDaLinha, valorDaColunaAtualDaLinhaAtual, contextoPropiaMatrix) 
    */
    context.zerarColunaOnde = function(indiceColuna, valorDefinirNoLugar=0, funcaoDeCondicao){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }
        
        if( typeof funcaoDeCondicao == 'function' && funcaoDeCondicao != undefined )
        {
            let quantidadeLinhasMatrix = context.getLinhas();

            //Para cada linha
            Vectorization.Vector({
                valorPreencher: 1,
                elementos: quantidadeLinhasMatrix

            }).paraCadaElemento(function(iLinha){
                let vetorDaLinhaAtual = context.getLinha(iLinha),
                    valoresBrutosDaLinha = vetorDaLinhaAtual.valores(),
                    indiceDaLinhaAtual = iLinha,
                    indiceDaColunaEmQuestao = indiceColuna,
                    valorDaColunaAtualDaLinhaAtual = vetorDaLinhaAtual.readIndex(indiceColuna),
                    contextoPropiaMatrix = context;

                let checagemDaFuncaoDeCondicao = funcaoDeCondicao(indiceDaLinhaAtual, indiceDaColunaEmQuestao, vetorDaLinhaAtual, valoresBrutosDaLinha, valorDaColunaAtualDaLinhaAtual, contextoPropiaMatrix);

                if( checagemDaFuncaoDeCondicao == true || checagemDaFuncaoDeCondicao == 'limpar' || checagemDaFuncaoDeCondicao == 'zerar' || checagemDaFuncaoDeCondicao == 'clear' || checagemDaFuncaoDeCondicao == 'clean'){
                    context._definirValorLinha(iLinha, indiceColuna, valorDefinirNoLugar );
                }
            });

        }else{
            throw 'Precisa ter a funcaoDeCondicao';
        }
    }

    context.zerarLinha = function(indiceLinha, valorDefinirNoLugar=0){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        context.getLinha(indiceLinha).substituirElementosPor( Vectorization.Vector({
            valorPreencher: valorDefinirNoLugar,
            elementos: context.columns
        }) );
    }

    /**
    * Aplica um arredondamento sobre os valores deste vetor
    * CUIDADO: isso vai sobrescrever os valores
    * 
    * @param {String} tipoArredondamentoAplicar
    * @returns {Vectorization.Matrix} - a matrix arredondada
    */
    context.aplicarArredondamento = function(tipoArredondamentoAplicar='cima'){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: context.rows

        }).paraCadaElemento(function(i){
            let subVetorAplicarArredondamento = context.getLinha(i);

            if( Vectorization.Vector.isVectorizationVector(subVetorAplicarArredondamento) ){
                subVetorAplicarArredondamento.aplicarArredondamento(tipoArredondamentoAplicar);
            }
        });

        return context;
    }

    /**
    * Vai tornar possivel que voce ande por todos os elementos que estão presentes dentro da coluna especifica que vc passar como parametro.
    * @param {Number} indiceColuna - o indice da coluna em questão
    * @param {Function} callbackPercorrer - callbackPercorrer(valorNoIndiceDeInteresse, iLinha, LinhaMatrix_Vector, context)
    */
    context.percorrerColuna = function(indiceColuna, callbackPercorrer){
        context.paraCadaLinha(function(iLinha){
            let LinhaMatrix_Vector = context.getLinha(iLinha);
            let valorNoIndiceDeInteresse = LinhaMatrix_Vector.lerIndice(indiceColuna);

            callbackPercorrer( 
                      indiceColuna,
                      valorNoIndiceDeInteresse, 
                      iLinha, 
                      LinhaMatrix_Vector, 
                      context 
                    );
        });
    }

    context.paraCadaColuna = context.percorrerColuna;

    /** 
    * Remove amostras duplicadas deste Vectorization.Vector com base em colunas específicas.
    */
    context.distinct = function(){
        const valoresJaVistos = {};
        const valoresUnicos = Vectorization.Matrix([], { flexibilidade: context.flexibilidade });

        context.forEach(function(indice, linhaVector){
            const identificador = linhaVector.raw()
                                             .join('|');

            if( valoresJaVistos[identificador] == undefined ){
                valoresJaVistos[identificador] = true;
                valoresUnicos.push( linhaVector );
            }
        });

        return valoresUnicos;
    }

    /**
    * Vai tornar possivel que voce ande por todos os elementos que estão presentes dentro da coluna especifica que vc passar como parametro.
    * SIMILAR AO context.percorrerColuna, porém ele vai implementar algo mais parecido com o Vectorization.Vector.mapearValores
    * @param {Number} indiceColuna - o indice da coluna em questão
    * @param {Function} callbackMapeamento - callbackMapeamento(valorNoIndiceDeInteresse, iLinha, LinhaMatrix_Vector, context)
    * @returns {Vectorization.Vector} - a coluna após a aplicação desta função
    */
    context.mapearColuna = function(indiceColuna, callbackMapeamento){
        let valoresAposAplicacaoMetodo = Vectorization.Vector([]);

        context.paraCadaLinha(function(iLinha){
            let LinhaMatrix_Vector = context.getLinha(iLinha);
            let valorNoIndiceDeInteresse = LinhaMatrix_Vector.lerIndice(indiceColuna);

            let resultadoAplicacaoFuncao = callbackMapeamento( valorNoIndiceDeInteresse, 
                      iLinha, LinhaMatrix_Vector, context 
                    );

            valoresAposAplicacaoMetodo.adicionarElemento(resultadoAplicacaoFuncao);
        });

        return Vectorization.Vector(valoresAposAplicacaoMetodo);
    }

    /**
    * Vai permitir "Peneirar" os elementos que estão presentes dentro da coluna especifica que vc passar como parametro.
    * SIMILAR AO Vectorization.Vector.filtrarValores
    * @param {Number} indiceColuna - o indice da coluna em questão
    * @param {Function} callbackFiltragem - callbackFiltragem(valorNoIndiceDeInteresse, iLinha, LinhaMatrix_Vector, context)
    * @returns {Vectorization.Vector} - a coluna após a aplicação deste filtro
    */
    context.filtrarColuna = function(indiceColuna, callbackFiltragem){
        let valoresAposAplicacaoMetodo = Vectorization.Vector([]);

        context.paraCadaLinha(function(iLinha){
            let LinhaMatrix_Vector = context.getLinha(iLinha);
            let valorNoIndiceDeInteresse = LinhaMatrix_Vector.lerIndice(indiceColuna);

            if(!callbackFiltragem){
                throw 'Voce precisa passar uma função de filtro!. Não permitido!';
            }

            let resultadoAplicacaoFuncao = callbackFiltragem( valorNoIndiceDeInteresse, 
                      iLinha, LinhaMatrix_Vector, context 
                    );

            let checagemDoFiltro = resultadoAplicacaoFuncao;

            if(checagemDoFiltro == true || checagemDoFiltro == 'incluir' || checagemDoFiltro == 'manter' || checagemDoFiltro == 'keep' || checagemDoFiltro == 'ok'){
                valoresAposAplicacaoMetodo.adicionarElemento(valorNoIndiceDeInteresse);
            }

        });

        return Vectorization.Vector(valoresAposAplicacaoMetodo);
    }

    /**
    * Aplica um "peneiramento" na coluna desta Vectorization.Matrix
    * @param {Number} indiceColuna - o indice da coluna em questão
    * @param {Function} callbackFiltragem - callbackFiltragem(iColuna, elementoNaPosicaoAtual, context)
    * @returns {Vectorization.Matrix} - Esta propia Vectorization.Matrix
    * 
    * CUIDADO: isso vai sobrescrever esta Vectorization.Matrix
    */
    context.aplicarFiltroColuna = function(indiceColuna, callbackFiltragem){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        context.paraCadaLinha(function(iLinha){
            let LinhaMatrix_Vector = context.getLinha(iLinha);
            let LinhaMatrix_Vector_copia = ( LinhaMatrix_Vector || Vectorization.Vector([]) ).duplicar();
            let dadosLinhaMatrix_Vector_Filtrados = Vectorization.Vector( LinhaMatrix_Vector_copia.filtrarValores(callbackFiltragem) );

            if(!callbackFiltragem){
                throw 'Voce precisa passar uma função de filtro!. Não permitido!';
            }

            if( Vectorization.Vector.isVectorizationVector(dadosLinhaMatrix_Vector_Filtrados) ){
                //Atualiza esta Vectorization.Matrix
                LinhaMatrix_Vector.sobrescreverConteudo(
                    Vectorization.Vector( dadosLinhaMatrix_Vector_Filtrados.valores() || [] )
                );

            }else{
                console.warn('Nenhum filtro foi aplicado');
            }

        });

        return context;
    }

    /**
    * Descobre qual que é a maior quantidade de elementos das linhas cadastradas na matrix
    */
    context.getMaiorQuantidadeColunas = function(){
        let primeiraLinha = context.getLinha(0);
        let maiorQuantiaAtualmenteObtida = primeiraLinha.tamanho();
        let quantidadeLinhasMatrix = context.rows;

        Vectorization.Vector({
           valorPreencher: 1,
           elementos: quantidadeLinhasMatrix
           
        }).paraCadaElemento(
            function(i){
                let linhaAtual = context.getLinha(i);
                let tamanhoDaLinhaAtual = linhaAtual.tamanho();
                maiorQuantiaAtualmenteObtida = (maiorQuantiaAtualmenteObtida <= tamanhoDaLinhaAtual) ? tamanhoDaLinhaAtual : maiorQuantiaAtualmenteObtida;
            });

        return maiorQuantiaAtualmenteObtida;
    }

    /**
    Descobre qual que é a linha que tem mais quantidade de elementos.
    */
    context.getMaiorLinha = function(){
        let primeiraLinha = context.getLinha(0);
        let maiorLinha = primeiraLinha;
        let quantidadeLinhasMatrix = context.rows;
        let maiorQuantidadeColunas = context.getMaiorQuantidadeColunas();

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: quantidadeLinhasMatrix
            
         }).paraCadaElemento(
             function(i){
                 let linhaAtual = context.getLinha(i);
                 let tamanhoDaLinhaAtual = linhaAtual.tamanho();
                 if( tamanhoDaLinhaAtual >= maiorQuantidadeColunas ){ maiorLinha = linhaAtual };
             });

        return maiorLinha;
    }

    /**
    * Método que ele vai sair percorrendo cada linha, e vai deixar todas as linhas com a mesma quantidade de elemeentos
    * Se baseando estritamente na quantidade de colunas atual desta Vectorization.Matrix
    */
    context.igualarColunas = function(valorDefinirNoLugar){
        let maiorQuantidadeColunas = context.getMaiorQuantidadeColunas();
        let quantidadeLinhasMatrix = context.rows;

        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: quantidadeLinhasMatrix
            
        }).paraCadaElemento(function(i){
            let linhaAtual = context.getLinha(i);
            let tamanhoDaLinhaAtual = linhaAtual.tamanho();

            if( tamanhoDaLinhaAtual < maiorQuantidadeColunas )
            {
                let quantosElementosFaltam = Math.abs( tamanhoDaLinhaAtual - maiorQuantidadeColunas );
                
                let novoVetorASerAcrescentado = Vectorization.Vector({
                    valorPreencher: valorDefinirNoLugar,
                    elementos: quantosElementosFaltam
                });

                //Vai acrescentar um novo Vectorization.Vector dentro da linha atual desta Vectorization.Matrix
                //Vai usar um método chamado acrescentarVetor do Vectorization.Vector
                linhaAtual.acrescentarVetor(novoVetorASerAcrescentado);
            }
        });
    }

    /**
    * Quase identico ao context.igualarColunas, porém com uma diferença drástica: ele adiciona no inicio da linha
    * 
    * Método que ele vai sair percorrendo cada linha, e vai deixar todas as linhas com a mesma quantidade de elemeentos
    * Se baseando estritamente na quantidade de colunas atual desta Vectorization.Matrix
    */
    context.igualarColunasNoInicio = function(valorDefinirNoLugar){
        let maiorQuantidadeColunas = context.getMaiorQuantidadeColunas();
        let quantidadeLinhasMatrix = context.rows;

        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
        }

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: quantidadeLinhasMatrix
            
        }).paraCadaElemento(function(i){
            let linhaAtual = context.getLinha(i);
            let tamanhoDaLinhaAtual = linhaAtual.tamanho();

            if( tamanhoDaLinhaAtual < maiorQuantidadeColunas )
            {
                let quantosElementosFaltam = Math.abs( tamanhoDaLinhaAtual - maiorQuantidadeColunas );
                
                let novoVetorASerAcrescentado = Vectorization.Vector({
                    valorPreencher: valorDefinirNoLugar,
                    elementos: quantosElementosFaltam
                });

                //Vai acrescentar um novo Vectorization.Vector dentro da linha atual desta Vectorization.Matrix
                //Vai usar um método chamado acrescentarVetor do Vectorization.Vector
                linhaAtual.acrescentarNoInicioVetor(novoVetorASerAcrescentado.valores());
            }
        });
    }

    context.adicionarEmTodasLinhas = function(){

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
     * Obtem o log10, de cada elemento da matrix 
     * @returns {Vectorization.Matrix}
     */
    context.log10 = function(){
        let matrixA = context.content;
        let novaMatrix = [];
    
        for( let i = 0 ; i < matrixA.length ; i++ )
        {
            novaMatrix[i] = [];
            for( let j = 0 ; j < matrixA[0].length ; j++ )
            {
                novaMatrix[i][j] = Math.log10(matrixA[i][j]);
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

    /**
    * Pega todos os elementos que estão dentro desta Vectorization.Matrix,
    * e deixa todos eles num unico Vectorization.Vector, desprezando as dimensões, e deste modo: concentrando tudo em um unico Vectorization.Vector. 
    * @returns {Vectorization.Vector}
    */
    context.planificar = function(){
        let novoVetorASerRetornado = Vectorization.Vector([]);
        Vectorization.Matrix(context.duplicar())
        .paraCadaLinha(
            function(iLinha, vetorDaLinha){
                const vetorDaLinha_Vector = Vectorization.Vector.isVectorizationVector(vetorDaLinha) ? vetorDaLinha : Vectorization.Vector(vetorDaLinha);
                novoVetorASerRetornado.acrescentarVetor( Vectorization.Vector( vetorDaLinha_Vector ).duplicar() );
            }); 

        return Vectorization.Vector(novoVetorASerRetornado);
    }

    /**
    * DIFERENTE DO context.extrairValoresColuna
    * Esse método extrai os valores de uma ou mais colunas,
    * NOTA: Isso vai retornar um Vectorization.Vector para cada coluna
    * e não recortar colunas da Vectorization.Matrix, então o resultado não será um Vectorization.Matrix
    * o resultado será um Vectorization.Vector, conteundo outros Vectorization.Vector(as colunas)
    * @param {Vectorization.Vector || Array} listaColunas - um Vectorization.Vector de indices(numeros inteiros)
    * @returns {Vectorization.Vector}
    */
    context.extrairValoresColunas = function( listaColunas='todasColunas' ){
        let listaColunas_Vector = listaColunas != 'todasColunas' ?
                                  Vectorization.Vector.isVectorizationVector(listaColunas) == false ? Vectorization.Vector(listaColunas) : listaColunas : 'todasColunas';
    
        let colunasExtraida = Vectorization.Vector([], {usarEscalares: false});

        if( listaColunas == 'todasColunas' ){
           //Para cada coluna
           Vectorization.Vector({
              valorPreencher: 1,
              //Vai criar uma iteração em cada coluna
              elementos: matrix1.columns

           }).paraCadaElemento(function(j, numeroColuna){
               let valoresExtraidosColunaAtual = context.extrairValoresColuna(numeroColuna);
               colunasExtraida.adicionarElemento( valoresExtraidosColunaAtual );
           });

        }else{
           //Para cada coluna a ser extraida
           listaColunas_Vector.paraCadaElemento(function(j, numeroColuna){
               let valoresExtraidosColunaAtual = context.extrairValoresColuna(numeroColuna);
               colunasExtraida.adicionarElemento( valoresExtraidosColunaAtual );
           });
        }

        return colunasExtraida;
    }

    /**
    * DIFERENTE DO context.extrairValoresColuna
    * SIMILAR ao context.extrairValoresColunas
    * 
    * Esse método extrai os valores de todas as colunas EXCETO UMA,
    * NOTA: Isso vai retornar um Vectorization.Vector para cada coluna
    * e não recortar colunas da Vectorization.Matrix, então o resultado não será um Vectorization.Matrix
    * o resultado será um Vectorization.Vector, conteundo outros Vectorization.Vector(as colunas)
    * @param {Vectorization.Vector || Array} listaColunas - um Vectorization.Vector de indices(numeros inteiros)
    * @returns {Vectorization.Vector}
    */
    context.extrairValoresColunasExceto = function(numeroColunaIgnorar){
        let colunasExtraida = Vectorization.Vector([], {usarEscalares: false});

        //Para cada coluna
        Vectorization.Vector({
            valorPreencher: 1,
            //Vai criar uma iteração em cada coluna
            elementos: matrix1.columns

        }).paraCadaElemento(function(j, numeroColuna){
            if( j != numeroColunaIgnorar )
            {
                let valoresExtraidosColunaAtual = context.extrairValoresColuna(j);
                colunasExtraida.adicionarElemento( valoresExtraidosColunaAtual );
            
            }else{
                //Faz nada, IGNORA
            }
        });

        return colunasExtraida;
    }

    /**
     * Faz o onehot em uma coluna especifica
     * retorna um Vectorization.Vector, contendo outros Vectorization.Vector(coluna) contendo valores booleanos,
     * para cada valor unico na coluna especifica ele vai percorrer cada valor existente na coluna especifica(numeroColuna), e verificar se o item atual da coluna da matrix é igual a esse valor unico atual
     * se sim, então vai colocar 1, caso contrario vai colocar 0
     * 
     * NOTA: Isso só faz o onehot para uma unica coluna especifica
     * e retorna um Vectorization.Vector para cada valor unico da coluna especifica a ser codificada
     * 
     * @param {Number} numeroColuna 
     * @param {Vectorization.Vector} dadosColunaAtual 
     * @returns {Vectorization.Vector}
     */
    context.aplicarCodificacaoONEHOT = function(numeroColuna, dadosColunaAtual){
        const valoresUnicosColunaAtual = dadosColunaAtual.valoresUnicos();

        //Cria as colunas que serão usadas
        const novasColunas_COLUNA_ATUAL = Vectorization.Vector({
            valorPreencher: Vectorization.Vector([], {usarEscalares: false}),
            elementos: valoresUnicosColunaAtual.elementos
        }, {
            usarEscalares: false
        });

        //Percorre essa numeroColuna coluna da matrix
        context.paraCadaLinha(function(ii){
            let dadosLinha = context.getLinha(ii);
            let dadosLinhaNACOLUNA = dadosLinha.lerIndice(numeroColuna);

            for( let jj = 0 ; jj < valoresUnicosColunaAtual.elementos ; jj++ )
            {
                const valorUnico = valoresUnicosColunaAtual.lerIndice(jj);
                const isIgual = dadosLinhaNACOLUNA.raw() == valorUnico;

                if( isIgual == true ){
                    novasColunas_COLUNA_ATUAL.lerIndice(jj)
                                             .adicionarElemento(1);

                }else{
                    novasColunas_COLUNA_ATUAL.lerIndice(jj)
                                             .adicionarElemento(0);
                }
            }
        });

        return novasColunas_COLUNA_ATUAL;
    }

    /**
    * Faz o onehot nas colunas definidas
    * @param {Number} numeroColunasQuero
    * @returns {Object} - objeto onde voce pode obter Vectorization.Vector(s) ou uma Vectorization.Matrix com os valores inclusos
    */
    context.oneHotColunas = function(numeroColunasQuero){
        const colunas_Vetor = context.extrairValoresColunas(numeroColunasQuero);

        /*
        * Vai fazer a codificação de cada coluna passada em numeroColunasQuero, 
        * E armazenar aqui no resultadoOperacao
        */
        const resultadoOperacao = Vectorization.Vector([], {usarEscalares: false});
        const resultadoMatrix = context.duplicar();

        //Para cada coluna que quero aplicar
        colunas_Vetor.paraCadaElemento(function(i){
            
            //Obtenho os dados da coluna
            const dadosColunaAtual = colunas_Vetor.lerIndice(i);
            const dadosCodificadosColunaAtual = context.aplicarCodificacaoONEHOT( i , dadosColunaAtual );
        
            resultadoOperacao.adicionarElemento(dadosCodificadosColunaAtual);

            //Vai jogando tudo isso dentro da Vectorization.Matrix copiada
            dadosCodificadosColunaAtual.paraCadaElemento(function(jColuna, elementoColuna){
                if( 
                    Vectorization.Vector.isVector( elementoColuna ) == true || 
                    Vectorization.BendableVector.isBendableVector( elementoColuna ) == true 
                ){
                    resultadoMatrix.adicionarColuna(elementoColuna);
                }
            });
        });

        return {
            resultado_vector: resultadoOperacao,
            matrix_incluida: resultadoMatrix,

            raw: function(){
                return resultadoOperacao.raw();
            },

            obterMatrix: function(){
                return this.matrix_incluida;
            },

            obterVector: function(){
                return this.resultado_vector;
            }
        };
    }

    /**
    * Calcula a correlação entre duas colunas(pelo indice) 
    */
    context.correlationColumns = function(indiceColuna1, indiceColuna2){
        const valoresColuna1 = context.extrairValoresColuna(indiceColuna1);
        const valoresColuna2 = context.extrairValoresColuna(indiceColuna2);
        return valoresColuna1.correlationWith( valoresColuna2 );
    }

    context._doDefaultBaseAfterCreate();

    //Se a opção advanced estiver ativa, ele roda um método adicional após criar a matrix
    if( context.isAdvancedMatrix == true ){
        context._matrix2Advanced();
    }

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    //Aplica arredondamentos, se o usuario desejar, mesmo não sendo um Vectorization.Matrix aleatoria
    if( context._config != undefined &&
        (
            context._config['aleatorio'] == undefined || context._config['aleatorio'] == false
        ) == true && 
        (
            context._config['arredondar'] != undefined ||
            context.configRecebidaUsuario['arredondar'] != undefined
        ) == true
    ){
        context.aplicarArredondamento(context._config['arredondar'] || context.configRecebidaUsuario['arredondar']);
    }

    //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
    context.bloqueado = (config['bloqueado'] != undefined || classConfig['bloqueado'] != undefined) ? (config['bloqueado'] || classConfig['bloqueado']) : false;

    //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
    if( context._isBloqueado() == true ){
        context.bloquearModificacoes();
    }

    context.isAtributoProtegidoPeloVectorization = function(nomeAtributo){
        let listaAtributosProtegidos = [
            'permitirBloquear'
        ];

        let confereSePodeMexe = listaAtributosProtegidos.indexOf(nomeAtributo) != -1;
        return confereSePodeMexe == true ? true : false;
    }

    /** EXPORTAÇÂO DE DADOS  */

    /**
    * Método auxiliar para fazer download do arquivo CSV.
    * @param {string} conteudo Conteúdo do arquivo.
    * @param {string} nomeArquivo Nome do arquivo.
    */
    context.downloadArquivo = function(conteudo, nomeArquivo) {
        if( VECTORIZATION_BUILD_TYPE == 'navegador' ) {

            const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        }
    }

    /**
    * Exporta os dados de um objeto Vectorization.Matrix para um formato CSV com separador configurável.
    * @param {string|null} downloadArquivo Nome do arquivo para download (opcional).
    * @param {string} separador Separador de colunas (padrão: ',').
    * @returns {string} Conteúdo do CSV.
    */
    context.exportarCSV = function(downloadArquivo = null, separador = ',') {
        let csvConteudo = '';

        // Gera a linha de cabeçalho
        //const linhaCabecalho = Array(context.colunas).fill(0).map((_, index) => `Coluna_${index}`).join(separador);
        //csvConteudo += linhaCabecalho + '\n';

        // Percorre cada linha da matriz
        context.content.forEach(linha => {
            const linhaValores = linha.map( (indice, valor) => {
                // Escapa valores que contêm o separador ou aspas
                if (typeof valor === 'string' && (valor.includes(separador) || valor.includes('"'))) {
                    return `"${valor.replace(/"/g, '""')}"`;
                }
                return valor;
            }).raw().join(separador);

            // Adiciona a linha atual ao conteúdo do CSV
            csvConteudo += linhaValores + '\n';
        });

        //Corta o \n sozinho no final
        if( csvConteudo.endsWith('\n') ){
            csvConteudo = csvConteudo.slice(0, csvConteudo.length-String('\n').length);
        }

        if( VECTORIZATION_BUILD_TYPE == 'navegador' ) {
            // Faz o download do arquivo, se solicitado
            if (downloadArquivo && downloadArquivo.endsWith('.csv')) {
                context.downloadArquivo(csvConteudo, downloadArquivo);
            }

        //Se for node
        }if( VECTORIZATION_BUILD_TYPE == 'node' ) {

        }

        return csvConteudo;
    }

    /**
    * Exporta os dados de um objeto Vectorization.Matrix para um formato TXT com separador configurável.
    * @param {string|null} downloadArquivo Nome do arquivo para download (opcional).
    * @param {string} separador Separador entre valores (padrão: tabulação '\t').
    * @returns {string} Conteúdo do TXT.
    */
    context.exportarTXT = function(downloadArquivo = null, separador = '\t') {
        let txtConteudo = '';

        // Gera as linhas do conteúdo TXT
        context.content.forEach(linha => {
            const linhaValores = linha.map( (indice, valor) => {
                // Formata o valor, se necessário
                if (typeof valor === 'string' && (valor.includes(separador) || valor.includes('"'))) {
                    return `"${valor.replace(/"/g, '""')}"`;
                }
                return valor;
            }).raw().join(separador);

            // Adiciona a linha ao conteúdo do TXT
            txtConteudo += linhaValores + '\n';
        });

        //Corta o \n sozinho no final
        if( txtConteudo.endsWith('\n') ){
            txtConteudo = txtConteudo.slice(0, txtConteudo.length-String('\n').length);
        }

        if( VECTORIZATION_BUILD_TYPE == 'navegador' ) {
            // Faz o download do arquivo, se solicitado
            if (downloadArquivo && downloadArquivo.endsWith('.txt')) {
                context.downloadArquivo(txtConteudo, downloadArquivo);
            }

        //Se for node
        }else if( VECTORIZATION_BUILD_TYPE == 'node' ) {

        }

        return txtConteudo;
    }

    /**
	* Exporta os dados deste Vectorization.Matrix para um formato JSON
	*/
	context.exportarJSON = function( downloadArquivo=null ){
		
        if( VECTORIZATION_BUILD_TYPE == 'navegador' ) {
            if(downloadArquivo && downloadArquivo.endsWith('.json') ){
                context.downloadArquivo( context.raw() , downloadArquivo );
            }

        //Se for node
        }if( VECTORIZATION_BUILD_TYPE == 'node' ) {
            
        }

		return context.raw();
	}

    /** IMPORTAR DADOS */

	/**
	* Carrega um arquivo CSV do computador via upload e injeta dentro deste DataStructure
	* @param {Function} callback
	* @param {string} separador Separador usado no CSV (padrão: ',')
	*/
	context.loadCSV = function(callback, separador = ',') {

        if( VECTORIZATION_BUILD_TYPE == 'navegador' ) {
            // Cria dinamicamente o elemento <input> do tipo "file"
            const inputFile = document.createElement("input");
            inputFile.type = "file";
            inputFile.accept = ".csv"; // Aceita apenas arquivos CSV

            // Adiciona o evento "change" para capturar o arquivo selecionado
            inputFile.addEventListener("change", function(event) {
                const file = event.target.files[0]; // Obtém o primeiro arquivo selecionado

                if (!file) return; // Caso nenhum arquivo seja selecionado, não faz nada

                const reader = new FileReader();

                // Lê o conteúdo do arquivo como texto
                reader.onload = function() {
                    try {
                        const csvData = reader.result;

                        // Divide as linhas do CSV
                        const linhas = csvData.split(/\r?\n/).filter(linha => linha.trim() !== '');

                        // Processa os dados (demais linhas)
                        const dadosTratados = linhas.map(linha => {
                            const valores = linha.split(separador).map(valor => valor.trim());

                            return valores;
                        });

                        context.content = dadosTratados.map(amostra =>
                            Object.values(amostra)
                        );
                        context._matrix2Advanced();
                        context.atualizarQuantidadeColunasLinhas();

                        context.columns = context.content[0]?.length || 0;
                        context.colunas = context.columns;

                        if (callback) {
                            // Chama o callback com os dados CSV
                            callback(dadosTratados, context);
                        }
                    } catch (error) {
                        console.error("Erro ao carregar o arquivo CSV:", error);
                        alert("O arquivo selecionado não é um CSV válido.");
                    }
                };

                // Lê o arquivo
                reader.readAsText(file);

                // Remove o elemento de input do DOM após a leitura
                document.body.removeChild(inputFile);
            });

            // Adiciona o elemento de input ao DOM para que possa ser utilizado
            document.body.appendChild(inputFile);

            // Simula um clique no input para abrir a janela de seleção de arquivo
            inputFile.click();

        //Se for node
        }if( VECTORIZATION_BUILD_TYPE == 'node' ) {

        }
	}

	/**
	* Carrega um arquivo TXT do computador via upload e injeta dentro deste DataStructure.
	* @param {Function} callback Função a ser chamada após carregar os dados.
	* @param {string} separador Separador usado no TXT (padrão: '\t').
	*/
	context.loadTXT = function(callback, separador = '\t') {

        if( VECTORIZATION_BUILD_TYPE == 'navegador' ) {

            // Cria dinamicamente o elemento <input> do tipo "file"
            const inputFile = document.createElement("input");
            inputFile.type = "file";
            inputFile.accept = ".txt"; // Aceita apenas arquivos TXT

            // Adiciona o evento "change" para capturar o arquivo selecionado
            inputFile.addEventListener("change", function(event) {
                const file = event.target.files[0]; // Obtém o primeiro arquivo selecionado

                if (!file) return; // Caso nenhum arquivo seja selecionado, não faz nada

                const reader = new FileReader();

                // Lê o conteúdo do arquivo como texto
                reader.onload = function() {
                    try {
                        const txtData = reader.result;

                        // Divide as linhas do TXT
                        const linhas = txtData.split(/\r?\n/).filter(linha => linha.trim() !== '');

                        // Processa os dados (demais linhas)
                        const dadosTratados = linhas.map(linha => {
                            const valores = linha.split(separador).map(valor => valor.trim());

                            return valores;
                        });

                        context.content = dadosTratados.map(amostra =>
                            Object.values(amostra)
                        );
                        context._matrix2Advanced();
                        context.atualizarQuantidadeColunasLinhas();

                        context.columns = context.content[0]?.length || 0;
                        context.colunas = context.columns;

                        if (callback) {
                            // Chama o callback com os dados TXT
                            callback(dadosTratados, context);
                        }
                    } catch (error) {
                        console.error("Erro ao carregar o arquivo TXT:", error);
                        alert("O arquivo selecionado não é um TXT válido.");
                    }
                };

                // Lê o arquivo
                reader.readAsText(file);

                // Remove o elemento de input do DOM após a leitura
                document.body.removeChild(inputFile);
            });

            // Adiciona o elemento de input ao DOM para que possa ser utilizado
            document.body.appendChild(inputFile);

            // Simula um clique no input para abrir a janela de seleção de arquivo
            inputFile.click();

        //Se for node
        }else if( VECTORIZATION_BUILD_TYPE == 'node' ) {

        }
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
          //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Matrix
          if( target._isBloqueado() == true ){
            throw 'Este Vectorization.Matrix está bloqueado para novas gravações!';
          }

          //Outros casos barrar
          if( prop == 'bloqueado' || prop == 'permitirDesbloquear' || context.isAtributoProtegidoPeloVectorization(prop) ){
            throw 'Você não pode modificar esta atributo do Vectorization.Matrix!';
          }

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

window.Vectorization.Matrix.isVectorizationMatrix = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Matrix');
}

module.exports = window.Vectorization.Matrix;