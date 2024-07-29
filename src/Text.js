/*
 * File Name: Text.js
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
        require('./Scalar'); 
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

window.Vectorization.Text = function( value=NaN, classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Text._translations || null;

    let classeBaseEscalar = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBaseEscalar.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    if( value.objectName != undefined && value.objectName == 'Text' ){
        return Vectorization.Text( value.raw(), {... classConfig} );
    }

    //let context = {... classConfig};
    let context = window.Vectorization.Base({... classConfig});

    if( value != undefined && 
        !(value instanceof Object) &&
        (typeof value == 'string' || Vectorization.Utilidades.apenasNumeros(value)) == true
    ){

        context.value = String(value);
        context.configuracoesValue = {};
    
    //Se for um objeto com configurações
    }else if(value instanceof Object){

        //Salva a config
        context.configuracoesValue = {... value};
    }

    if(context.value == undefined){
        if( Vectorization.Scalar.isScalar(value) == true ){
            context.value = String(value);   
        }
    }

    context.objectName = 'Text';
    context.path = 'Vectorization.Text';

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

    context.valueOf = function(){
        return String( context.value );
    }

    context.toString = function(){
        return String(context.value);
    }

    context.raw = function(){
        return context.value;
    }

    /**
    * Transforma este Vectorization.Text em um Vectorization.StringVector
    * Transform this Vectorization.Text into a Vectorization.StringVector
    * @returns {Vectorization.StringVector}
    */
    context.toCharacterVector = function(){
        let esteTexto = context;
        return Vectorization.StringVector( esteTexto.obterValor().split('') );
    }
    context.paraVetorCaracteres = context.toCharacterVector;


    context.letrasMaiusculas = function(){
        return Vectorization.Text( String( context.obterValor() ).toUpperCase() );
    }
    context.toUpperCase = context.letrasMaiusculas;


    
    context.letrasMinusculas = function(){
        return Vectorization.Text( String( context.obterValor() ).toLowerCase() );
    }
    context.toLowerCase = context.letrasMinusculas;

    /**
    * Verifica se este Vectorization.Text é igual a outro Vectorization.Text
    * @param {Vectorization.Text} outroTexto 
    * @returns {Boolean}
    */
    context.isIgual = function(outroTexto){
        let outroTexto_Text = Vectorization.Text.isVectorizationText(outroTexto) == false ? Vectorization.Text(outroTexto) : outroTexto;
        return Vectorization.Text.isText(outroTexto) && context.obterValor() === outroTexto_Text.obterValor();
    }

    /**
    * Calcula a distancia hamming deste Vectorization.Text com outro Vectorization.Text
    * @param {Vectorization.Text} outroTexto 
    * @returns {Vectorization.Scalar}
    */
    context.distanciaHamming = function(outroTexto){
        let outroTexto_Text = Vectorization.Text.isVectorizationText(outroTexto) == false ? Vectorization.Text(outroTexto) : outroTexto;
        let caracteresOutroTexto = outroTexto_Text.toCharacterVector();

        let esteTexto_Text = context;
        let caracteresEsteTexto = esteTexto_Text.toCharacterVector();

        let distanciaTotalCalculada = Vectorization.Scalar(0);

        caracteresEsteTexto.paraCadaElemento(function(i){
            let isIgual = (caracteresEsteTexto.lerIndice(i).isIgual( caracteresOutroTexto.lerIndice(i) ) ) == true ? 0 : 1;
            distanciaTotalCalculada = distanciaTotalCalculada.somarNumero( Vectorization.Scalar(isIgual) );
        });

        return Vectorization.Scalar(distanciaTotalCalculada);
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
             throw 'Este Vectorization.Text está bloqueado para novas gravações!';
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
window.Vectorization.Text.isText = function(obj){
    if(obj == undefined){return false};
    return (obj.objectName != undefined && obj.objectName == 'Text') || typeof obj == 'string';
}

window.Vectorization.Text.isVectorizationText = function(obj){
    if(obj == undefined){return false};
    return (obj.objectName != undefined && obj.objectName == 'Text');
}

module.exports = window.Vectorization.Text;