/*
 * File Name: Vector.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/

//Compatibilidade com NodeJS
if( typeof window === 'undefined' ){
    global.window = global; 
    require('./Scalar');
    require('./Root');
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Vector = function( config=[], classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Vector._translations || null;

    let classeBaseVector = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseVector.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    //Se o usuario tentar criar um vetor a partir de outro vetor, ele recria o propio vetor passado, mantendo a estrutura como ainda sendo um Vector
    if( Vectorization.Vector.isVector(config) && config.objectName == 'Vector' ){
        return Vectorization.Vector( config.values() );
    }

    let context = window.Vectorization.Base(classConfig);
    context.objectName = 'Vector';
    context.path = 'Vectorization.Vector';
    context.configRecebidaUsuario = config;

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    //classConfig = context.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    //Aplica a tradução dos atributos também no config, EXCETO SE config FOR UM ARRAY
    if( config instanceof Object && !(config instanceof Array && (config instanceof Array || Vectorization.Vector.isVector(config) )) ){
        config = context.translateAttributes_andReturn(config, classConfig['translations']() );
    }

    context.initialColumnValue = config['fillValue'] || 0;
    context.content = [];

    context.permitirDesbloquear = (config['permitirDesbloquear'] != undefined || classConfig['permitirDesbloquear'] != undefined) ? (config['permitirDesbloquear'] || classConfig['permitirDesbloquear']) : true;
    context.permitirBloquear = (config['permitirBloquear'] != undefined || classConfig['permitirBloquear'] != undefined) ? (config['permitirBloquear'] || classConfig['permitirBloquear']) : true;

    context._isBloqueado = function(){
        if( context.bloqueado != undefined && context.bloqueado == true ){
            return true;
        }
        return false;
    }

    context.bloquearModificacoes = function(){
        if( context.permitirBloquear == true ){
            context.bloqueado = true;

            if(context.usarEscalares != undefined && context.usarEscalares == true)
            {
                //Bloquear também os filhos dentro deste Vectorization.Vector
                context.paraCadaElemento(function(i, elementoVetor){
                    elementoVetor.bloquearModificacoes();
                });
            }

        }else{
            throw 'Ação não permitida para este Vectorization.Vector!';
        }
    }

    context.desbloquearModificacoes = function(){
        if( context.permitirDesbloquear == true ){
            context.bloqueado = false;

            if(context.usarEscalares != undefined && context.usarEscalares == true)
            {
                //Desbloquear também os filhos dentro deste Vectorization.Vector
                context.paraCadaElemento(function(i, elementoVetor){
                    elementoVetor.desbloquearModificacoes();
                });
            }
            
        }else{
            throw 'Ação não permitida para este Vectorization.Vector!';
        }
    }

    context.trocarValoresAleatorios = function(novoMinimo=null, novoMaximo=null, novaSemente=null){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }
        
        if( context.usarEscalares == true )    
        {
            context.paraCadaElemento(function(i, elementoVetor){
                elementoVetor.trocarNumeroAleatorio(novoMinimo, novoMaximo, novaSemente);
            });

        }else{
            context.substituirElementosPor(
                context.mapearValores(function(i, elementoVetor){
                    return Vectorization.Scalar({
                        aleatorio: true,
                        minimo: 0,
                        maximo: 10
                    }).trocarNumeroAleatorio(novoMinimo, novoMaximo, novaSemente);
                })
            );
        }

        return context;
    }

    context._update = function(){
        context.length = config.length;
        context.elementos = config.length;
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
            if( Vectorization.Vector.isVectorizationVector(context.initialColumnValue) == true ||
                Vectorization.Matrix.isMatrix(context.initialColumnValue) == true
            ){
                context.content[i] = context.initialColumnValue.duplicar();

            }else{
                context.content[i] = context.initialColumnValue;
            }
        }
    }

    /**
     * Permite definir uma posição especifica deste vetor
     * @param {Number} indice 
     * @param {any} valor 
     */
    context.definirElementoNoIndice = function(indice, valor){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        context.content[indice] = valor;
    }

    context.estaVazio = function(){
        return context.tamanho() == 0 ? true : false;
    }
    context.isVazio = context.estaVazio;

    /**
     * Permite trocar todos os valores deste vetor, elemento a elemento
     * por valores que vem de outro vetor, com a mesma quantidade de elementos
     * 
     * @param {Vectorization.Vector} outroVector - O outro vetor que contem os valores
     * @returns {Vectorization.Vector}
     */
    context.substituirElementosPor = function(outroVector){
        let valoresASeremColocados = (Vectorization.Vector.isVector(outroVector) && Vectorization.Vector.isVectorizationVector(outroVector)) ? outroVector.valores() : outroVector;
        let tamanhoSegundoVetor = (Vectorization.Vector.isVector(outroVector) && Vectorization.Vector.isVectorizationVector(outroVector)) ? outroVector.tamanho() : outroVector.length;

        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        if(context.tamanho() != tamanhoSegundoVetor){
            throw 'O tamanho do outroVetor precisa ser o mesmo!';
        }
        
        if( context.tamanho() > 0 )
        {
            Vectorization.Vector(context.content).paraCadaElemento(function(indiceTrocar, elementoTrocar){
                context.definirElementoNoIndice(indiceTrocar, valoresASeremColocados[indiceTrocar]);
            });

        }else{
            throw 'O Vectorization.Vector não pode estar vazio!';
        }

        return valoresASeremColocados;
    }

    /**
     * Permite trocar todos os valores deste vetor, PORÈM não elemento a elemento
     * Ele vai casar os indices deste Vectorization.Vector com o vetor de objetos que identificam os indices e os valores
     * 
     * @param {Vectorization.Vector} outroVectorDeInformacoes - O outro vetor que contem os valores
     * @returns {Vectorization.Vector}
     */
    context.substituirElementosPorIndice = function(outroVectorDeInformacoes){
        let valoresASeremColocados = (Vectorization.Vector.isVector(outroVectorDeInformacoes) && Vectorization.Vector.isVectorizationVector(outroVectorDeInformacoes)) ? outroVectorDeInformacoes.valores() : outroVectorDeInformacoes;
    
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        if( context.tamanho() > 0 )
        {
            Vectorization.Vector(valoresASeremColocados).paraCadaElemento(function(indice, elementoComAsInformacoes){
                let indiceTrocar = elementoComAsInformacoes.indice;
                let valorASerColocado = elementoComAsInformacoes.valor;
                
                context.definirElementoNoIndice(indiceTrocar, valorASerColocado);
            });

        }else{
            throw 'O Vectorization.Vector não pode estar vazio!';
        }

        return context;
    }

    context.values = function(){
        return context.content;
    }

    //Alias for context.values
    context.valores = context.values;

    context.toArray = function(){
        if( context.usarEscalares != undefined && context.usarEscalares == true )
        {
            let valoresSemEstarEmEscalar = [];
            Vectorization.Vector(context.duplicar()).paraCadaElemento(function(i, objetoEscalar){
                valoresSemEstarEmEscalar.push( objetoEscalar.obterValor() );
            });

            return valoresSemEstarEmEscalar;

        }else{
            return context.content;
        }
    }

    //Alias for context.toArray
    context.raw = context.toArray;

    /**
    * Obtem um novo Vector exatamente igual a este Vector
    * Ou seja, faz uma copia do propio objeto, identido, porém sem manter as referencias. 
    * @returns {Vectorization.Vector}
    */
    context.duplicar = function(){
        let novoVector = [];
        
        for( let i = 0 ; i < context.length ; i++ )
        {
            novoVector.push( context.readIndex(i) );
        }

        return Vectorization.Vector(novoVector);
    }

    //Alias for duplicar
    context.clonar = context.duplicar;


    //Alias for context.content
    context.conteudo = context.content;

    context.sizeOf = function(){
        return context.length;
    }

    context.tamanho = function(){
        return context.sizeOf();
    }

    context.push = function(element){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        context.content.push(element);
        context._update();
    }
    context.adicionarElemento = context.push;

    context.adicionarElementoNoInicio = function(elemento){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }
        
        context.content.unshift(elemento);
        context._update();
    }

    context.readIndex = function(i){
        return context.content[i];
    }

    /**
    * @param {Function} funcao 
    * @returns {Vectorization.Vector} - o propio Vectorization.Vector
    * 
    * CUIDADO: isso vai modificar este propio Vectorization.Vector
    */
    context.aplicarFuncao = function(funcao){
        context.substituirElementosPor(
            context.mapearValores(function(indice, elementoVetor){
                return funcao(elementoVetor, indice);
            })
        );

        return context;
    }

    context.valorMinimo = function(){
        let valoresAnalisar = context.duplicar();
        let menorValorEncontrado = valoresAnalisar.readIndex(0);

        // Verificar se o vetor não está vazio
        if (valoresAnalisar.elementos == 0) {
            throw 'Este Vectorization.Vector não tem nada dentro.';
        }

        valoresAnalisar.paraCadaElemento(function(i){
            const elemento = valoresAnalisar.readIndex(i);

            if( elemento < menorValorEncontrado )
            {
                menorValorEncontrado = elemento;
            }
        });

        return menorValorEncontrado;
    }

    context.valorMaximo = function(){
        let valoresAnalisar = context.duplicar();
        let maiorElementoEncontrado = valoresAnalisar.readIndex(0);

        // Verificar se o vetor não está vazio
        if (valoresAnalisar.elementos == 0) {
            throw 'Este Vectorization.Vector não tem nada dentro.';
        }

        valoresAnalisar.paraCadaElemento(function(i){
            const elemento = valoresAnalisar.readIndex(i);

            if( elemento > maiorElementoEncontrado )
            {
                maiorElementoEncontrado = elemento;
            }
        });

        return maiorElementoEncontrado;
    }

    context.indexOf = function(elemento, comecandoAPartirDoIndice){
        return Vectorization.Vector(context).duplicar().content.indexOf(elemento, comecandoAPartirDoIndice);
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
            let ultimoEstadoRetornado = callback( i, context.content[i], context );
    
            if( ultimoEstadoRetornado instanceof Object )
            {
                ultimoEstadoRetornado.propriedadesControle = {};

                switch(ultimoEstadoRetornado.acao){
                    case 'parar':
                    case 'parar_loop':
                    case 'interromper':
                    case 'stop':
                        ultimoEstadoRetornado.propriedadesControle.vaiPararLoop = true;
                        break;

                    case 'reiniciar':
                    case 'reiniciar_loop':
                    case 'restart':
                        i = 0;
                        break;

                    case 'ir_indice':
                    case 'ir_iteracao':
                    case 'go_iteration':
                        if( ultimoEstadoRetornado.valor != undefined )
                        {
                            i = ultimoEstadoRetornado.valor;
                        }else{
                            throw 'Não é possivel ir para uma iteração sem um numero';
                        }
                        break;
                }

                //Interromper este loop
                if( ultimoEstadoRetornado.propriedadesControle.vaiPararLoop == true ){
                    break;
                }
            }
        }
    }

    /**
    * Percorre cada elemento do vetor, aplicando uma função de callback, porém faz isso de forma contrária/revertida
    * @param {Function} callback(index, element, context)
    */
    context.paraCadaElementoReverso = function(callback){
        let valorComecar = context.tamanho()-1;
        let valorVaiInterromper = 0;
        let vaiParar = false;

        for( let i = valorComecar ; vaiParar == false ; i-- )
        {
            if( i > valorVaiInterromper ){
                vaiParar = false;
            }else{
                //Brecar aqui
                vaiParar = true;
            }

            callback(
                     //O indice
                     i, 
                     //O elemento atual
                     context.content[i],
                     //O propio contexto deste Vectorization.Vector 
                     context
                    );
        }
    }

    /**
    * Percorre cada elemento do vetor, aplicando uma função de callback, retornando um resultado
    * @param {Function} callback(index, element, context)
    * @returns {Vectorization.Vector}
    */
    context.map = function(callback){
        let novoVetor = [];

        for( let i = 0 ; i < context.content.length ; i++ )
        {
            novoVetor[i] = callback( i, context.content[i], context );
        }

        return Vectorization.Vector(novoVetor);
    }

    /**
    * Percorre cada elemento do vetor, aplicando uma função de filtro, retornando um resultado que é filtrado de forma rígida.
    * Isso ignora elementos que não atendam aos critérios que voce estabeleceu na função de filtro
    * @param {Function} callback(index, element, context)
    * @returns {Vectorization.Vector} - um novo Vectorization.Vector
    */
    context.filtrar = function(funcaoDeFiltro, incluirDetalhes=false){
        let novoVetor = Vectorization.Vector([]);

        if(!funcaoDeFiltro){
            throw 'Voce precisa passar uma função de filtro!. Não permitido!';
        }

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: context.tamanho()

        }).paraCadaElemento(function(i, element, contextoLoop){
            let checagemDoFiltro = funcaoDeFiltro( i, context.content[i], context );

            if(checagemDoFiltro == true || checagemDoFiltro == 'incluir' || checagemDoFiltro == 'manter' || checagemDoFiltro == 'keep' || checagemDoFiltro == 'ok'){
                if( incluirDetalhes == true ){
                    novoVetor.adicionarElemento({
                        valor: context.content[i],
                        indice: i,
                        parIndiceValor: [i, context.content[i]],
                        terminouExecutarFiltro: new Date().getTime(),
                        resultadoFuncaoFiltro: checagemDoFiltro,
                        context: context
                    });

                }else{
                    novoVetor.adicionarElemento( context.content[i] );
                }
            }
        });

        return Vectorization.Vector( novoVetor.valores() );
    }

    context.sobrescreverConteudo = function(novoConteudoDoVetor){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        context.content = Vectorization.Vector.isVectorizationVector( novoConteudoDoVetor ) ? novoConteudoDoVetor.valores() : novoConteudoDoVetor;
        context.conteudo = context.content;
    }

    /**
    * Similar ao context.filtrar
    * Percorre cada elemento do vetor, aplicando uma função de filtro, retornando um resultado que é filtrado de forma rígida.
    * Isso ignora elementos que não atendam aos critérios que voce estabeleceu na função de filtro
    * 
    * CUIDADO: Este método vai sobrescrever os valores deste Vectorization.Vector
    */
    context.aplicarFiltro = function(funcaoDeFiltro){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        context.sobrescreverConteudo(
            Vectorization.Vector(
                context.filtrar(funcaoDeFiltro, incluirDetalhes=true)

            ).mapearValores(function(indiceAtual, valorAtual){
                //Se for um objeto retornado pela função filtrar
                if(typeof valorAtual == 'object')
                {
                    return valorAtual.valor;
                }else{
                    return valorAtual;
                }
            })
        );
    }

    //Preenche tudo com um unico valor especifico
    context.preencherTudo = function(valorEspecifico){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        context.paraCadaElemento(function(indicePreencher, elemento, contextoVetor){
            context.content[indicePreencher] = valorEspecifico;
        });

        return context;
    }

    /**
    * Similar ao preencherTudo, porém ele só preenche valores que atendam a certo critério simples
    * Neste caso o critério é onde o valorEspecifico apareça no indice deste Vectorization.Vector
    * Mais ele vai preencher todos os valores onde a condição bate
    * @param {any} valorEspecifico 
    * @param {any} novoValorEspecifico 
    * @returns {Vectorization.Vector}
    */
    context.preencherTudoOnde = function(valorEspecifico, novoValorEspecifico){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        context.paraCadaElemento(function(indicePreencher, elemento, contextoVetor){
            let valorNaPosicaoAtualDoVetor = context.readIndex(indicePreencher);

            if( String(valorNaPosicaoAtualDoVetor) == String(valorEspecifico) &&
                String(valorNaPosicaoAtualDoVetor).length == String(valorEspecifico).length
            ){
                context.definirElementoNoIndice(indicePreencher, novoValorEspecifico);
            }
        });

        return context;
    }

    /**
    * Similar ao preencherTudoOnde, só que ele vai preencher só os N primeiros
    * @param {any} valorEspecifico 
    * @param {any} novoValorEspecifico 
    * @returns {Vectorization.Vector} - o propio Vectorization.Vector
    */
    context.preencherAlgunsOnde = function(valorEspecifico, novoValorEspecifico, quantidadeLimitePreencher, direcaoOperar='esquerda'){
        let quantidadeJaPreencheu = 0;
        let valorNaPosicaoAtualDoVetor;

        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        switch(direcaoOperar){
            case 'esquerda':
            case 'left':
            case 'inicio':
                context.paraCadaElemento(function(indicePreencher, elemento, contextoVetor){
                    valorNaPosicaoAtualDoVetor = context.readIndex(indicePreencher);
        
                    if( String(valorNaPosicaoAtualDoVetor) == String(valorEspecifico) &&
                        String(valorNaPosicaoAtualDoVetor).length == String(valorEspecifico).length
                    ){
                        if( quantidadeJaPreencheu < quantidadeLimitePreencher ){
                            context.definirElementoNoIndice(indicePreencher, novoValorEspecifico);
                        }
        
                        quantidadeJaPreencheu++;
                    }
                });
                break;

            case 'direita':
            case 'frente':
            case 'right':
                context.paraCadaElementoReverso(function(indicePreencher, elemento, contextoVetor){
                    valorNaPosicaoAtualDoVetor = context.readIndex(indicePreencher);
        
                    if( String(valorNaPosicaoAtualDoVetor) == String(valorEspecifico) &&
                        String(valorNaPosicaoAtualDoVetor).length == String(valorEspecifico).length
                    ){
                        if( quantidadeJaPreencheu < quantidadeLimitePreencher ){
                            context.definirElementoNoIndice(indicePreencher, novoValorEspecifico);
                        }
        
                        quantidadeJaPreencheu++;
                    }
                });
                break;

            default:
                throw 'Voce precisa dizer em qual direção voce quer usar'
                break;
        }

        return context;
    }

    //Também, se o config for um objeto(NÂO FOR UM ARRAY)
    if( config instanceof Object && !(config instanceof Array && (config instanceof Array || Vectorization.Vector.isVector(config) )) ){
        context.aleatorio = config['aleatorio'] || false;
        
        if( config['aleatorio'] != undefined &&
            config['numeros'] != undefined
        ){
            throw 'Voce não pode criar um Vectorization.Vector com contéudo definido, e ao mesmo tempo sendo aleatório!';
        }

        if( context.aleatorio == true ){
            context.content = []; // Zero o conteudo

            //Se tem outros detalhes
            if( config['minimo'] != undefined && 
                config['maximo'] != undefined && 
                config['elementos'] != undefined &&
                typeof config['minimo'] == 'number' &&
                typeof config['maximo'] == 'number' &&
                typeof config['elementos'] == 'number'
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
                while( context.content.length < config['elementos'] )
                {
                    let numeroAleatorioGeradoParaOIndice = Vectorization.Random.gerarNumeroAleatorio( Number(context.minimoAleatorio), Number(context.maximoAleatorio), context.sementeAleatoria );
                    context.adicionarElemento( numeroAleatorioGeradoParaOIndice );
                }

                //Se o programador quiser arredondar
                if( config['arredondar'] != undefined ){
                    switch(config['arredondar']){
                        case true:
                            context.substituirElementosPor(
                                Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                                    return Math.round(valor);
                                }).valores()
                            );
                            break;

                        case 'cima':
                        case 'up':
                            context.substituirElementosPor(
                                Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                                    return Math.ceil(valor);
                                }).valores()
                            );
                            break;
            
                        case 'baixo':
                        case 'down':
                            context.substituirElementosPor(
                                Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                                    return Math.floor(valor);
                                }).valores()
                            );
                            break;

                        case 'automatico':
                        case 'auto':
                            context.substituirElementosPor(
                                Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                                    return Math.round(valor);
                                }).valores()
                            );
                            break;
                    }
                }

            }else{
                if( typeof config['minimo'] != 'number' ||
                    typeof config['maximo'] != 'number' ||
                    typeof config['elementos'] != 'number' 
                ){
                    throw 'Os valores minimo, máximo e quantidade de elementos precisam ser números!. Tipo não permitido.'
                
                }else{
                    throw 'Para criar um Vector aleatório voce precisar passar a faixa de valores e a quantidade de elementos!';
                }
            }

            context.conteudo = context.content;
        
        //Se for um objeto, que não possui o atributo "aleatorio"
        }else if(context.aleatorio == false){
            
            if( config['numeros'] != undefined &&
                Vectorization.Vector.isVector(config['numeros'])
            ){
                if( config['aleatorio'] != undefined ){
                    throw 'Voce não pode criar um Vectorization.Vector com contéudo definido, e ao mesmo tempo sendo aleatório!';
                }

                context.content = config['numeros'] != undefined ? 
                                  (Vectorization.Vector.isVectorizationVector(config['numeros']) ? config['numeros'].valores() : 
                                   config['numeros']) : [];

                context.length = context.content.length;
                context.elementos = context.length;
            }

            context.conteudo = context.content;
        }
    }


    /**
    * Retorna os valores deste Vectorization.Vector como arredondados.
    * @param {String} tipoArredondamentoAplicar
    * @returns {Vectorization.Vector}
    */
    context.getValoresArredondados = function(tipoArredondamentoAplicar='cima'){
        let novoVetorArredondado = Vectorization.Vector( context.duplicar() );

        //Se o programador quiser arredondar
        if( tipoArredondamentoAplicar != undefined ){
            switch(tipoArredondamentoAplicar){
                case true:
                    novoVetorArredondado.substituirElementosPor(
                        Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                            return Math.round(valor);
                        }).valores()
                    );
                    break;

                case 'cima':
                case 'up':
                    novoVetorArredondado.substituirElementosPor(
                        Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                            return Math.ceil(valor);
                        }).valores()
                    );
                    break;
    
                case 'baixo':
                case 'down':
                    novoVetorArredondado.substituirElementosPor(
                        Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                            return Math.floor(valor);
                        }).valores()
                    );
                    break;

                case 'automatico':
                case 'auto':
                    novoVetorArredondado.substituirElementosPor(
                        Vectorization.Vector(context.content).mapearValores(function(iValor, valor){
                            return Math.round(valor);
                        }).valores()
                    );
                    break;

                default:
                    if(tipoArredondamentoAplicar != false){
                        throw 'Voce precisa falar que tipo de arredondamento voce quer fazer!';
                    }
                    break;
            }
        }

        return novoVetorArredondado;
    }

    /**
    * Aplica um arredondamento sobre os valores deste vetor
    * CUIDADO: isso vai sobrescrever os valores
    * 
    * @param {String} tipoArredondamentoAplicar
    * @returns {Vectorization.Vector} - o propio vetor
    */
    context.aplicarArredondamento = function(tipoArredondamentoAplicar='cima'){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        context.substituirElementosPor(
            context.getValoresArredondados(tipoArredondamentoAplicar)
        );

        return context;
    }

    /**
    * @param {Vectorization.Vector} novoVetorASerAcrescentado 
    * @returns {Vectorization.Vector} - Este propio Vectorization.Vector sobrescrito(CUIDADO!)
    */
    context.acrescentarVetor = function(novoVetorASerAcrescentado){
        let novoVetorASerAcrescentado_Vector = Vectorization.Vector.isVectorizationVector(novoVetorASerAcrescentado) ? novoVetorASerAcrescentado : Vectorization.Vector(novoVetorASerAcrescentado); 
        let contextoEsteVetor = context;

        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: novoVetorASerAcrescentado_Vector.tamanho()
        })
        .paraCadaElemento(function(i){
            const elementoVetorASerAdicionado = novoVetorASerAcrescentado_Vector.lerIndice(i);
            context.adicionarElemento(elementoVetorASerAdicionado);
        });
    }

    /**
    * Se parece muito ao context.acrescentarVetor, só que aqui, ele vai apenas retornar uma novo Vectorization.Vector, NÂO SUBSTITUI ESTE VETOR
    * @param {Vectorization.Vector} novoVetorASerAcrescentado 
    * @returns {Vectorization.Vector} - Um novo Vectorization.Vector
    */
    context.juntarComOutroVetor = function(novoVetorASerAcrescentado){
        let novoVetorASerAcrescentado_Vector = Vectorization.Vector.isVectorizationVector(novoVetorASerAcrescentado) ? novoVetorASerAcrescentado : Vectorization.Vector(novoVetorASerAcrescentado); 
        let contextoEsteVetor = context;

        let novoVetorASerAcrescentado_VectorFinal = contextoEsteVetor.duplicar();

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: novoVetorASerAcrescentado_Vector.tamanho()
        })
        .paraCadaElemento(function(i){
            const elementoVetorASerAdicionado = novoVetorASerAcrescentado_Vector.lerIndice(i);
            novoVetorASerAcrescentado_VectorFinal.adicionarElemento(elementoVetorASerAdicionado);
        });

        return novoVetorASerAcrescentado_VectorFinal;
    }

    /**
    * Se parece muito ao context.acrescentarVetor, porém ele pôem os elementos no inicio do vetor, ao invés de colocar no final do mesmo
    * @param {Vectorization.Vector} novoVetorASerAcrescentado 
    * @returns {Vectorization.Vector} - Este propio Vectorization.Vector sobrescrito(CUIDADO!)
    */
    context.acrescentarNoInicioVetor = function(novoVetorASerAcrescentado){
        let novoVetorASerAcrescentado_Vector = Vectorization.Vector.isVectorizationVector(novoVetorASerAcrescentado) ? novoVetorASerAcrescentado : Vectorization.Vector(novoVetorASerAcrescentado); 
        let contextoEsteVetor = context;

        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
        if( context._isBloqueado() == true ){
            throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
        }

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: contextoEsteVetor.tamanho()
        })
        .paraCadaElemento(function(i){
            const elementoVetorASerAdicionado = contextoEsteVetor.lerIndice(i);
            novoVetorASerAcrescentado_Vector.adicionarElemento(elementoVetorASerAdicionado);
        });

        let novoVetorASerAcrescentado_VectorFinal = Vectorization.Vector({
            valorPreencher: 1,
            elementos: novoVetorASerAcrescentado_Vector.tamanho()
        });

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: novoVetorASerAcrescentado_VectorFinal.tamanho()
        })
        .paraCadaElemento(function(i){
            novoVetorASerAcrescentado_VectorFinal[i] = novoVetorASerAcrescentado_Vector.lerIndice(i);
        });

        contextoEsteVetor.sobrescreverConteudo(
            novoVetorASerAcrescentado_VectorFinal.duplicar()
                                                 .valores()
        )
    }

    /**
    * Se parece muito ao context.acrescentarNoInicioVetor, só que aqui, ele vai apenas retornar uma novo Vectorization.Vector, NÂO SUBSTITUI ESTE VETOR
    * @param {Vectorization.Vector} novoVetorASerAcrescentado 
    * @returns {Vectorization.Vector} - Um novo Vectorization.Vector
    */
    context.juntarComOutroVetorNoInicio = function(novoVetorASerAcrescentado){
        let novoVetorASerAcrescentado_Vector = Vectorization.Vector.isVectorizationVector(novoVetorASerAcrescentado) ? novoVetorASerAcrescentado.duplicar() : Vectorization.Vector(novoVetorASerAcrescentado).duplicar(); 
        let contextoEsteVetorDuplicado = context.duplicar();

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: contextoEsteVetorDuplicado.tamanho()
        })
        .paraCadaElemento(function(i){
            const elementoVetorASerAdicionado = contextoEsteVetorDuplicado.lerIndice(i);
            novoVetorASerAcrescentado_Vector.adicionarElemento(elementoVetorASerAdicionado);
        });

        let novoVetorASerAcrescentado_VectorFinal = Vectorization.Vector({
            valorPreencher: 1,
            elementos: novoVetorASerAcrescentado_Vector.tamanho()
        });

        Vectorization.Vector({
            valorPreencher: 1,
            elementos: novoVetorASerAcrescentado_VectorFinal.tamanho()
        })
        .paraCadaElemento(function(i){
            novoVetorASerAcrescentado_VectorFinal[i] = novoVetorASerAcrescentado_Vector.lerIndice(i);
        });

        return novoVetorASerAcrescentado_VectorFinal;
    }

    //OUTROS MÉTODOS ABAIXO

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
        let vectorA = context.content;

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
        let vectorA = context.content;

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

    context.removerApenasUm = function(elementoRemover){
        let novoVectorRetirado = Vectorization.Vector([]);
        let vetorPercorrer = context.duplicar();
        let jaFoi = false;

        vetorPercorrer.paraCadaElemento(function(i, elementoVetor){
            if( jaFoi == false && elementoVetor == elementoRemover){
                jaFoi = true;

            }else{
                novoVectorRetirado.adicionarElemento(elementoVetor);
            }
        });

        novoVectorRetirado._update();
        return novoVectorRetirado;
    }

    /**
    * Ordena este Vectorization.Vector em ordem crescente
    * @returns {Vectorization.Vector} - um novo Vectorization.Vector ordenado
    */
    context.ordenarCrescente = function(){
        let novoVectorOrdenado = Vectorization.Vector([]);
        let vetorPercorrer = context.duplicar();
        let vetorTrabalhando = vetorPercorrer.duplicar();

        while( novoVectorOrdenado.elementos != vetorPercorrer.elementos )
        {
            let valorMinimoVetorTrabalhando = vetorTrabalhando.valorMinimo();
    
            let jaFoiAPrimeira = false;
            vetorTrabalhando.paraCadaElemento(function(i, elementoVetor){
                if( jaFoiAPrimeira == false && elementoVetor == valorMinimoVetorTrabalhando ){
                    novoVectorOrdenado.adicionarElemento( elementoVetor );
                    jaFoiAPrimeira = true;
                }
            })

            //Substitui o vetorTrabalhando
            vetorTrabalhando = vetorTrabalhando.removerApenasUm(valorMinimoVetorTrabalhando);
            jaFoiAPrimeira = false;
        }

        return novoVectorOrdenado;
    }

    /**
    * Ordena este Vectorization.Vector em ordem decrescente
    * @returns {Vectorization.Vector} - um novo Vectorization.Vector ordenado
    */
    context.ordenarDecrescente = function(){
        let novoVectorOrdenado = Vectorization.Vector([]);
        let vetorPercorrer = context.duplicar();
        let vetorTrabalhando = vetorPercorrer.duplicar();

        while( novoVectorOrdenado.elementos != vetorPercorrer.elementos )
        {
            let valorMaximoVetorTrabalhando = vetorTrabalhando.valorMaximo();
    
            let jaFoiAPrimeira = false;
            vetorTrabalhando.paraCadaElemento(function(i, elementoVetor){
                if( jaFoiAPrimeira == false && elementoVetor == valorMaximoVetorTrabalhando ){
                    novoVectorOrdenado.adicionarElemento( elementoVetor );
                    jaFoiAPrimeira = true;
                }
            })

            //Substitui o vetorTrabalhando
            vetorTrabalhando = vetorTrabalhando.removerApenasUm(valorMaximoVetorTrabalhando);
            jaFoiAPrimeira = false;
        }

        return novoVectorOrdenado;
    }

    /**
     * Permite dividir este Vectorization.Vector em N partes iguais.
     * @param {Number} numeroPartesDividir 
     * @returns {Vectorization.Vector} - um Vectorization.Vector de outros Vectorization.Vector(s)
     */
    context.dividirEmPartes = function(numeroPartesDividir){
        let esteVetorCopiado = context.duplicar();
        let tamanhosAproximados = Math.round( esteVetorCopiado.elementos / numeroPartesDividir );
        let ondeParou = 0;

        let listaResultadoDivisao = Vectorization.Vector({
            valorPreencher: Vectorization.Vector([]),
            elementos: numeroPartesDividir
        });

        Vectorization.Vector({
            valorPreencher: tamanhosAproximados,
            elementos: numeroPartesDividir
        }).paraCadaElemento(function(iParte, tamanhoParte){

            let quantosJaColocou = 0;
            let jaTerminouEste = false;
            
            Vectorization.Vector(esteVetorCopiado)
            .paraCadaElemento(function(iElemento){
                let elementoAtual = esteVetorCopiado.lerIndice(iElemento);
                let consideradouEsteIndice = ( (ondeParou == 0 || iElemento > ondeParou) == true && quantosJaColocou <= (tamanhoParte-1) == true) == true;
                let jaColocouTudoDaParte = (quantosJaColocou <= (tamanhoParte-1)) == false;

                if( jaTerminouEste == false && (ondeParou == 0 || iElemento > ondeParou) && quantosJaColocou <= (tamanhoParte-1) )
                {
                    listaResultadoDivisao.lerIndice(iParte)
                                         .adicionarElemento(elementoAtual);

                    ondeParou = iElemento;
                    quantosJaColocou++;
                    
                }else{
                    //Se ele pulou o indice por que ainda não começou a faixa de valores do proximo pedaço, ele ignora e não vai marcar que ja terminou
                    if( jaColocouTudoDaParte == true ){
                        jaTerminouEste = true;

                        //Vai parar o loop do iElemento
                        return {
                            acao: 'parar_loop'
                        }
                    }
                }

            });
        })

        return Vectorization.Vector(listaResultadoDivisao);
    }
    context.split = context.dividirEmPartes;

    /**
     * Verifica se este Vectorization.Vector está ordenado de forma crescente
     * @returns {Boolean}
     */
    context.isOrdenadoCrescente = function(){
        let esteVetorCopiado = context.duplicar();
        let estaOrdenado = true;
        Vectorization.Vector(esteVetorCopiado)
        .paraCadaElemento(function(i){
            let elementoAtual = esteVetorCopiado.readIndex(i);
            let elementoMaisUm = esteVetorCopiado.readIndex(i+1) || NaN;
            let elementoMenosUm = esteVetorCopiado.readIndex(i-1) || NaN;

            if( elementoMaisUm < elementoAtual || elementoMenosUm > elementoAtual ){
                estaOrdenado = false;

                return {
                    acao: 'parar_loop'
                }
            }
        });

        return estaOrdenado;
    }

    /**
     * Verifica se este Vectorization.Vector está ordenado de forma decrescente
     * @returns {Boolean}
     */
    context.isOrdenadoDecrescente = function(){
        let esteVetorCopiado = context.duplicar();
        let estaOrdenado = true;
        Vectorization.Vector(esteVetorCopiado)
        .paraCadaElemento(function(i){
            let elementoAtual = esteVetorCopiado.readIndex(i);
            let elementoMaisUm = esteVetorCopiado.readIndex(i+1) || NaN;
            let elementoMenosUm = esteVetorCopiado.readIndex(i-1) || NaN;

            if( elementoMaisUm > elementoAtual || elementoMenosUm < elementoAtual ){
                estaOrdenado = false;

                return {
                    acao: 'parar_loop'
                }
            }
        });

        return estaOrdenado;
    }

    /**
     * Verifica se este Vectorization.Vector está ordenado de forma crescente ou então decrescente
     * @returns {Boolean}
     */
    context.isOrdenado = function(){
        return (context.isOrdenadoCrescente() || context.isOrdenadoDecrescente());
    }
    context.estaOrdenado = context.isOrdenado;
    context.estiverOrdenado = context.estaOrdenado;
    context.estiverOrdenadoCrescente = context.isOrdenadoCrescente;

    context.primeiroItem = function(){
        return context.lerIndice(0);
    }

    context.segundoItem = function(){
        return context.lerIndice(1);
    }

    /**
    * @param {Number} numeroQuerendoPesquisar 
    * @returns {Object}
    */
    context.pesquisaBinaria = function(numeroQuerendoPesquisar, naoChecarOrdenacao=false){
        let resultado = {
            encontrou: false,
            indiceAchou: -1
        };

        if( naoChecarOrdenacao == true || context.estiverOrdenadoCrescente() )
        {
            let esteVetorCopiado = context.duplicar();
            let esteVetor_dividido = esteVetorCopiado.dividirEmPartes(2);
            let tamanhoEsteVetor = esteVetorCopiado.elementos;
            let tamanhoEsteVetor_pelaMetade = Math.round( tamanhoEsteVetor/2 );

            let parte1 = esteVetor_dividido.primeiroItem(),
                parte2 = esteVetor_dividido.segundoItem();

            if( numeroQuerendoPesquisar >= esteVetorCopiado.lerIndice(tamanhoEsteVetor_pelaMetade) ){
                resultado.indiceAchou = parte2.indiceDe(numeroQuerendoPesquisar);
                resultado.encontrou = resultado.indiceAchou > -1 ? true : false;

            }else{
                resultado.indiceAchou = parte1.indiceDe(numeroQuerendoPesquisar);
                resultado.encontrou = resultado.indiceAchou > -1 ? true : false;
            }   

        }else{
            throw 'Você precisa ordenar primeiro em ordem crescente!';
        }

        return resultado;
    }

    /**
    * Método que converte este Vectorization.Vector para um Vectorization.Vector avançado, onde cada elemento dentro do mesmo é um Vectorization.Scalar
    */
    context._vectorElementos2Escalares = function(vectorClassConfig={}){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            const extraPropsOfLine = {... vectorClassConfig};
            context.content[i] = Vectorization.Scalar(context.content[i], extraPropsOfLine);
        }
    }

    if( context.configRecebidaUsuario['usarEscalares'] != undefined || classConfig['usarEscalares'] != undefined ){
        if( context.configRecebidaUsuario['usarEscalares'] == true || classConfig['usarEscalares'] == true )
        {
            context.usarEscalares = true;
            context._vectorElementos2Escalares();
        }
    }

    context._doDefaultBaseAfterCreate();

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    //Aplica arredondamentos, se o usuario desejar, mesmo não sendo um Vectorization.Vector aleatorio
    if( context._config != undefined &&
        (
            context._config['aleatorio'] == undefined || context._config['aleatorio'] == false
        ) == true && 
        (
            context._config['arredondar'] != undefined ||
            context.configRecebidaUsuario['arredondar'] != undefined
        ) == true
    ){
        context.aplicarArredondamento(
            context._config['arredondar'] != undefined ? context._config['arredondar'] : context.configRecebidaUsuario['arredondar'] 
        );
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

    //Se tiver uma função a ser aplicada por cima de tudo
    if( config['funcaoAplicar'] != undefined || classConfig['funcaoAplicar'] != undefined ){
        context.aplicarFuncao( config['funcaoAplicar'] || classConfig['funcaoAplicar'] );
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
          //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
          if( target._isBloqueado() == true ){
             throw 'Este Vectorization.Vector está bloqueado para novas gravações!';
          }

          //Outros casos barrar
          if( prop == 'bloqueado' || prop == 'permitirDesbloquear' || context.isAtributoProtegidoPeloVectorization(prop) ){
             throw 'Você não pode modificar esta atributo do Vectorization.Vector!';
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
window.Vectorization.Vector.isVector = function(obj){
    return ((obj.objectName != undefined && obj.objectName == 'Vector') || 
           Array.isArray(obj)) ? true : false;
}

window.Vectorization.Vector.isVectorizationVector = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Vector')
}

module.exports = window.Vectorization.Vector;