/*
 * File Name: Text-translation.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * Description: Provide translations for class methods
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
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

window.Vectorization.Text._translations = function(){
    const translatedMethods = {
        'isEquals': 'isIgual'
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

module.exports = window.Vectorization.Text._translations;