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
    //Por padrão o usarEscalares vai ser true
    if( config['usarTextos'] == undefined && classConfig['usarTextos'] == undefined && config['usarTextos'] != false && classConfig['usarTextos'] != false ){
        config['usarTextos'] = true;
    }
    
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

    context.letrasMaiusculas = function(){
        let novoStringVector = Vectorization.StringVector([]);
        let contextoMetodo = this instanceof Window ? context : this; 
        
        //Usei o this acima pois isso permite herdar este código em outro objeto
        contextoMetodo.paraCadaElemento(function(i){
            novoStringVector.adicionarElemento( contextoMetodo.lerIndice(i).letrasMaiusculas() );
        });

        return novoStringVector;
    }
    context.toUpperCase = context.letrasMaiusculas;


    context.letrasMinusculas = function(){
        let novoStringVector = Vectorization.StringVector([]);
        let contextoMetodo = this instanceof Window ? context : this; 

        //Usei o this acima pois isso permite herdar este código em outro objeto
        contextoMetodo.paraCadaElemento(function(i){
            novoStringVector.adicionarElemento( contextoMetodo.lerIndice(i).letrasMinusculas() );
        });

        return novoStringVector;
    }
    context.toLowerCase = context.letrasMinusculas;

    
    /**
     * Retorna um Vectorization.Vector, contendo as distancias hamming de cada elemento Vectorizaion.Text
     * @param {Vectorization.StringVector} outroStringVector 
     * @returns {Vectorization.Vector}
     */
    context.distanciaPalavras = function(outroStringVector){
        let distancias = Vectorization.Vector([]);
        let contextoMetodo = this instanceof Window ? context : this; 

        //Usei o this acima pois isso permite herdar este código em outro objeto
        contextoMetodo.paraCadaElemento(function(i){
            let elementoAtual_esteStringVector = contextoMetodo.lerIndice(i),
                elementoAtual_outroStringVector = ( Vectorization.StringVector.isVectorizationStringVector(outroStringVector) == false ? Vectorization.StringVector(outroStringVector) : outroStringVector ).lerIndice(i);

            if( elementoAtual_outroStringVector != undefined ){
                let distanciaElementoIndiceAtual = Vectorization.Text(elementoAtual_esteStringVector)
                                                  .distanciaHamming( Vectorization.Text(elementoAtual_outroStringVector) )
                
                distancias.adicionarElemento( distanciaElementoIndiceAtual );

            }else{
                distancias.adicionarElemento( 1 );
            }
        });

        return distancias;
    }

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    /**
    * Método que converte este Vectorization.StringVector para um Vectorization.StringVector avançado, onde cada elemento dentro do mesmo é um Vectorization.Text
    */
    context._vectorElementos2Textos = function(vectorClassConfig={}){
        for( let i = 0 ; i < context.content.length ; i++ )
        {
            const extraPropsOfLine = {... vectorClassConfig};
            context.content[i] = Vectorization.Text(context.content[i], extraPropsOfLine);
        }
    }

    /**
    * @override
    * @returns {Array}
    */
    context.toArray = function(){
        if( context.usarTextos != undefined && context.usarTextos == true )
        {
            let valoresSemEstarEmTextos = [];
            context.paraCadaElemento(function(i, objetoTexto){
                valoresSemEstarEmTextos.push( objetoTexto.obterValor() );
            });

            return valoresSemEstarEmTextos;

        }else{
            return context.content;
        }
    }
    /**
    * @override
    * @returns {Array}
    */
    context.raw = context.toArray;

    if( context.configRecebidaUsuario['usarTextos'] != undefined || classConfig['usarTextos'] != undefined ){
        if( context.configRecebidaUsuario['usarTextos'] == true || classConfig['usarTextos'] == true )
        {
            context.usarTextos = true;
            context._vectorElementos2Textos();
        }
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