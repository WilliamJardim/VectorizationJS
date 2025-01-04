/*
 * File Name: Vector-translation.js
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

        "filter": "filtrar",

        "blockModifications": "bloquearModificacoes",
        "unblockModifications": "desbloquearModificacoes",

        "findMin": "valorMinimo",
        "findMax": "valorMaximo",
        "sortAscending": "ordenarCrescente",
        "sortDescending": "ordenarDecrescente",
        "mapFunction": "aplicarFuncao",
        "unicalValues": "valoresUnicos",

        //Portugues
        "somarMatriz": "somarMatrix",
        "subtrairMatriz": "subtrairMatrix",
        "multiplicarMatriz": "multiplicarMatrix",
        "elevarMatriz": "elevarMatrix",
        "produtoEscalarMatriz": "produtoEscalarMatrix",
        
        "paraCadaElemento": "forEach",
        "adicionarElemento": "push",
        "mapearValores": "map",
        "filtrarValores": "filtrar",
        "lerIndice": "readIndex",
        "getIndice": "readIndex",
        "bloquear": "bloquearModificacoes",
        "desbloquear": "desbloquearModificacoes",
        "indiceDe": "indexOf",
        "encontrarIndiceDe": "indexOf",
        "encontrarIndice": "indexOf",
        "ordemCrescente": "ordenarCrescente",
        "ordemDecrescente": "ordenarDecrescente",
        "isOrdemCrescente": "isOrdenadoCrescente",
        "isOrdemDecrescente": "isOrdenadoDecrescente",

        "subdividir": "dividirEmPartes",

        "contarFrequencias": "contabilizarFrequencias",
        "frequencias": "contabilizarFrequencias"
    };

    const translatedAttributes = {
        //English
        "blocked": "bloqueado",
        "allowBlock": "permitirBloquear",
        "allowUnblock": "permitirDesbloquear",
        "mapUsingFunction": "funcaoAplicar",

        //Portugues
        "valorPreencher": "fillValue",
        "elementos": "length",
        "conteudo": "numeros"
    };

    return {
        translatedMethods: translatedMethods,
        translatedAttributes: translatedAttributes
    };
}

module.exports = window.Vectorization.Vector._translations;