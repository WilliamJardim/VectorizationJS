/*
 * File Name: Random.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/

//Compatibilidade com NodeJS
if( typeof window === 'undefined' ){
    global.window = global;
    
    require('./Root'); 

    if( window.Vectorization.Scalar == undefined ){
        require('./Scalar');
    }

    if( window.Vectorization.Vector == undefined ){
        require('./Vector');
    }
    
//Se for navegador
}else{
    if (typeof module === 'undefined') {
        globalThis.module = {};
    }
}

if(!window.Vectorization){ window.Vectorization = {} };

//Classe que possui métodos para gerar números aleatórios do Vectorization
window.Vectorization.Random = function( classConfig={} ){
    let context = {... classConfig};
    context.value = value;
    context.objectName = 'Random';
    context.path = 'Vectorization.Random';
    return context;
}

/**
* Métodos estáticos
*/
window.Vectorization.Random._sementes = [
    //Passos por semente
    {
        sequencia: [2, -5, 8, 0.5, 3, 4.8, 1, 0.00001, 12, 2, 3, 7, 9, 15, 25, 0.8, 1, 0,5],
        multiplicador: 0.5
    },
    {
        sequencia: [5.555555555555555, -13.88888888888889, 22.22222222222222, 1.3888888888888888, 8.333333333333334, 13.333333333333332, 2.7777777777777777, 0.00002777777777777778, 33.333333333333336, 5.555555555555555, 8.333333333333334, 19.444444444444443, 25, 41.666666666666664, 69.44444444444444, 2.2222222222222223, 2.7777777777777777, 0.152, 13.88888888888889],
        multiplicador: 1.5
    },
    {
        sequencia: [0.75, -1.875, 3, 0.1875, 1.1250000000000002, 1.8000000000000003, 0.375, 0.00000375, 4.500000000000001, 0.75, 1.1250000000000002, 2.625, 3.375, 5.625, 9.375, 0.30000000000000004, 0.375, 0, 1.875],
        multiplicador: 4.5
    },
    {
        sequencia: [-1.0666666666666667, 2.6666666666666665, -4.266666666666667, -0.26666666666666666, -1.5999999999999999, -2.56, -0.5333333333333333, -0.000005333333333333334, -6.3999999999999995, -1.0666666666666667, -1.5999999999999999, -3.7333333333333334, -4.8, -8, -13.333333333333334, -0.42666666666666664, -0.5333333333333333, -0.25, -2.6666666666666665],
        multiplicador: 8
    }
]

//Inicializa a vezesJaUsouAteAgora de todas elas, pra nao repetir os mesmos numeros
for( let i = 0 ; i < window.Vectorization.Random._sementes.length ; i++ ){
    const sequenciaAtual = window.Vectorization.Random._sementes[i];
    sequenciaAtual.vezesJaUsouAteAgora = 0;
    sequenciaAtual.indiceAtual = 0;
}

window.Vectorization.Random._numeroSementePadraoDefinida = 5;

//Extrai os dados da semente definida pelo úsuario
window.Vectorization.Random._get_dados_semente = function(numeroDaSemente){
    let iSemente = 0;
    let sementeAtual = {... window.Vectorization.Random._sementes[0]};
    let iContadorIteracao = 0;

    while( iContadorIteracao <= Number.parseInt(numeroDaSemente) )
    {
        if(iSemente > window.Vectorization.Random._sementes.length - 1){
            sementeAtual = {... window.Vectorization.Random._sementes[0]};
            iSemente = 0;
        }

        sementeAtual = {... window.Vectorization.Random._sementes[iSemente]};
        iSemente++;

        iContadorIteracao++;
    }

    if(sementeAtual){
        return sementeAtual;

    }else{
        throw 'Erro ao tentar obter os dados da semente!. Tente outra.'
    }
}

window.Vectorization.Random._sementeDefinida = window.Vectorization.Random._get_dados_semente( window.Vectorization.Random._numeroSementePadraoDefinida );

window.Vectorization.Random.definirSemente = function(numeroDaSemente){
    switch(typeof numeroDaSemente){
        case 'number':
            window.Vectorization.Random._sementeDefinida = window.Vectorization.Random._get_dados_semente(numeroDaSemente);
            window.Vectorization.Random._numeroSementeDefinida = numeroDaSemente;
            break;

        //Se for um objeto do Vectorization
        case 'object':
        case 'function':
            if( numeroDaSemente.sequencia != undefined &&
                numeroDaSemente.multiplicador != undefined &&
                numeroDaSemente.sequencia.length > 2 &&
                numeroDaSemente.vezesJaUsouAteAgora != undefined
            ){
                window.Vectorization.Random._sementeDefinida = window.Vectorization.Random._get_dados_semente(numeroDaSemente);
            }
            break;

    }
}

/**
* @param {Object} sementeAtual 
* @returns {Number}
*/
window.Vectorization.Random.proximoNumeroDaSequenciaSemente = function(sementeAtual){
    let sequenciaVector = Vectorization.Vector(sementeAtual.sequencia);
    if( sementeAtual.indiceAtual > sequenciaVector.length-1 ){
        sementeAtual.indiceAtual = 0;
    }

    let meuNumeroTal = sequenciaVector.readIndex(sementeAtual.indiceAtual);
    sementeAtual.indiceAtual++;
    sementeAtual.vezesJaUsouAteAgora++;

    //Vai variando os valores
    let operacaoAAplicar = sementeAtual.indiceAtual % 2 == 0 ? '+' : '-';

    if( sementeAtual.indiceAtual < sequenciaVector.length ){
        if( sementeAtual.numeroAnterior != undefined && typeof sementeAtual.numeroAnterior == 'number' ){
            switch(operacaoAAplicar){
                case '+':
                    sementeAtual.sequencia[sementeAtual.indiceAtual] += ( (1/100 * sementeAtual.numeroAnterior) );
                    break;
                case '-':
                    sementeAtual.sequencia[sementeAtual.indiceAtual] -= ( (1/100 * sementeAtual.numeroAnterior) );
                    break;
            }
        }
    }

    let numeroGeradoDeAgora = ( (meuNumeroTal * sementeAtual.multiplicador) / (sementeAtual.vezesJaUsouAteAgora < 100 ? sementeAtual.vezesJaUsouAteAgora+10 : sementeAtual.vezesJaUsouAteAgora) ) * meuNumeroTal * sementeAtual.multiplicador;
    sementeAtual.numeroAnterior = numeroGeradoDeAgora;
    return numeroGeradoDeAgora;
}

/**
 * Permite gerar um número aleatorio entre um número inicial e final
 * Isso respeita o template definido, fazendo com que os números gerado sejam sempre os mesmos
 * 
 * @param {Number} minimo 
 * @param {Number} maximo 
 * @param {Number} sementeDefinida 
 * @returns {Number}
 */
window.Vectorization.Random.gerarNumeroAleatorio = function(minimo, maximo, sementeDefinida=window.Vectorization.Random._sementeDefinida){
    //Verificar a semente
    let sementeAleatoria = null;
    if( sementeDefinida != undefined && typeof sementeDefinida == 'number' ){
        sementeAleatoria = window.Vectorization.Random._get_dados_semente(sementeDefinida);
    }else{
        sementeAleatoria = sementeDefinida;
    }

    //Gerar o valor
    let sequenciaVector = Vectorization.Vector(sementeAleatoria.sequencia);
    let base = sequenciaVector.media() + (Math.PI * sequenciaVector.media()/2);
    let meuNumeroQualquer = (base + (maximo / (minimo+1.2) ) * (25/100 * base)) + minimo;

    //Isso obriga o número a ser menor que o limite(valor máximo que definimos)
    let maxTentativas = 500;
    let quantidadeTentativas = 0;
    while( meuNumeroQualquer > maximo ){
        if( quantidadeTentativas > maxTentativas ){
            break;
        }

        meuNumeroQualquer = window.Vectorization.Random.proximoNumeroDaSequenciaSemente(sementeAleatoria);
        quantidadeTentativas++;
    }

    if( quantidadeTentativas > maxTentativas ){
        meuNumeroQualquer = meuNumeroQualquer - maximo;

        if( meuNumeroQualquer < minimo ){
            meuNumeroQualquer += (minimo/2.5) * (2/100 * base);
        }
    }

    meuNumeroQualquer += minimo;

    return meuNumeroQualquer;
}

/**
 * Permite gerar um número aleatorio entre um número inicial e final
 * Isso respeita o template definido, fazendo com que os números gerado sejam sempre os mesmos
 * 
 * @param {Number} minimo 
 * @param {Number} maximo 
 * @param {Number} sementeDefinida 
 * @returns {Number}
 */
window.Vectorization.Random.gerarNumeroInteiroAleatorio = function(minimo, maximo, sementeDefinida=window.Vectorization.Random._sementeDefinida){
    let numeroAleatorioAtual = window.Vectorization.Random.gerarNumeroAleatorio(minimo, maximo, sementeDefinida=window.Vectorization.Random._sementeDefinida);
    return Number.parseInt(numeroAleatorioAtual);
}

/**
 * Permite gerar um número aleatorio entre um número inicial e final
 * Isso respeita o template definido, fazendo com que os números gerado sejam sempre os mesmos
 * 
 * @param {Number} minimo 
 * @param {Number} maximo 
 * @param {Number} sementeDefinida 
 * @returns {Number}
 */
window.Vectorization.Random.gerarNumeroFloatAleatorio = function(minimo, maximo, sementeDefinida=window.Vectorization.Random._sementeDefinida){
    let numeroAleatorioAtual = window.Vectorization.Random.gerarNumeroAleatorio(minimo, maximo, sementeDefinida=window.Vectorization.Random._sementeDefinida);
    return Number.parseFloat(numeroAleatorioAtual);
}


//Cria uma cópia segura das sementes como elas estavam antes de serem manipuladas/utilizadas pelo usuario
window.Vectorization.Random._sementesIniciais = Vectorization.Vector([... window.Vectorization.Random._sementes.copyWithin()]).duplicar();
window.Vectorization.Random._sementeDefinidaInicial = {... window.Vectorization.Random._sementeDefinida};

window.Vectorization.Random.resetarEstadoInicial = function(){
    window.Vectorization.Random._sementes = window.Vectorization.Random._sementesIniciais.duplicar().valores();
    window.Vectorization.Random.definirSemente( window.Vectorization.Random._numeroSementePadraoDefinida );
    window.Vectorization.Random._sementeDefinida = {... window.Vectorization.Random._sementeDefinidaInicial};
    console.warn('sementes aleatórias redefinidas!')
}


module.exports = window.Vectorization.Random;