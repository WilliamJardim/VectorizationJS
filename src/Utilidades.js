/*
 * File Name: Utils.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
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