/*
 * File Name: Scalar.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
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

window.Vectorization.Scalar = function( value=NaN, classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Scalar._translations || null;

    let classeBaseEscalar = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseEscalar.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    //Se o usuario tentar criar um vetor a partir de outro vetor, ele recria o propio vetor passado, mantendo a estrutura como ainda sendo um Vector
    if( value.objectName != undefined && value.objectName == 'Scalar' ){
        return Vectorization.Scalar( value.raw(), {... classConfig} );
    }

    //let context = {... classConfig};
    let context = window.Vectorization.Base({... classConfig});

    if( value != undefined && 
        !(value instanceof Object) &&
        (typeof value == 'number' || Vectorization.Utilidades.apenasNumeros(value)) == true
    ){
        context.value = Number(value);
        context.configuracoesValue = {};
    
    //Se for um objeto com configurações
    }else if(value instanceof Object){

        //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
        value = classeBaseEscalar.translateAttributes_andReturn(value, classConfig['translations']() );

        //Salva a config
        context.configuracoesValue = {... value};

        if( value.aleatorio == true ){
            if( value.minimo != undefined && value.maximo != undefined ){
                context.aleatorio = true;
                context.ultimoMaximoUsado = value.maximo;
                context.ultimoMinimoUsado = value.minimo;
                context.sementeAleatoria = context.sementeAleatoria || Vectorization.Random._sementeDefinida;

                if( value.sementeAleatoria != undefined ){
                    context.sementeAleatoria = value.sementeAleatoria;

                    if( typeof value.sementeAleatoria == 'number' ){
                        context.numeroSemente = value.sementeAleatoria;
                    }
                }

                context.value = Vectorization.Random.gerarNumeroAleatorio( Number(value.minimo), Number(value.maximo), context.sementeAleatoria );
                if( value.arredondar != undefined ){
                    switch(value.arredondar){
                        case true:
                            context.value = Math.round(context.value);
                            break;

                        case 'cima':
                        case 'up':
                            context.value = Math.ceil(context.value);
                            break;
            
                        case 'baixo':
                        case 'down':
                            context.value = Math.floor(context.value);
                            break;

                        case 'automatico':
                        case 'auto':
                            context.value = Math.round(context.value);
                            break;
                    }
                }

            }else{
                throw 'Para criar um Scalar aleatório voce precisar passar a faixa de valores!';
            }

        }else{
            //Se nao for aleatorio
            if( value.value != undefined ){
                if( typeof value.value == 'string' ){
                    context.value = value.value;
                    
                }else{
                    context.value = Number(value.value);
                }
            }
        }
    }

    context.objectName = 'Scalar';
    context.path = 'Vectorization.Scalar';

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
            throw 'Ação não permitida para este Vectorization.Scalar!';
        }
    }

    context.desbloquearModificacoes = function(){
        if( context.permitirDesbloquear == true ){
            context.bloqueado = false;
        }else{
            throw 'Ação não permitida para este Vectorization.Scalar!';
        }
    }

    context.obterValor = function(){
        return context.value;
    }

    //Troca o número aleatorio dentro desse Vectorization.Scalar
    context.trocarNumeroAleatorio = function(novoMinimo=context.ultimoMinimoUsado, novoMaximo=context.ultimoMaximoUsado, novaSemente=null){
        //Consulta se a gravação/modificação de dados está bloqueada neste Vectorization.Scalar
        if( context._isBloqueado() == true ){
           throw 'Este Vectorization.Scalar está bloqueado para novas gravações!';
        }

        if( context.aleatorio == true ){

            if( novoMinimo == null ){
                novoMinimo = context.ultimoMinimoUsado;
            }

            if( novoMaximo == null ){
                novoMaximo = context.ultimoMaximoUsado;
            }

            if( novaSemente == null ){
                novaSemente = context.sementeAleatoria;

            }else{
                context.sementeAleatoria = Vectorization.Random._get_dados_semente(novaSemente);
                
                if( typeof novaSemente == 'number' ){
                    context.numeroSemente = novaSemente;
                }
            }

            context.ultimoMaximoUsado = novoMaximo;
            context.ultimoMinimoUsado = novoMinimo;

            context.value = Vectorization.Random.gerarNumeroAleatorio( Number(novoMinimo), Number(novoMaximo), novaSemente );
            if( value.arredondar != undefined ){
                switch(value.arredondar){
                    case true:
                        context.value = Math.round(context.value);
                        break;

                    case 'cima':
                    case 'up':
                        context.value = Math.ceil(context.value);
                        break;
        
                    case 'baixo':
                    case 'down':
                        context.value = Math.floor(context.value);
                        break;

                    case 'automatico':
                    case 'auto':
                        context.value = Math.round(context.value);
                        break;
                }
            }

            return context.value;

        }else{
            throw 'Este objeto não é aleatório!';
        }
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

    context.somarNumero = function(numero){
        return Vectorization.Scalar(context.value + numero, {... classConfig});
    }

    context.subtrairNumero = function(numero){
        return Vectorization.Scalar(context.value - numero, {... classConfig});
    }

    context.dividirNumero = function(numero){
        return Vectorization.Scalar(context.value / numero, {... classConfig});
    }

    context.multiplicarNumero = function(numero){
        return Vectorization.Scalar(context.value * numero, {... classConfig});
    }

    context.elevarNumero = function(numero){
        return Vectorization.Scalar(Math.pow(context.value, numero), {... classConfig});
    }

    context.aoQuadrado = function(){
        return Vectorization.Scalar(context.elevarNumero(2), {... classConfig});
    }

    context.metade = function(){
        return Vectorization.Scalar(context.dividirNumero(2), {... classConfig});
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
             throw 'Este Vectorization.Scalar está bloqueado para novas gravações!';
          }

          //Outros casos barrar
          if( prop == 'bloqueado' || prop == 'permitirDesbloquear' || context.isAtributoProtegidoPeloVectorization(prop) ){
             throw 'Você não pode modificar esta atributo do Vectorization.Vector!';
          }

          return Reflect.set(target, prop, value);
        }
    });
}

/**
* Métodos estáticos
*/
window.Vectorization.Scalar.isScalar = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Scalar') || typeof obj == 'number';
}

window.Vectorization.Scalar.isVectorizationScalar = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Scalar');
}

module.exports = window.Vectorization.Scalar;