/*
 * File Name: StringVector.js
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

window.Vectorization.StringVector = function( config=[], classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.StringVector._translations || null;

    let classeBaseVector = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseVector.translateAttributes_andReturn(classConfig, classConfig['translations']() );
    
    //Este Vectorization.StringVector NÂO usa números, em vez disso, ele é especifico pra texto
    classConfig['usarEscalares'] = false;

    //Se o usuario tentar criar um vetor a partir de outro vetor, ele recria o propio vetor passado, mantendo a estrutura como ainda sendo um Vector
    if( Vectorization.StringVector.isStringVector(config) && config.objectName == 'StringVector' ){
        return Vectorization.StringVector( config.values() );
    }

    //O StringVector será baseado no Vectorization.Vector
    let context = window.Vectorization.Vector(config, classConfig);
    context.objectName = 'StringVector';
    context.extendedFrom = 'Vector';
    context.path = 'Vectorization.StringVector';
    context.configRecebidaUsuario = config;

    context.distanciaPalavras = function(outroStringVector){
        
    }

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
window.Vectorization.StringVector.isStringVector = function(obj){
    return ((obj.objectName != undefined && (obj.objectName == 'StringVector' || obj.objectName == 'Vector')) || 
           Array.isArray(obj)) ? true : false;
}

window.Vectorization.StringVector.isVectorizationStringVector = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'StringVector' )
}