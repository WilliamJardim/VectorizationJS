/*
 * File Name: BendableVector.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
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

window.Vectorization.BendableVector = function( config=[], classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.BendableVector._translations || null;

    let classeBaseVector = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseVector.translateAttributes_andReturn(classConfig, classConfig['translations']() );
    
    //Este Vectorization.BendableVector NÂO usa números, em vez disso, vamos especificar o que queremos
    classConfig['usarEscalares'] = false;

    //Se o usuario tentar criar um vetor a partir de outro vetor, ele recria o propio vetor passado, mantendo a estrutura como ainda sendo um Vector
    if( Vectorization.BendableVector.isVectorizationBendableVector(config) && config.objectName == 'BendableVector' ){
        return Vectorization.BendableVector( config.values(), classConfig );
    }

    //O StringVector será baseado no Vectorization.Vector
    let context = window.Vectorization.Vector(config, classConfig);
    context.objectName = 'BendableVector';
    context.extendedFrom = 'Vector';
    context.path = 'Vectorization.BendableVector';
    context.configRecebidaUsuario = config;
    
    context.storedClassConfig = classConfig || {};

    context.flexibilidade = classConfig['flexibilidade'] || false;

    if( context.flexibilidade ){
        if( context.flexibilidade.length != context.content.length ){
            throw 'o array flexibilidade precisa conter a mesma quantidade de elementos deste Vectorization.Vector'
        }
    }

    context.toText = function(){
        let novasConfiguracoes = {... context.storedClassConfig};
        return Vectorization.StringVector( context.raw(), novasConfiguracoes);
    }

    context.toScalar = function(){
        let novasConfiguracoes = {... context.storedClassConfig};
        novasConfiguracoes['usarEscalares'] = true;

        return Vectorization.Vector( context.raw(), novasConfiguracoes );
    }

    /**
    * @override
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

        let quantosForam = 0;
        for( let i = elementoInicial ; i < elementoFinal ; i = i + intervalo )
        {
            dadosRecortados.push( context.readIndex(i) );
            quantosForam = quantosForam + 1;
        }

        let quantidadeFalta = Math.abs(dadosRecortados.length - context.flexibilidade.length);
        let flexibilidadeAjustada = [... context.flexibilidade];

        if( context.flexibilidade.length < quantidadeFalta ){
            for( let i = 0 ; i < quantidadeFalta ; i++ ){
                //Completa com um tipo de dado qualquer
                flexibilidadeAjustada.push('texto');
            }
        }

        let novoVetorCriado = Vectorization.BendableVector(dadosRecortados, {
            flexibilidade: flexibilidadeAjustada
        } );

        return novoVetorCriado;
    }

    /**
    * @override
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

        //Pra ser compativel com este Vectorization.BendableVector
        let extraPropsOfLine = {};
        if( context.flexibilidade ){
            extraPropsOfLine['flexibilidade'] = context.flexibilidade;
        }

        return Vectorization.BendableVector(novoVector, extraPropsOfLine);
    }

    /**
    * @override
    * Vai percorrer cada elemento deste Vectorization.Vector, visando localizar elementos que aparecem mais de uma vez.
    * E com isso, ele vai remover tais repetições de elementos, retornando um novo Vectorization.Vector que não contenha duplicidade. 
    * @returns {Vectorization.BendableVector} 
    */
    context.valoresUnicos = function(){
        const esteVetorCopiado = context.duplicar();
        const jaFoi = {};
        
        //Pra ser compativel com este Vectorization.BendableVector
        let extraPropsOfLine = {};
        //if( context.flexibilidade ){
        //    extraPropsOfLine['flexibilidade'] = context.flexibilidade;
        //}

        let novoVetor_sem_repeticoes = Vectorization.BendableVector([], extraPropsOfLine);

        esteVetorCopiado.paraCadaElemento(function(i){
            let elementoAtual = esteVetorCopiado.readIndex(i);

            if( jaFoi[ elementoAtual ] == undefined )
            {
                novoVetor_sem_repeticoes.adicionarElemento(elementoAtual);
                jaFoi[ elementoAtual ] = true;
            }
        });

        return novoVetor_sem_repeticoes;
    }

    //Alias for duplicar
    context.clonar = context.duplicar;

    /**
    * Método que converte este Vectorization.Vector para um Vectorization.Vector avançado, onde não importa qual o tipo de valor usado
    */
    context._vectorElementos2Flexibilidade = function(vectorClassConfig={}){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            const extraPropsOfLine = {... vectorClassConfig};

            //context.content[i] = 'vamos identificar abaixo';
            switch( context.flexibilidade[i] ){
                case 'Escalar':
                case 'Scalar':
                case 'Number':
                case 'Numero':
                case 'numero':
                case 'escalar':
                    context.content[i] = Vectorization.Scalar(context.content[i], extraPropsOfLine);
                    break;

                case 'texto':
                case 'Texto':
                case 'Text':
                case 'String':
                case 'Letras':
                    context.content[i] = Vectorization.Text(context.content[i], extraPropsOfLine);
                    break;

                default:
                    throw 'Tipo não aceito';
            }
        }
    }

    context._vectorElementos2Flexibilidade();

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    //Se tiver uma função a ser aplicada por cima de tudo
    if( config['funcaoAplicar'] != undefined || classConfig['funcaoAplicar'] != undefined ){
        context.aplicarFuncao( config['funcaoAplicar'] || classConfig['funcaoAplicar'] );
    }

    return context;
};

/**
* Métodos estáticos
*/
window.Vectorization.BendableVector.isBendableVector = function(obj){
    if( obj == undefined ){ return false };
    return ((obj.objectName != undefined && (obj.objectName == 'BendableVector' || obj.objectName == 'Vector')) || 
           Array.isArray(obj)) ? true : false;
}

window.Vectorization.BendableVector.isVectorizationBendableVector = function(obj){
    if( obj == undefined ){ return false };
    return (obj.objectName != undefined && obj.objectName == 'BendableVector' )
}