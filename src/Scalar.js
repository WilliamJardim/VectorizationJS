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
    
    if( window.Vectorization.Random == undefined ){
        require('./Random'); 
    }
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

window.Vectorization.Scalar = function( value=NaN, classConfig={} ){
    let context = {... classConfig};

    if( value != undefined && 
        !(value instanceof Object) &&
        typeof value == 'number' 
    ){
        context.value = value;
        context.configuracoesValue = {};
    
    //Se for um objeto com configurações
    }else if(value instanceof Object){

        //Salva a config
        context.configuracoesValue = {... value};

        if( value.aleatorio == true ){
            if( value.minimo != undefined && value.maximo != undefined ){
                context.aleatorio = true;
                context.ultimoMaximoUsado = value.maximo;
                context.ultimoMinimoUsado = value.minimo;
                context.sementeAleatoria = context.sementeAleatoria || Vectorization.Random._sementeDefinida;
               
                if( value.sementeAleatoria != undefined ){
                    context.sementeAleatoria = value.sementeAleatoria;

                    if( typeof value.sementeAleatoria == 'number' ){
                        context.numeroSemente = value.sementeAleatoria;
                    }
                }

                context.value = Vectorization.Random.gerarNumeroAleatorio( Number(value.minimo), Number(value.maximo), context.sementeAleatoria );
                if( value.arredondar != undefined ){
                    switch(value.arredondar){
                        case true:
                            context.value = Math.round(context.value);
                            break;

                        case 'cima':
                        case 'up':
                            context.value = Math.ceil(context.value);
                            break;
            
                        case 'baixo':
                        case 'down':
                            context.value = Math.floor(context.value);
                            break;

                        case 'automatico':
                        case 'auto':
                            context.value = Math.round(context.value);
                            break;
                    }
                }

            }else{
                throw 'Para criar um Scalar aleatório voce precisar passar a faixa de valores!';
            }
        }
    }

    context.objectName = 'Scalar';
    context.path = 'Vectorization.Scalar';

    //Troca o número aleatorio dentro desse Vectorization.Scalar
    context.trocarNumeroAleatorio = function(novoMinimo=context.ultimoMinimoUsado, novoMaximo=context.ultimoMaximoUsado, novaSemente=null){
        if( context.aleatorio == true ){

            if( novaSemente == null ){
                novaSemente = context.sementeAleatoria;

            }else{
                context.sementeAleatoria = Vectorization.Random._get_dados_semente(novaSemente);
                
                if( typeof novaSemente == 'number' ){
                    context.numeroSemente = novaSemente;
                }
            }

            context.ultimoMaximoUsado = novoMaximo;
            context.ultimoMinimoUsado = novoMinimo;

            context.value = Vectorization.Random.gerarNumeroAleatorio( Number(novoMinimo), Number(novoMaximo), novaSemente );
            if( value.arredondar != undefined ){
                switch(value.arredondar){
                    case true:
                        context.value = Math.round(context.value);
                        break;

                    case 'cima':
                    case 'up':
                        context.value = Math.ceil(context.value);
                        break;
        
                    case 'baixo':
                    case 'down':
                        context.value = Math.floor(context.value);
                        break;

                    case 'automatico':
                    case 'auto':
                        context.value = Math.round(context.value);
                        break;
                }
            }

            return context.value;

        }else{
            throw 'Este objeto não é aleatório!';
        }
    }

    context.valueOf = function(){
        return Number.parseFloat( context.value );
    }

    context.toString = function(){
        return String(context.value);
    }

    return context;
}

module.exports = window.Vectorization.Scalar;