/*
 * File Name: Boolean.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: MIT
*/

//Compatibilidade com NodeJS
if( typeof window === 'undefined' ){
    global.window = global; 

    if( window.Vectorization.Random == undefined ){
        require('./Root'); 
        require('./Random'); 
    }

    if( window.Vectorization.Utilidades == undefined ){
        require('./Utilidades'); 
    }
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Boolean = function( value=NaN, classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Boolean._translations || null;

    let classeBaseEscalar = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseEscalar.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    //Se o usuario tentar criar um vetor a partir de outro vetor, ele recria o propio vetor passado, mantendo a estrutura como ainda sendo um Vector
    if( value.objectName != undefined && value.objectName == 'Boolean' ){
        return Vectorization.Boolean( value.raw(), {... classConfig} );
    }

    //let context = {... classConfig};
    let context = window.Vectorization.Base({... classConfig});

    if( classConfig.value ){
        value = classConfig.value;
    }

    if( value != undefined && 
        !(value instanceof Object) &&
        (typeof value == 'number' || typeof value == 'false' || typeof value == 'true' || Vectorization.Utilidades.apenasNumeros(value)) == true
    ){
        if( value > 1 ){
            throw 'Esse Vectorization.Boolean não suporta valores maiores do que 1!';
        }

        if( value < 0 ){
            throw 'Esse Vectorization.Boolean não suporta valores menores do que 0!';
        }

        context.value = Number(value);
        context.configuracoesValue = {};
    
    //Se for um objeto com configurações
    }else if(value instanceof Object){

        //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
        value = classeBaseEscalar.translateAttributes_andReturn(value, classConfig['translations']() );

        //Salva a config
        context.configuracoesValue = {... value};

        if( value.value > 1 ){
            throw 'Esse Vectorization.Boolean não suporta valores maiores do que 1!';
        }

        if( value.value < 0 ){
            throw 'Esse Vectorization.Boolean não suporta valores menores do que 0!';
        }

        if( typeof value.value == 'string' ){
            context.value = value.value;
        }else{
            context.value = Number(value.value);
        }
    }

    if( typeof context.value == 'string' ){
        context.value = String(context.value).toLowerCase();
    }

    if( context.value == 'sim' || context.value == 'verdade' || context.value == 'afirmativo' || context.value == 'verdadeiro' ){
        context.value = Number(true);

    }else if( context.value == 'nao' || context.value == 'falso' || context.value == 'negativo' ){
        context.value = Number(false);
    }

    context.objectName = 'Boolean';
    context.path = 'Vectorization.Boolean';

    context.storedClassConfig = classConfig || {};

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

        }else{
            throw 'Ação não permitida para este Vectorization.Boolean!';
        }
    }

    context.desbloquearModificacoes = function(){
        if( context.permitirDesbloquear == true ){
            context.bloqueado = false;
        }else{
            throw 'Ação não permitida para este Vectorization.Boolean!';
        }
    }

    context.obterValor = function(){
        return context.value;
    }

    context.valueOf = function(){
        return Number.parseFloat( context.value );
    }

    context.toScalar = function(){
        let novasConfiguracoes = {... context.storedClassConfig};
        return Vectorization.Text( context.valueOf(), novasConfiguracoes );
    }

    context.toString = function(){
        return String(context.value);
    }

    context.raw = function(){
        return context.value + 0;
    }

    context.toggle = function(){
        if( context.value == Number(true) ){
            context.value = Number(false);
            
        }else{
            context.value = Number(true);
        }
    }

    context.isTrue = function(){
        return context.value == Number(true);
    }

    context.isFalse = function(){
        return context.value == Number(false);
    }

    //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Vector
    context.bloqueado = (classConfig['bloqueado'] != undefined) ? (classConfig['bloqueado']) : false;

    context.isAtributoProtegidoPeloVectorization = function(nomeAtributo){
        let listaAtributosProtegidos = [
            'permitirBloquear'
        ];

        let confereSePodeMexe = listaAtributosProtegidos.indexOf(nomeAtributo) != -1;
        return confereSePodeMexe == true ? true : false;
    }

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    //return context;
    return new Proxy(context, {
        
        set: function(target, prop, value) {
          //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Scalar
          if( target._isBloqueado() == true ){
             throw 'Este Vectorization.Boolean está bloqueado para novas gravações!';
          }

          //Outros casos barrar
          if( prop == 'bloqueado' || prop == 'permitirDesbloquear' || context.isAtributoProtegidoPeloVectorization(prop) ){
             throw 'Você não pode modificar esta atributo do Vectorization.Boolean!';
          }

          return Reflect.set(target, prop, value);
        }
    });
}

/**
* Métodos estáticos
*/
window.Vectorization.Boolean.isBoolean = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Boolean') || typeof obj == 'number';
}

window.Vectorization.Boolean.isVectorizationBoolean = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Boolean');
}

module.exports = window.Vectorization.Boolean;