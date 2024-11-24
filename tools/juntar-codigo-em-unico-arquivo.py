import os,sys;

def lerArquivo(caminho):
    asLinhas = '';
    with open(caminho, 'r') as arq:
        asLinhas = arq.readlines();

    return asLinhas;

def lerArquivo_Str(caminho):
    return ''.join( lerArquivo(caminho) );

listaBuild = lerArquivo('../examples/browser_import_example.html');

novasLinhas = '';
for linha in listaBuild:
    if '<script src=' in str(linha).lower():
        novasLinhas += linha;

todosOsScripts_Str = novasLinhas;
todosOsScripts_List = novasLinhas.split('\n');

#Tratando removendo coisas nao precisa
novasLinhas = '';
for linha in todosOsScripts_List:
    novasLinhas += linha.replace('<script src=', '')+'\n'

novasLinhas_2 = '';
for linha in novasLinhas.split('\n'):
    novasLinhas_2 += linha.replace('></script>', '')+'\n'

novasLinhas_3 = '';
for linha in novasLinhas_2.split('\n'):
    novasLinhas_3 += linha.replace('"', '')+'\n'

listaScripts = novasLinhas_3.split('\n');

novasLinhas_4 = [];
for linha in listaScripts:
    if linha != '':
        novasLinhas_4.append(linha);

listaScripts = novasLinhas_4;

#Versao tudo junto
from datetime import datetime
agora = datetime.now();

codigoCompleto = '';

codigoCompleto += '''
/*
 * Author Name: William Alves Jardim
 * Author Email: williamalvesjardim@gmail.com
 * 
 * LICENSE: WilliamJardim/Vectorization © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/**
*/
if(typeof window === 'undefined'){
    global.VECTORIZATION_BUILD = true;
    global.VECTORIZATION_BUILD_TYPE = 'node';
}else{
    window.VECTORIZATION_BUILD = true;
    window.VECTORIZATION_BUILD_TYPE = 'navegador';
}
''';

codigoCompleto += '\n/* COMPILADO: ' + str(agora.day)+'/'+str(agora.month)+'/'+str(agora.year) + ' - ' + str(agora.strftime("%H:%M:%S")) + str() + '*/';

for arquivo in listaScripts:
    codigoCompleto += '/* ARQUIVO VECTORIZATION: ' + str(arquivo) + '*/\n'; 
    codigoCompleto += lerArquivo_Str(arquivo) + '\n';
    codigoCompleto += '/* FIM DO ARQUIVO VECTORIZATION: ' + str(arquivo) + '*/\n'; 

def salvarArquivo(caminho, conteudo):
    with open(caminho, 'w') as arq:
        arq.write(conteudo);
        arq.close();

codigoCompleto = codigoCompleto + '\nwindow.isbrowser = true;\n';

salvarArquivo('../build/Vectorization-builded.js', codigoCompleto);
print('Pronto!. Arquivo salvo em ../build/Vectorization-builded.js');

codigoCompletoNN = codigoCompleto;

codigoCompletoNN = codigoCompletoNN + '\nwindow.isbrowser = false;\n';

codigoCompletoNN = codigoCompletoNN + '\nmodule.exports = new Vectorization_4Node();'; 
salvarArquivo('../build/Vectorization-builded-4node.js', codigoCompletoNN);

print('Pronto!. Arquivo salvo em ../build/Vectorization-builded_4node.js');

arquivoTeste = '''
    <html>
        <head>
            <title> Vectorization-builded </title>
        </head>
        <body> Press F11 </body>

        <script src='Vectorization-builded.js'></script>

        <script>

            //Matrix com vetor
            var matrix1 = Vectorization.Matrix([
                [3,8,6,50],
                [1,2,2,100],
                [4,5,5,5],
                [1,2,2,2]
            ]);

            var vector = Vectorization.Vector([12, 5, 11, 8.5]);

            var result = matrix1.produtoEscalarVetor(vector);

            console.log('Matrix com Vector', result.values());
            
        </script>

    </html>
'''
salvarArquivo('../build/browser-import-example.html', arquivoTeste)

arquivoTesteNode = '''
    /*
    * How to import Vectorization in NodeJS
    * Como importar o Vectorization no NodeJS
    *
    * require('../src/Vectorization/ClassName.js');
    */

    const Vectorization = require('./Vectorization-builded-4node');

    //Matrix com vetor
    var matrix1 = Vectorization.Matrix([
        [3,8,6,50],
        [1,2,2,100],
        [4,5,5,5],
        [1,2,2,2]
    ]);

    var vector = Vectorization.Vector([12, 5, 11, 8.5]);

    var result = matrix1.produtoEscalarVetor(vector);

    console.log('Matrix com Vector', result.values());
''';

salvarArquivo('../build/node-import-example.js', arquivoTesteNode)