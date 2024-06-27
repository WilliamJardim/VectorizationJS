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
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Scalar = function( value=NaN, classConfig={} ){
    let context = {... classConfig};

    context.value = value;
    context.objectName = 'Scalar';
    context.path = 'Vectorization.Scalar';

    context.valueOf = function(){
        return Number.parseFloat( context.value );
    }

    context.toString = function(){
        return String(context.value);
    }

    return context;
}

module.exports = window.Vectorization.Scalar;