/*
 * File Name: Matrix-translation.js
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
        "extractColumnsValues": "extrairValoresColunas",
        "extractColumnsValuesExcept": "extrairValoresColunasExceto",

        "extractLineValues": "extrairValoresLinha",

        "blockModifications": "bloquearModificacoes",
        "unblockModifications": "desbloquearModificacoes",

        "planify": "planificar",

        "oneHotColumns": "oneHotColunas",
        "sliceLines": "slice",
        "sliceColumns": "sliceColunas",
        "sliceRegion": "recortarRegiao",

        "removeColumns": "removerColunas",
        "removeColumn": "removerColuna",

        //Portugues
        "obterTransposta": "transposta",
        "somarMatriz": "somarMatrix",
        "subtrairMatriz": "subtrairMatrix",
        "multiplicarMatriz": "multiplicarMatrix",
        "elevarMatriz": "elevarMatrix",
        "produtoEscalarMatriz": "produtoEscalarMatrix",
        "addColuna": "adicionarColuna",
        "preencherLinha": "zerarLinha",
        "preencherColuna": "zerarColuna",
        "preencherColunaOnde": "zerarColunaOnde",
        "paraCadaLinha": "forEach",
        "percorrerElementosColuna": "percorrerColuna",
        "mapearElementosColuna": "mapearColuna",
        "bloquear": "bloquearModificacoes",
        "desbloquear": "desbloquearModificacoes"
    };

    const translatedAttributes = {
        //Portugues
        "valorPreencher": "fillValue",
        "preencherValor": "fillValue",
        "matrizAvancada": "isAdvancedMatrix",
        "matrixAvancada": "isAdvancedMatrix",
        "linhas": "rows",
        "colunas": "columns",

        //English
        //Ingles
        "blocked": "bloqueado",
        "allowBlock": "permitirBloquear",
        "allowUnblock": "permitirDesbloquear",
        "deepMatrix": "matrixProfunda"
    };

    return {
        translatedMethods: translatedMethods,
        translatedAttributes: translatedAttributes
    };
}

module.exports = window.Vectorization.Matrix._translations;