/*
 * File Name: StringVector-translation.js
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

window.Vectorization.StringVector._translations = function(){
    const translatedMethods = {
        
    };

    const translatedAttributes = {
        
    };

    return {
        translatedMethods: translatedMethods,
        translatedAttributes: translatedAttributes
    };
}

module.exports = window.Vectorization.StringVector._translations;