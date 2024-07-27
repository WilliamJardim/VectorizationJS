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
    if( Vectorization.StringVector.isVectorizationBendableVector(config) && config.objectName == 'BendableVector' ){
        return Vectorization.BendableVector( config.values() );
    }

    //O StringVector será baseado no Vectorization.Vector
    let context = window.Vectorization.Vector(config, classConfig);
    context.objectName = 'BendableVector';
    context.extendedFrom = 'Vector';
    context.path = 'Vectorization.BendableVector';
    context.configRecebidaUsuario = config;

    context.flexibilidade = classConfig['flexibilidade'] || false;

    if( context.flexibilidade ){
        if( context.flexibilidade.length != context.content.length ){
            throw 'o array flexibilidade precisa conter a mesma quantidade de elementos deste Vectorization.Vector'
        }
    }

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
window.Vectorization.StringVector.isBendableVector = function(obj){
    return ((obj.objectName != undefined && (obj.objectName == 'BendableVector' || obj.objectName == 'Vector')) || 
           Array.isArray(obj)) ? true : false;
}

window.Vectorization.StringVector.isVectorizationBendableVector = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'BendableVector' )
}