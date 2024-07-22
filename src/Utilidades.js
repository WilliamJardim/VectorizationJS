/*
 * File Name: Utils.js
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

window.Vectorization.Utilidades = {};

window.Vectorization.Utilidades.apenasNumeros = function(stringObj){
    let apenasNumeros = true;
    let tamanhoString = stringObj.length;
    for( let letra = 0 ; letra < tamanhoString ; letra++ )
    {       
        if( !isNaN( Number(stringObj[letra]) ) || stringObj[letra] == '.' ){
            apenasNumeros = true;

        }else{
            apenasNumeros = false;
            break;
        }
    }

    return apenasNumeros;
}