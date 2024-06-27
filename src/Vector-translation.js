/*
 * File Name: Vector-translation.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * Description: Provide translations for class methods
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/
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
        "produtoEscalarMatriz": "produtoEscalarMatrix"
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