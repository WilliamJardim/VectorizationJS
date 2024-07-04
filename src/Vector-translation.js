/*
 * File Name: Vector-translation.js
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

window.Vectorization.Vector._translations = function(){
    const translatedMethods = {
        //English
        "dotProduct": "produtoEscalar",

        "dotProductMatrix": "produtoEscalarMatrix",

        "dotProductVector": "produtoEscalarVector",

        "multiplyMatrix": "multiplicarMatrix",

        "multiplyNumber": "multiplicarNumero",

        "multiplyVector": "multiplicarVetor",

        "addMatrix": "somarMatrix",

        "addNumber": "somarNumero",

        "addVector": "somarVetor",

        "subtractMatrix": "subtrairMatrix",

        "subtractNumber": "subtrairNumero",

        "subtractVector": "subtrairVetor",

        "divideMatrix": "dividirMatrix",

        "divideNumber": "dividirNumero",

        "divideVector": "dividirVetor",

        "powMatrix": "elevarMatrix",

        "powNumber": "elevarNumero",

        "powVector": "elevarVetor",

        "transposed": "tranposta",

        "oppostMatrix": "matrixOposta",

        "identity": "identidade",

        //Portugues
        "somarMatriz": "somarMatrix",
        "subtrairMatriz": "subtrairMatrix",
        "multiplicarMatriz": "multiplicarMatrix",
        "elevarMatriz": "elevarMatrix",
        "produtoEscalarMatriz": "produtoEscalarMatrix",
        
        "paraCadaElemento": "forEach",
        "adicionarElemento": "push",
        "mapearValores": "map"
    };

    const translatedAttributes = {
        //Portugues
        "valorPreencher": "fillValue",
        "elementos": "length"
    };

    return {
        translatedMethods: translatedMethods,
        translatedAttributes: translatedAttributes
    };
}

module.exports = window.Vectorization.Vector._translations;