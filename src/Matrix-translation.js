/*
 * File Name: Matrix-translation.js
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

window.Vectorization.Matrix._translations = function(){
    const translatedMethods = {
        //English
        "deepLevel": "nivelProfundidade",
        "getDeepLevel": "nivelProfundidade",

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

        "extractColumnValues": "extrairValoresColuna",

        "extractLineValues": "extrairValoresLinha",

        //Portugues
        "obterTransposta": "transposta",
        "somarMatriz": "somarMatrix",
        "subtrairMatriz": "subtrairMatrix",
        "multiplicarMatriz": "multiplicarMatrix",
        "elevarMatriz": "elevarMatrix",
        "produtoEscalarMatriz": "produtoEscalarMatrix"
    };

    const translatedAttributes = {
        //Portugues
        "valorPreencher": "fillValue",
        "preencherValor": "fillValue",
        "matrizAvancada": "isAdvancedMatrix",
        "matrixAvancada": "isAdvancedMatrix",
        "linhas": "rows",
        "colunas": "columns",

        //Ingles
        "deepMatrix": "matrixProfunda"
    };

    return {
        translatedMethods: translatedMethods,
        translatedAttributes: translatedAttributes
    };
}

module.exports = window.Vectorization.Matrix._translations;