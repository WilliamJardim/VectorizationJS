/*
 * File Name: Vectorization.js
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/

var Vectorization_4Node = class{
    constructor(){
        if( typeof window !== 'undefined' ){
            throw 'This class only works in Node';
        }

        //Importando classe raiz
        this.Root = require('./Root');

        this.Utilidades = require('./Utilidades');

        //Importando numeros escalares
        this.Scalar = require('./Scalar');
        this.Scalar_translation = require('./Scalar-translation');

        //Importando Text
        this.Scalar = require('./Text');
        this.Scalar_translation = require('./Text-translation');

        //Importando Vetores
        this.Vector = require('./Vector');
        this.Vector_translation = require('./Vector-translation');

        //Importando Vetores de String
        this.StringVector = require('./StringVector');
        this.StringVector_translation = require('./StringVector-translation');

        this.Random = require('./Random');
        this.Random_translation = require('./Random-translation');

        //Importando Matrizes
        this.Matrix = require('./Matrix');
        this.Matrix_translation = require('./Matrix-translation');
        
        this.StringMatrix = require('./StringMatrix');
        this.StringMatrix_translation = require('./StringMatrix-translation');
    }
}; 

module.exports = new Vectorization_4Node();