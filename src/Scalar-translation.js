/*
 * File Name: Scalar-translation.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * Description: Provide translations for class methods
 * 
 * LICENSE: MIT
*/

//Compatibilidade com NodeJS
if( typeof window === 'undefined' ){
    global.window = global; 
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Scalar._translations = function(){
    const translatedMethods = {
        'elevarQuadrado': 'aoQuadrado',
        'elevarAoQuadrado': 'aoQuadrado'
    };

    const translatedAttributes = {
        'valor': 'value',
        'conteudo': 'value'
    };

    return {
        translatedMethods: translatedMethods,
        translatedAttributes: translatedAttributes
    };
}

module.exports = window.Vectorization.Scalar._translations;