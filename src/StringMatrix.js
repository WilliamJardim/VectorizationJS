/*
 * File Name: StringMatrix.js
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
    require('./StringVector');
    require('./Matrix');
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.StringMatrix = function( config=[], classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.StringMatrix._translations || null;
    classConfig['advanced'] = false;
    classConfig['usarTexto'] = true;

    let classeBaseVector = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseVector.translateAttributes_andReturn(classConfig, classConfig['translations']() );
    
    //Se o usuario tentar criar um vetor a partir de outro vetor, ele recria o propio vetor passado, mantendo a estrutura como ainda sendo um Vector
    if( Vectorization.StringMatrix.isStringMatrix(config) && config.objectName == 'StringMatrix' ){
        return Vectorization.StringMatrix( config.values() );
    }

    //O StringMatrix será baseado no Vectorization.Matrix
    let context = window.Vectorization.Matrix(config, classConfig);
    context.objectName = 'StringMatrix';
    context.extendedFrom = 'Matrix';
    context.path = 'Vectorization.StringMatrix';
    context.configRecebidaUsuario = config;

    /**
    * @override
    * Método que converte a matrix para uma matrix avançada, onde cada linha é um Vector 
    */
    context._matrix2Advanced = function(vectorClassConfig={}){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            const extraPropsOfLine = {... vectorClassConfig};
            extraPropsOfLine['index'] = i;
            extraPropsOfLine['usarTexto'] = true;

            context.content[i] = Vectorization.StringVector(context.content[i], extraPropsOfLine);
        }
        context.isAdvancedMatrix = true;
    }

    context._matrix2Advanced();

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    return context;
}

window.Vectorization.StringMatrix.isStringMatrix = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'StringMatrix' )
}