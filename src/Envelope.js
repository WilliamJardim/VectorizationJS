/*
 * File Name: Envelope.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * Description: Um objeto chamado literalmente de Envelope, para permitir "envelopar" varios objetos de diversos tipos, e permitir executar algum método em todos eles.
 * Ao executar um método em um Envelope, ele vai executar esse método em cada objeto que ele está armazenando. E vai retornar um novo Envelope, conténdo os resultados, que podem ser números, vetores, matrizes, ou qualquer coisa que o método escolhido para ser aplicado retorne.
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

window.Vectorization.Envelope = function( arrayObjetos=[], classConfig={} ){
    //Define a tradução
    classConfig['translations'] = window.Vectorization.Envelope._translations || null;

    let classeBase = window.Vectorization.Base({... classConfig});

    //Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
    classConfig = classeBase.translateAttributes_andReturn(classConfig, classConfig['translations']() );

    let context = window.Vectorization.Base({... classConfig});

    context.objectName = 'Envelope';
    context.path = 'Vectorization.Envelope';
    context.arrayObjetos = arrayObjetos;

    context.adicionarObjeto = function( objeto ){
        context.arrayObjetos.push( objeto );
    }

    /**
    * Cria um contexto separado do contexto do Envelope, para permitir executar métodos dentro do Envelope em si, e não dentro dos objetos dele
    * @returns {Envelope.SeparatedContext}
    */
    context.separatedContext = function(){
        const objetos = context.arrayObjetos;

        //um contexto manipulavel que não roda nos objetos do Envelope, mais sim no própio Envelope em si, podendo manipular seus atributos e objetos armazenados de forma independente do propio Envelope
        return {

            contextEnvelope: context,

            path: 'Envelope.SeparatedContext',
            objectName: 'EnvelopeSeparatedContext',
            arrayObjetos: objetos,
            
            lerIndice: function( indice ){
                return this.contextEnvelope.arrayObjetos[indice];
            },

            adicionarElemento: function( obj ){
                this.contextEnvelope.adicionarObjeto(obj);
            },

            getArrayObjetos: function(){
                return this.contextEnvelope.arrayObjetos;
            },

            getEnvelope: function(){
                return this.contextEnvelope;
            },

            getObjetos: function(){
                return Vectorization.Envelope( this.contextEnvelope.arrayObjetos );
            },

            setObjetos: function(novoArrayObjetos){
                this.contextEnvelope.arrayObjetos = novoArrayObjetos;
            }

        }
    }
    context.getSeparatedContext = context.separatedContext;
    context.internalContext = context.separatedContext;
    context.getInternalContext = context.separatedContext;
    context.separated = context.separatedContext;
    context.it = context.separatedContext;
    context.getIt = context.separatedContext;
    context.edit = context.separatedContext;
    context.editIt = context.separatedContext;

    context.raw = function(){
        return context.arrayObjetos;
    }

    /*
    * Calcula a média de cada objeto que estiver dentro do Envelope
    * O tipo de retorno não tem uma flexibilide definida. Vai depender os objetos que temos dentro do Envelope e do tipo de retorno que o método usado retorna
    */
    //context.media = function(){
    //    let novoEnvelope = Vectorization.Envelope([], classConfig);
        
    //    for( let i = 0 ; i < context.arrayObjetos.length ; i++ ){
    //        novoEnvelope.adicionarObjeto( context.arrayObjetos[i].media() );
    //    }

    //    return novoEnvelope;
    //}

    context.storedClassConfig = classConfig || {};

    //Se existir uma tradução para a classe
    if(context._translations && typeof context._translations === 'function'){
        context.applyTranslations( context._translations() );
    }

    return new Proxy(context, {
        /*
        * Calcula o resultado do NOME_ALGUM_MÈTODO de cada objeto que estiver dentro do Envelope
        * O tipo de retorno não tem uma flexibilide definida. Vai depender os objetos que temos dentro do Envelope e do tipo de retorno que o método usado retorna
        *
        * PERMITE FAZER envelope.NOME_ALGUM_MÈTODO(); 
        * 
        * Por exemplo:
        *   V.Envelope([ vec1, vec2, matrix1 ]).algumaMetodo().raw()
        * 
        * Ele vai tentar executar o método 'algumaMetodo' dentro de cada objeto: vec1, vec2 e matrix1
        */
        get: function(target, prop) {
            if (typeof prop === 'string' && typeof target[prop] === 'undefined') {
                // Verifica se o método existe em cada objeto dentro de arrayObjetos
                return function(...args) {
                    // Cria um Envelope para guardar os resultados
                    let novoEnvelope = Vectorization.Envelope([], classConfig);

                    // Tenta executar o método em cada objeto e adiciona o resultado ao novo Envelope
                    for (let i = 0; i < target.arrayObjetos.length; i++) 
                    {
                        let obj = target.arrayObjetos[i];

                        if (typeof obj[prop] === 'function') {
                            novoEnvelope.adicionarObjeto(obj[prop](...args));  // Executa o método no objeto
                        }else{
                            novoEnvelope.adicionarObjeto(null);  // INDICA QUE O MÈTODO NÂO EXISTIA
                        }
                    }

                    return novoEnvelope;
                };
            }
            return target[prop];
        },

        set: function(target, prop, value) {
          return Reflect.set(target, prop, value);
        }
    });
}

/**
* Métodos estáticos
*/
window.Vectorization.Envelope.isEnvelope = function(obj){
    return (obj.objectName != undefined && obj.objectName == 'Envelope');
}

module.exports = window.Vectorization.Envelope;