/*
 * File Name: Random-translation.js
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

window.Vectorization.Random._translations = function(){
    const translatedMethods = {
        //English
        'generateRandomNumericalValue': 'gerarNumeroAleatorio',
        'generateRandomFloatNumericalValue': 'gerarNumeroFloatAleatorio',
        'generateRandomIntegerNumericalValue': 'gerarNumeroInteiroAleatorio',
        'especifyOriginalInitialPoint': 'definirSemente'
    };

    const translatedAttributes = {
        
    };

    return {
        translatedMethods: translatedMethods,
        translatedAttributes: translatedAttributes
    };
}

let randomClasseBase = window.Vectorization.Base(window.Vectorization.Random);

//Aplica a tradução dos métodos, pra ser capaz de entender nomes de atributos em outros idiomas
randomClassConfig = randomClasseBase.translateAttributes_andReturn(window.Vectorization.Random, window.Vectorization.Random._translations() );

//Se existir uma tradução para a classe
if(window.Vectorization.Random._translations && typeof window.Vectorization.Random._translations === 'function'){
    randomClasseBase.applyTranslations( window.Vectorization.Random._translations() );
}

//Passando as configurações pra dentro da classe Vectorization.Random
let todasConfiguracoesClassConfig = randomClasseBase.getTodasConfiguracoesAplicadas();
let keysConfiguracoesClassConfig = [... Object.keys(randomClasseBase)];

for( let i = 0 ; i < todasConfiguracoesClassConfig.quantidadeDentro ; i++ )
{   
    let nomeConfiguracaoClassConfig = keysConfiguracoesClassConfig[i],
        valorConfiguracaoClassConfig = todasConfiguracoesClassConfig.configuracoesUsadas[nomeConfiguracaoClassConfig];

    if( window.Vectorization.Random[ nomeConfiguracaoClassConfig ] == undefined )
    {
        window.Vectorization.Random[ nomeConfiguracaoClassConfig ] = valorConfiguracaoClassConfig;
    }
}

module.exports = window.Vectorization.Random._translations;